const UserScanFaceVideoService = require('../services/UserScanFaceVideoService');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;

// Configurar multer para upload de vídeos
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads/scan-face');
    try {
      await fs.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `scan-face-${uniqueSuffix}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/webm'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de arquivo não permitido. Apenas vídeos são aceitos.'));
    }
  },
});

class UserScanFaceVideoController {
  // Middleware de upload (para usar nas rotas)
  uploadMiddleware() {
    return upload.single('video');
  }

  // Criar novo vídeo de scan face
  async create(req, res) {
    try {
      const { userId } = req.body;
      const file = req.file;

      if (!userId) {
        return res.status(400).json({
          error: 'userId é obrigatório',
        });
      }

      let filePath = null;
      if (file) {
        filePath = file.path;
      }

      const video = await UserScanFaceVideoService.create(
        { userId, videoUrl: req.body.videoUrl || '' },
        filePath
      );

      // Limpar arquivo temporário após upload
      if (filePath) {
        try {
          await fs.unlink(filePath);
        } catch (error) {
          console.warn('Erro ao deletar arquivo temporário:', error.message);
        }
      }

      return res.status(201).json({
        message: 'Vídeo de scan face criado com sucesso',
        video,
      });
    } catch (error) {
      console.error('Erro ao criar vídeo de scan face:', error);
      
      // Limpar arquivo temporário em caso de erro
      if (req.file?.path) {
        try {
          await fs.unlink(req.file.path);
        } catch (error) {
          console.warn('Erro ao deletar arquivo temporário:', error.message);
        }
      }

      return res.status(400).json({
        error: error.message || 'Erro ao criar vídeo de scan face',
      });
    }
  }

  // Buscar todos os vídeos
  async getAll(req, res) {
    try {
      const videos = await UserScanFaceVideoService.findAll();

      return res.status(200).json({
        message: 'Lista de vídeos de scan face',
        videos,
      });
    } catch (error) {
      console.error('Erro ao buscar vídeos:', error);
      return res.status(500).json({
        error: 'Erro interno do servidor',
      });
    }
  }

  // Buscar vídeo por ID
  async getById(req, res) {
    try {
      const { id } = req.params;
      const video = await UserScanFaceVideoService.findById(id);

      return res.status(200).json({
        message: 'Vídeo encontrado',
        video,
      });
    } catch (error) {
      console.error('Erro ao buscar vídeo:', error);
      
      if (error.message === 'Vídeo não encontrado') {
        return res.status(404).json({
          error: error.message,
        });
      }

      return res.status(500).json({
        error: 'Erro interno do servidor',
      });
    }
  }

  // Buscar vídeos por usuário
  async getByUserId(req, res) {
    try {
      const { userId } = req.params;
      const videos = await UserScanFaceVideoService.findByUserId(userId);

      return res.status(200).json({
        message: 'Vídeos do usuário',
        videos,
      });
    } catch (error) {
      console.error('Erro ao buscar vídeos do usuário:', error);
      
      if (error.message === 'Usuário não encontrado') {
        return res.status(404).json({
          error: error.message,
        });
      }

      return res.status(500).json({
        error: 'Erro interno do servidor',
      });
    }
  }

  // Buscar vídeo mais recente de um usuário
  async getLatestByUserId(req, res) {
    try {
      const { userId } = req.params;
      const video = await UserScanFaceVideoService.findLatestByUserId(userId);

      if (!video) {
        return res.status(404).json({
          error: 'Nenhum vídeo encontrado para este usuário',
        });
      }

      return res.status(200).json({
        message: 'Vídeo mais recente encontrado',
        video,
      });
    } catch (error) {
      console.error('Erro ao buscar vídeo mais recente:', error);
      
      if (error.message === 'Usuário não encontrado') {
        return res.status(404).json({
          error: error.message,
        });
      }

      return res.status(500).json({
        error: 'Erro interno do servidor',
      });
    }
  }

  // Atualizar vídeo
  async update(req, res) {
    try {
      const { id } = req.params;
      const { userId, videoUrl } = req.body;
      const file = req.file;

      let filePath = null;
      if (file) {
        filePath = file.path;
      }

      const video = await UserScanFaceVideoService.update(
        id,
        { userId, videoUrl },
        filePath
      );

      // Limpar arquivo temporário após upload
      if (filePath) {
        try {
          await fs.unlink(filePath);
        } catch (error) {
          console.warn('Erro ao deletar arquivo temporário:', error.message);
        }
      }

      return res.status(200).json({
        message: 'Vídeo atualizado com sucesso',
        video,
      });
    } catch (error) {
      console.error('Erro ao atualizar vídeo:', error);
      
      // Limpar arquivo temporário em caso de erro
      if (req.file?.path) {
        try {
          await fs.unlink(req.file.path);
        } catch (error) {
          console.warn('Erro ao deletar arquivo temporário:', error.message);
        }
      }

      if (error.message === 'Vídeo não encontrado') {
        return res.status(404).json({
          error: error.message,
        });
      }

      return res.status(400).json({
        error: error.message || 'Erro ao atualizar vídeo',
      });
    }
  }

  // Deletar vídeo
  async delete(req, res) {
    try {
      const { id } = req.params;
      await UserScanFaceVideoService.delete(id);

      return res.status(200).json({
        message: 'Vídeo deletado com sucesso',
      });
    } catch (error) {
      console.error('Erro ao deletar vídeo:', error);
      
      if (error.message === 'Vídeo não encontrado') {
        return res.status(404).json({
          error: error.message,
        });
      }

      return res.status(500).json({
        error: 'Erro interno do servidor',
      });
    }
  }
}

module.exports = new UserScanFaceVideoController();
