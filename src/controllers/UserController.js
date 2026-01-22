const UserService = require('../services/UserService');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;

// Configurar multer para upload de imagens de perfil
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads/profile-pictures');
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
    cb(null, `profile-${uniqueSuffix}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de arquivo não permitido. Apenas imagens são aceitas.'));
    }
  },
});

class UserController {
  // Middleware de upload (para usar nas rotas)
  uploadMiddleware() {
    return upload.single('profilePicture');
  }
  // Criar novo usuário
  async create(req, res) {
    try {
      const userData = req.body;
      const user = await UserService.create(userData);

      return res.status(201).json({
        message: 'Usuário criado com sucesso',
        user
      });
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      return res.status(400).json({
        error: error.message || 'Erro ao criar usuário'
      });
    }
  }

  // Buscar todos os usuários
  async getAll(req, res) {
    try {
      const users = await UserService.findAll();

      return res.status(200).json({
        message: 'Lista de usuários',
        users
      });
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      return res.status(500).json({
        error: 'Erro interno do servidor'
      });
    }
  }

  // Buscar usuário por ID
  async getById(req, res) {
    try {
      const { id } = req.params;
      const user = await UserService.findById(id);

      return res.status(200).json({
        message: 'Usuário encontrado',
        user
      });
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      
      if (error.message === 'Usuário não encontrado') {
        return res.status(404).json({
          error: error.message
        });
      }

      return res.status(500).json({
        error: 'Erro interno do servidor'
      });
    }
  }

  // Atualizar usuário
  async update(req, res) {
    try {
      const { id } = req.params;
      const userData = req.body;
      const file = req.file; // Arquivo de foto de perfil (se houver)

      // Se houver arquivo, fazer upload e adicionar URL aos dados
      if (file) {
        const profilePictureUrl = await UserService.uploadProfilePicture(file.path, id);
        userData.profilePictureUrl = profilePictureUrl;
      }

      const user = await UserService.update(id, userData);

      // Limpar arquivo temporário após upload
      if (file) {
        try {
          await fs.unlink(file.path);
        } catch (unlinkError) {
          console.error('Erro ao deletar arquivo temporário:', unlinkError);
        }
      }

      return res.status(200).json({
        message: 'Usuário atualizado com sucesso',
        user
      });
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      
      // Limpar arquivo temporário em caso de erro
      if (req.file) {
        try {
          await fs.unlink(req.file.path);
        } catch (unlinkError) {
          console.error('Erro ao deletar arquivo temporário:', unlinkError);
        }
      }
      
      if (error.message === 'Usuário não encontrado') {
        return res.status(404).json({
          error: error.message
        });
      }

      return res.status(400).json({
        error: error.message || 'Erro ao atualizar usuário'
      });
    }
  }

  // Deletar usuário
  async delete(req, res) {
    try {
      const { id } = req.params;
      await UserService.delete(id);

      return res.status(200).json({
        message: 'Usuário deletado com sucesso'
      });
    } catch (error) {
      console.error('Erro ao deletar usuário:', error);
      
      if (error.message === 'Usuário não encontrado') {
        return res.status(404).json({
          error: error.message
        });
      }

      return res.status(500).json({
        error: 'Erro interno do servidor'
      });
    }
  }
}

module.exports = new UserController();
