const { CreateUserSchema, UpdateUserSchema } = require('../schemas/user.schema');
const UserRepository = require('../repositories/UserRepository');
const { supabase } = require('../config/supabase');
const fs = require('fs').promises;
const path = require('path');

// ⚠️ NOTA: Autenticação agora é gerenciada pelo Supabase Auth
// UserService agora apenas gerencia dados de perfil (não senha)
// Para login/registro, use AuthService

class UserService {
  // Criar novo usuário (SEM senha - gerenciada pelo Supabase)
  async create(userData) {
    try {
      // Validar dados com Zod
      const validatedData = CreateUserSchema.parse(userData);

      // Verificar se email já existe
      const existingUser = await UserRepository.findByEmail(validatedData.email);
      if (existingUser) {
        throw new Error('Email já cadastrado');
      }

      // Salvar no banco (SEM senha)
      const createdUser = await UserRepository.create(validatedData);

      return createdUser;
    } catch (error) {
      throw error;
    }
  }

  // Buscar todos os usuários
  async findAll() {
    try {
      return await UserRepository.findAll();
    } catch (error) {
      throw error;
    }
  }

  // Buscar usuário por ID
  async findById(id) {
    try {
      const user = await UserRepository.findById(id);
      if (!user) {
        throw new Error('Usuário não encontrado');
      }
      return user;
    } catch (error) {
      throw error;
    }
  }

  // Buscar usuário por email
  async findByEmail(email) {
    try {
      const user = await UserRepository.findByEmail(email);
      if (!user) {
        throw new Error('Usuário não encontrado');
      }
      return user;
    } catch (error) {
      throw error;
    }
  }

  // Buscar usuário por Supabase Auth ID
  async findBySupabaseAuthId(supabaseAuthId) {
    try {
      const user = await UserRepository.findBySupabaseAuthId(supabaseAuthId);
      if (!user) {
        throw new Error('Usuário não encontrado');
      }
      return user;
    } catch (error) {
      throw error;
    }
  }

  // Upload de foto de perfil para Supabase Storage
  async uploadProfilePicture(filePath, userId) {
    try {
      if (!supabase) {
        throw new Error('Supabase não está configurado');
      }

      // Ler arquivo
      const fileBuffer = await fs.readFile(filePath);
      const filename = path.basename(filePath);
      const ext = path.extname(filename);

      // Definir caminho no storage
      const storagePath = `profile-pictures/${userId}${ext}`;

      // Upload para Supabase
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('watchmegym')
        .upload(storagePath, fileBuffer, {
          contentType: `image/${ext.replace('.', '')}`,
          upsert: true, // Substituir se já existir
        });

      if (uploadError) {
        console.error('Erro ao fazer upload:', uploadError);
        throw new Error(`Erro ao fazer upload do arquivo: ${uploadError.message}`);
      }

      // Obter URL pública
      const { data: publicUrlData } = supabase.storage
        .from('watchmegym')
        .getPublicUrl(storagePath);

      console.log(`✅ Upload de foto de perfil para Supabase: ${publicUrlData.publicUrl}`);

      return publicUrlData.publicUrl;
    } catch (error) {
      console.error('Erro ao fazer upload da foto de perfil:', error);
      throw error;
    }
  }

  // Atualizar usuário
  async update(id, userData) {
    try {
      // Validar dados com Zod
      const validatedData = UpdateUserSchema.parse(userData);

      // Verificar se usuário existe
      const user = await UserRepository.findById(id);
      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      // Se estiver atualizando email, verificar se já existe
      if (validatedData.email && validatedData.email !== user.email) {
        const existingUser = await UserRepository.findByEmail(validatedData.email);
        if (existingUser) {
          throw new Error('Email já cadastrado');
        }
      }

      // Atualizar no banco
      const updatedUser = await UserRepository.update(id, validatedData);
      return updatedUser;
    } catch (error) {
      throw error;
    }
  }

  // Deletar usuário (soft delete - apenas desativa)
  async delete(id) {
    try {
      // Verificar se usuário existe
      const user = await UserRepository.findById(id);
      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      // Soft delete - apenas desativa
      await UserRepository.update(id, { active: false });
      return true;
    } catch (error) {
      throw error;
    }
  }

  // Deletar permanentemente
  async hardDelete(id) {
    try {
      // Verificar se usuário existe
      const user = await UserRepository.findById(id);
      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      // Deletar permanentemente
      await UserRepository.delete(id);
      return true;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new UserService();
