const { supabase } = require('../config/supabase');
const UserRepository = require('../repositories/UserRepository');

class AuthService {
  /**
   * Fazer login usando Supabase Auth
   * @param {string} email - Email do usuário
   * @param {string} password - Senha do usuário
   * @returns {Promise<Object>} Dados do usuário e tokens
   */
  async login(email, password) {
    if (!supabase) {
      throw new Error('Supabase não está configurado');
    }

    try {
      // 1. Autenticar com Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        throw new Error(authError.message);
      }

      // 2. Buscar dados completos do usuário no banco
      const user = await UserRepository.findByEmail(email);

      if (!user) {
        throw new Error('Usuário não encontrado no banco de dados');
      }

      if (!user.active) {
        throw new Error('Usuário está inativo');
      }

      // 3. Retornar dados do usuário + tokens do Supabase
      return {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          phone: user.phone,
          cpfCnpj: user.cpfCnpj,
          profilePictureUrl: user.profilePictureUrl,
          active: user.active,
          createdAt: user.createdAt,
        },
        session: {
          accessToken: authData.session.access_token,
          refreshToken: authData.session.refresh_token,
          expiresIn: authData.session.expires_in,
          expiresAt: authData.session.expires_at,
          tokenType: authData.session.token_type,
        },
      };
    } catch (error) {
      // Mapear erros comuns do Supabase
      if (error.message.includes('Invalid login credentials')) {
        throw new Error('Email ou senha incorretos');
      }
      if (error.message.includes('Email not confirmed')) {
        throw new Error('Email ainda não foi confirmado');
      }
      throw error;
    }
  }

  /**
   * Registrar novo usuário usando Supabase Auth
   * @param {Object} userData - Dados do usuário (email, password, name, phone, cpfCnpj)
   * @returns {Promise<Object>} Dados do usuário criado
   */
  async register(userData) {
    if (!supabase) {
      throw new Error('Supabase não está configurado');
    }

    const { email, password, name, phone, cpfCnpj, profilePictureUrl } = userData;

    try {
      // 1. Verificar se email já existe no banco local
      const existingUser = await UserRepository.findByEmail(email);
      if (existingUser) {
        throw new Error('Email já está cadastrado');
      }

      // 1.1. Verificar se CPF/CNPJ já existe (se fornecido)
      if (cpfCnpj) {
        const existingCpf = await UserRepository.findByCpfCnpj(cpfCnpj);
        if (existingCpf) {
          throw new Error('Este CPF/CNPJ já está cadastrado no sistema');
        }
      }

      // 2. Criar usuário no Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            phone,
            cpf_cnpj: cpfCnpj,
          },
        },
      });

      if (authError) {
        throw new Error(authError.message);
      }

      // 3. Criar usuário no banco local (Prisma) vinculado ao Supabase Auth
      // IMPORTANTE: Criar sempre no banco, mas com profilePictureUrl se fornecido
      // Se não fornecido, será atualizado depois quando os uploads forem feitos
      let user;
      try {
        user = await UserRepository.create({
          supabaseAuthId: authData.user.id,  // ← Vincular com auth.users
          email,
          name,
          phone: phone || null,
          cpfCnpj: cpfCnpj || null,
          profilePictureUrl: profilePictureUrl || null,
          active: true,
        });
      } catch (dbError) {
        // Se falhar ao criar no Prisma, tentar deletar o usuário do Supabase Auth
        // para evitar inconsistência (usuário no Auth mas não no banco)
        try {
          await supabase.auth.admin.deleteUser(authData.user.id);
        } catch (deleteError) {
          console.error('Erro ao deletar usuário do Supabase após falha no Prisma:', deleteError);
        }
        // Re-lançar o erro original
        throw dbError;
      }

      // 4. Retornar dados do usuário (sem senha)
      return {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          phone: user.phone,
          cpfCnpj: user.cpfCnpj,
          profilePictureUrl: user.profilePictureUrl,
          active: user.active,
          createdAt: user.createdAt,
        },
        message: authData.user?.identities?.length === 0
          ? 'Usuário criado! Verifique seu email para confirmar a conta.'
          : 'Usuário criado com sucesso!',
        session: authData.session ? {
          accessToken: authData.session.access_token,
          refreshToken: authData.session.refresh_token,
          expiresIn: authData.session.expires_in,
          expiresAt: authData.session.expires_at,
          tokenType: authData.session.token_type,
        } : null,
      };
    } catch (error) {
      // Mapear erros comuns do Supabase
      if (error.message.includes('User already registered')) {
        throw new Error('Email já está cadastrado');
      }
      throw error;
    }
  }

  /**
   * Criar usuário no banco após uploads
   * Cria o usuário no banco apenas após receber as URLs dos uploads
   * @param {string} supabaseAuthId - ID do usuário no Supabase Auth
   * @param {Object} userData - Dados do usuário (email, name, phone, cpfCnpj, profilePictureUrl)
   * @returns {Promise<Object>} Dados do usuário criado
   */
  async createUserInDatabase(supabaseAuthId, userData) {
    const { email, name, phone, cpfCnpj, profilePictureUrl } = userData;

    try {
      // Verificar se usuário já existe no banco
      const existingUser = await UserRepository.findBySupabaseAuthId(supabaseAuthId);
      if (existingUser) {
        // Se já existe, atualizar com as URLs
        if (profilePictureUrl) {
          await UserRepository.update(existingUser.id, { profilePictureUrl });
        }
        return existingUser;
      }

      // Criar usuário no banco com as URLs já prontas
      const user = await UserRepository.create({
        supabaseAuthId,
        email,
        name,
        phone: phone || null,
        cpfCnpj: cpfCnpj || null,
        profilePictureUrl: profilePictureUrl || null,
        active: true,
      });

      return user;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Atualizar tokens usando refresh token
   * @param {string} refreshToken - Refresh token
   * @returns {Promise<Object>} Novos tokens
   */
  async refreshToken(refreshToken) {
    if (!supabase) {
      throw new Error('Supabase não está configurado');
    }

    try {
      const { data, error } = await supabase.auth.refreshSession({
        refresh_token: refreshToken,
      });

      if (error) {
        throw new Error(error.message);
      }

      return {
        accessToken: data.session.access_token,
        refreshToken: data.session.refresh_token,
        expiresIn: data.session.expires_in,
        expiresAt: data.session.expires_at,
        tokenType: data.session.token_type,
      };
    } catch (error) {
      if (error.message.includes('Invalid refresh token')) {
        throw new Error('Token de atualização inválido ou expirado');
      }
      throw error;
    }
  }

  /**
   * Fazer logout (invalidar token)
   * @param {string} accessToken - Access token do usuário
   * @returns {Promise<boolean>}
   */
  async logout(accessToken) {
    if (!supabase) {
      throw new Error('Supabase não está configurado');
    }

    try {
      // Definir o token no cliente antes de fazer logout
      const { error } = await supabase.auth.admin.signOut(accessToken);

      if (error) {
        throw new Error(error.message);
      }

      return true;
    } catch (error) {
      // Mesmo se falhar, retornar true (logout no cliente)
      console.error('Erro ao fazer logout no Supabase:', error.message);
      return true;
    }
  }

  /**
   * Solicitar recuperação de senha
   * @param {string} email - Email do usuário
   * @returns {Promise<Object>}
   */
  async forgotPassword(email) {
    if (!supabase) {
      throw new Error('Supabase não está configurado');
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.APP_URL || 'http://localhost:3000'}/reset-password`,
      });

      if (error) {
        throw new Error(error.message);
      }

      return {
        message: 'Email de recuperação enviado com sucesso!',
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Resetar senha usando token
   * @param {string} accessToken - Token de recuperação
   * @param {string} newPassword - Nova senha
   * @returns {Promise<Object>}
   */
  async resetPassword(accessToken, newPassword) {
    if (!supabase) {
      throw new Error('Supabase não está configurado');
    }

    try {
      // Atualizar senha no Supabase
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        throw new Error(error.message);
      }

      return {
        message: 'Senha atualizada com sucesso!',
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Alterar senha do usuário logado
   * @param {string} accessToken - Access token do usuário
   * @param {string} currentPassword - Senha atual
   * @param {string} newPassword - Nova senha
   * @returns {Promise<Object>}
   */
  async changePassword(accessToken, currentPassword, newPassword) {
    if (!supabase) {
      throw new Error('Supabase não está configurado');
    }

    try {
      // 1. Verificar token e obter usuário
      const userData = await this.verifyToken(accessToken);
      const user = await UserRepository.findBySupabaseAuthId(userData.supabaseAuthId);
      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      // 2. Verificar senha atual
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword,
      });

      if (signInError) {
        if (signInError.message.includes('Invalid login credentials')) {
          throw new Error('Senha atual incorreta');
        }
        throw new Error(signInError.message);
      }

      // 3. Atualizar senha no Supabase (admin API)
      const { error: updateError } = await supabase.auth.admin.updateUserById(
        user.supabaseAuthId,
        { password: newPassword },
      );

      if (updateError) {
        throw new Error(updateError.message);
      }

      return {
        message: 'Senha alterada com sucesso!',
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Verificar se access token é válido
   * @param {string} accessToken - Access token
   * @returns {Promise<Object>} Dados do usuário se válido
   */
  async verifyToken(accessToken) {
    if (!supabase) {
      throw new Error('Supabase não está configurado');
    }

    try {
      const { data, error } = await supabase.auth.getUser(accessToken);

      if (error) {
        throw new Error(error.message);
      }

      // Buscar dados completos do usuário no banco
      // Primeiro tenta por supabaseAuthId, depois por email (para usuários antigos)
      let user = await UserRepository.findBySupabaseAuthId(data.user.id).catch(() => null);
      
      if (!user) {
        user = await UserRepository.findByEmail(data.user.email);
        
        // Se encontrou por email mas não tem supabaseAuthId, atualizar
        if (user && !user.supabaseAuthId) {
          await UserRepository.update(user.id, { supabaseAuthId: data.user.id });
          user.supabaseAuthId = data.user.id;
        }
      }

      if (!user || !user.active) {
        throw new Error('Usuário inválido ou inativo');
      }

      return {
        id: user.id,
        supabaseAuthId: user.supabaseAuthId,
        email: user.email,
        name: user.name,
        phone: user.phone,
        cpfCnpj: user.cpfCnpj,
        profilePictureUrl: user.profilePictureUrl,
        active: user.active,
        createdAt: user.createdAt,
      };
    } catch (error) {
      throw new Error('Token inválido ou expirado');
    }
  }
}

module.exports = new AuthService();
