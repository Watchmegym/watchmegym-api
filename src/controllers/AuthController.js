const AuthService = require('../services/AuthService');

class AuthController {
  /**
   * POST /api/auth/login
   * Fazer login
   */
  async login(req, res) {
    try {
      const { email, password } = req.body;

      const result = await AuthService.login(email, password);

      return res.status(200).json(result);
    } catch (error) {
      console.error('Erro ao fazer login:', error);

      // Erros de autenticação retornam 401
      if (
        error.message.includes('incorretos') ||
        error.message.includes('inativo') ||
        error.message.includes('não confirmado')
      ) {
        return res.status(401).json({
          error: error.message,
        });
      }

      return res.status(500).json({
        error: 'Erro ao fazer login',
        details: error.message,
      });
    }
  }

  /**
   * POST /api/auth/register
   * Registrar novo usuário
   * Agora aceita profilePictureUrl e videoUrl para criar tudo de uma vez
   */
  async register(req, res) {
    try {
      const userData = req.body;

      const result = await AuthService.register(userData);

      return res.status(201).json(result);
    } catch (error) {
      console.error('Erro ao registrar usuário:', error);

      // Erros de validação retornam 400
      if (
        error.message.includes('já está cadastrado') ||
        error.message.includes('CPF/CNPJ') ||
        error.message.includes('Email já está cadastrado')
      ) {
        return res.status(400).json({
          error: error.message,
        });
      }

      return res.status(500).json({
        error: 'Erro ao registrar usuário',
        details: error.message,
      });
    }
  }

  /**
   * POST /api/auth/register-with-files
   * Registrar novo usuário com URLs de arquivos já prontas
   * Cria o usuário no banco apenas após receber as URLs
   */
  async registerWithFiles(req, res) {
    try {
      const { email, password, name, phone, cpfCnpj, profilePictureUrl, faceScanVideoUrl } = req.body;

      if (!faceScanVideoUrl) {
        return res.status(400).json({
          error: 'Vídeo de scan facial é obrigatório',
        });
      }

      // 1. Verificar se email já existe no banco local
      const UserRepository = require('../repositories/UserRepository');
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

      // 2. Criar apenas no Supabase Auth (não no banco ainda)
      const { supabase } = require('../config/supabase');
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

      // Guardar o ID do usuário criado no Auth para possível rollback
      const supabaseAuthId = authData.user.id;

      try {
        // 3. Criar usuário no banco com as URLs já prontas
        const user = await AuthService.createUserInDatabase(supabaseAuthId, {
          email,
          name,
          phone,
          cpfCnpj,
          profilePictureUrl,
        });

        // 4. Criar registro do vídeo de scan facial
        const UserScanFaceVideoService = require('../services/UserScanFaceVideoService');
        await UserScanFaceVideoService.create({
          userId: user.id,
          videoUrl: faceScanVideoUrl,
        }, null); // null porque a URL já está pronta

        // Se chegou aqui, tudo foi criado com sucesso
      } catch (dbError) {
        // Se falhar ao criar no banco, fazer rollback: deletar do Supabase Auth
        console.error('Erro ao criar usuário no banco, fazendo rollback do Supabase Auth:', dbError);
        try {
          await supabase.auth.admin.deleteUser(supabaseAuthId);
          console.log('✅ Usuário removido do Supabase Auth após falha no banco');
        } catch (deleteError) {
          console.error('⚠️  Erro ao deletar usuário do Supabase Auth após rollback:', deleteError);
          // Continuar mesmo se falhar o delete (pode ser limpo manualmente depois)
        }
        // Re-lançar o erro original para que o cliente saiba que falhou
        throw dbError;
      }

      // 5. Buscar usuário criado para retornar (UserRepository já foi requerido acima)
      const createdUser = await UserRepository.findBySupabaseAuthId(supabaseAuthId);
      
      if (!createdUser) {
        throw new Error('Erro ao buscar usuário criado');
      }

      // 6. Retornar dados do usuário
      return res.status(201).json({
        user: {
          id: createdUser.id,
          email: createdUser.email,
          name: createdUser.name,
          phone: createdUser.phone,
          cpfCnpj: createdUser.cpfCnpj,
          profilePictureUrl: createdUser.profilePictureUrl,
          active: createdUser.active,
          createdAt: createdUser.createdAt,
        },
        message: 'Usuário criado com sucesso com foto e vídeo!',
        session: authData.session ? {
          accessToken: authData.session.access_token,
          refreshToken: authData.session.refresh_token,
          expiresIn: authData.session.expires_in,
          expiresAt: authData.session.expires_at,
          tokenType: authData.session.token_type,
        } : null,
      });
    } catch (error) {
      console.error('Erro ao registrar usuário com arquivos:', error);

      // Erros de validação retornam 400
      if (
        error.message.includes('já está cadastrado') ||
        error.message.includes('CPF/CNPJ') ||
        error.message.includes('Email já está cadastrado')
      ) {
        return res.status(400).json({
          error: error.message,
        });
      }

      return res.status(500).json({
        error: 'Erro ao registrar usuário',
        details: error.message,
      });
    }
  }

