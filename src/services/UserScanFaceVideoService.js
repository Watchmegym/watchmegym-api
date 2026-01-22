const { CreateUserScanFaceVideoSchema, UpdateUserScanFaceVideoSchema } = require('../schemas/userScanFaceVideo.schema');
const UserScanFaceVideoRepository = require('../repositories/UserScanFaceVideoRepository');
const UserRepository = require('../repositories/UserRepository');
const { supabase } = require('../config/supabase');
const fs = require('fs').promises;
const path = require('path');

class UserScanFaceVideoService {
  /**
   * Upload de vídeo para Supabase Storage
   * Organiza: scan-face/ano-mes-dia/usuario/video.mp4
   */
  async uploadToStorage(filePath, filename, userId) {
    try {
      if (!supabase) {
        throw new Error('Supabase não configurado');
      }

      // Buscar informações do usuário para organizar melhor
      let userName = 'unknown';
      try {
        const user = await UserRepository.findById(userId);
        if (user && user.name) {
          // Normalizar nome para usar no path (remover espaços, acentos, etc)
          userName = user.name
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '') // Remove acentos
            .replace(/[^a-z0-9]/g, '-') // Substitui caracteres especiais por -
            .replace(/-+/g, '-') // Remove hífens duplicados
            .replace(/^-|-$/g, ''); // Remove hífens no início/fim
        }
      } catch (e) {
        console.warn('Não foi possível buscar nome do usuário:', e.message);
      }

      // Ler arquivo
      const fileBuffer = await fs.readFile(filePath);
      
      // Nome do bucket (pode ser configurado via env, padrão: scan-face)
      const bucketName = process.env.SUPABASE_SCAN_FACE_BUCKET || 'scan-face';
      
      // Path no bucket organizado: scan-face/ano-mes-dia/usuario/video.mp4
      const date = new Date();
      const dateStr = date.toISOString().split('T')[0]; // 2026-01-13
      const storagePath = `${dateStr}/${userName}/${filename}`;

      console.log(`📁 Organizando scan face: ${storagePath}`);

      // Upload para Supabase
      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(storagePath, fileBuffer, {
          contentType: 'video/mp4',
          cacheControl: '3600',
          upsert: false,
        });

      if (error) {
        throw new Error(`Erro no Supabase: ${error.message}`);
      }

      // Retornar URL pública
      const { data: publicUrlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(storagePath);

      console.log(`✅ Upload para Supabase: ${publicUrlData.publicUrl}`);
      return publicUrlData.publicUrl;
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
      throw new Error(`Erro ao fazer upload do arquivo: ${error.message}`);
    }
  }

  /**
   * Deletar vídeo do storage
   */
  async deleteFromStorage(videoUrl) {
    try {
      if (!supabase) {
        console.warn('Supabase não configurado, pulando deleção do storage');
        return;
      }

      // Extrair path do storage da URL
      const urlParts = videoUrl.split('/');
      const bucketIndex = urlParts.findIndex(part => part.includes('storage'));
      
      if (bucketIndex === -1) {
        console.warn('URL do storage não reconhecida:', videoUrl);
        return;
      }

      // Path geralmente está após o bucket name
      const bucketName = process.env.SUPABASE_SCAN_FACE_BUCKET || 'scan-face';
      const pathParts = urlParts.slice(urlParts.indexOf(bucketName) + 1);
      const storagePath = pathParts.join('/');

      const { error } = await supabase.storage
        .from(bucketName)
        .remove([storagePath]);

      if (error) {
        console.warn('Erro ao deletar do storage:', error.message);
      } else {
        console.log(`✅ Vídeo deletado do storage: ${storagePath}`);
      }
    } catch (error) {
      console.warn('Erro ao deletar do storage:', error.message);
    }
  }

  // Criar novo vídeo de scan face
  async create(videoData, filePath = null) {
    try {
      // Validar dados com Zod
      const validatedData = CreateUserScanFaceVideoSchema.parse(videoData);

      // Verificar se usuário existe
      const user = await UserRepository.findById(validatedData.userId);
      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      let videoUrl = validatedData.videoUrl || '';

      // Se houver arquivo, fazer upload para storage
      if (filePath) {
        const filename = path.basename(filePath);
        videoUrl = await this.uploadToStorage(filePath, filename, validatedData.userId);
      }

      // Validar que há uma URL (de upload ou fornecida)
      if (!videoUrl || videoUrl === '') {
        throw new Error('É necessário fornecer videoUrl ou fazer upload de um arquivo');
      }

      // Salvar no banco
      const createdVideo = await UserScanFaceVideoRepository.create({
        userId: validatedData.userId,
        videoUrl,
      });

      return createdVideo;
    } catch (error) {
      throw error;
    }
  }

  // Buscar todos os vídeos
  async findAll() {
    try {
      return await UserScanFaceVideoRepository.findAll();
    } catch (error) {
      throw error;
    }
  }

  // Buscar vídeo por ID
  async findById(id) {
    try {
      const video = await UserScanFaceVideoRepository.findById(id);
      if (!video) {
        throw new Error('Vídeo não encontrado');
      }
      return video;
    } catch (error) {
      throw error;
    }
  }

  // Buscar vídeos por usuário
  async findByUserId(userId) {
    try {
      // Verificar se usuário existe
      const user = await UserRepository.findById(userId);
      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      return await UserScanFaceVideoRepository.findByUserId(userId);
    } catch (error) {
      throw error;
    }
  }

  // Buscar vídeo mais recente de um usuário
  async findLatestByUserId(userId) {
    try {
      // Verificar se usuário existe
      const user = await UserRepository.findById(userId);
      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      return await UserScanFaceVideoRepository.findLatestByUserId(userId);
    } catch (error) {
      throw error;
    }
  }

  // Atualizar vídeo
  async update(id, videoData, filePath = null) {
    try {
      // Validar dados com Zod
      const validatedData = UpdateUserScanFaceVideoSchema.parse(videoData);

      // Verificar se vídeo existe
      const existingVideo = await UserScanFaceVideoRepository.findById(id);
      if (!existingVideo) {
        throw new Error('Vídeo não encontrado');
      }

      let videoUrl = validatedData.videoUrl;

      // Se houver novo arquivo, fazer upload para storage
      if (filePath) {
        // Deletar vídeo antigo do storage
        if (existingVideo.videoUrl) {
          await this.deleteFromStorage(existingVideo.videoUrl);
        }

        const filename = path.basename(filePath);
        videoUrl = await this.uploadToStorage(filePath, filename, existingVideo.userId);
      }

      // Atualizar no banco
      const updatedVideo = await UserScanFaceVideoRepository.update(id, {
        ...validatedData,
        videoUrl: videoUrl || existingVideo.videoUrl,
      });

      return updatedVideo;
    } catch (error) {
      throw error;
    }
  }

  // Deletar vídeo
  async delete(id) {
    try {
      // Verificar se vídeo existe
      const video = await UserScanFaceVideoRepository.findById(id);
      if (!video) {
        throw new Error('Vídeo não encontrado');
      }

      // Deletar do storage
      if (video.videoUrl) {
        await this.deleteFromStorage(video.videoUrl);
      }

      // Deletar do banco
      await UserScanFaceVideoRepository.delete(id);
      return true;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new UserScanFaceVideoService();