  /**
   * POST /api/auth/refresh
   * Atualizar tokens
   */
  async refreshToken(req, res) {
    try {
      const { refreshToken } = req.body;

      const result = await AuthService.refreshToken(refreshToken);

      return res.status(200).json(result);
    } catch (error) {
      console.error('Erro ao atualizar token:', error);

      if (error.message.includes('inválido') || error.message.includes('expirado')) {
        return res.status(401).json({
          error: error.message,
        });
      }

      return res.status(500).json({
        error: 'Erro ao atualizar token',
        details: error.message,
      });
    }
  }

  /**
   * POST /api/auth/logout
   * Fazer logout
   */
  async logout(req, res) {
    try {
      const accessToken = req.headers.authorization?.replace('Bearer ', '');

      if (!accessToken) {
        return res.status(400).json({
          error: 'Access token não fornecido',
        });
      }

      await AuthService.logout(accessToken);

      return res.status(200).json({
        message: 'Logout realizado com sucesso',
      });
    } catch (error) {
      console.error('Erro ao fazer logout:', error);

      return res.status(500).json({
        error: 'Erro ao fazer logout',
        details: error.message,
      });
    }
  }

  /**
   * POST /api/auth/forgot-password
   * Solicitar recuperação de senha
   */
  async forgotPassword(req, res) {
    try {
      const { email } = req.body;

      const result = await AuthService.forgotPassword(email);

      return res.status(200).json(result);
    } catch (error) {
      console.error('Erro ao solicitar recuperação de senha:', error);

      return res.status(500).json({
        error: 'Erro ao solicitar recuperação de senha',
        details: error.message,
      });
    }
  }

  /**
   * POST /api/auth/reset-password
   * Resetar senha usando token
   */
  async resetPassword(req, res) {
    try {
      const { token, password } = req.body;

      const result = await AuthService.resetPassword(token, password);

      return res.status(200).json(result);
    } catch (error) {
      console.error('Erro ao resetar senha:', error);

      return res.status(500).json({
        error: 'Erro ao resetar senha',
        details: error.message,
      });
    }
  }

  /**
   * POST /api/auth/change-password
   * Alterar senha do usuário logado (requer token + senha atual)
   */
  async changePassword(req, res) {
    try {
      const accessToken = req.headers.authorization?.replace('Bearer ', '');
      const { currentPassword, newPassword } = req.body;

      if (!accessToken) {
        return res.status(401).json({
          error: 'Token não fornecido',
        });
      }

      const result = await AuthService.changePassword(
        accessToken,
        currentPassword,
        newPassword,
      );

      return res.status(200).json(result);
    } catch (error) {
      console.error('Erro ao alterar senha:', error);

      if (error.message.includes('Senha atual incorreta')) {
        return res.status(400).json({
          error: error.message,
        });
      }

      return res.status(500).json({
        error: 'Erro ao alterar senha',
        details: error.message,
      });
    }
  }

  /**
   * GET /api/auth/me
   * Obter dados do usuário logado
   */
  async me(req, res) {
    try {
      const accessToken = req.headers.authorization?.replace('Bearer ', '');

      if (!accessToken) {
        return res.status(401).json({
          error: 'Token não fornecido',
        });
      }

      const user = await AuthService.verifyToken(accessToken);

      return res.status(200).json({ user });
    } catch (error) {
      console.error('Erro ao verificar token:', error);

      if (error.message.includes('inválido') || error.message.includes('expirado')) {
        return res.status(401).json({
          error: error.message,
        });
      }

      return res.status(500).json({
        error: 'Erro ao verificar token',
        details: error.message,
      });
    }
  }
}

module.exports = new AuthController();
