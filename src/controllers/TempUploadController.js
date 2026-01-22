const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const { supabase } = require('../config/supabase');

// Obter nome do bucket do Supabase
// Usar o mesmo bucket para tudo (recordings) por enquanto
// Se quiser separar depois, pode criar buckets específicos
const getBucketName = () => {
  return process.env.SUPABASE_STORAGE_BUCKET || 'recordings';
};

// Configurar multer para upload temporário (antes de criar usuário)
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads/temp');
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
    cb(null, `temp-${uniqueSuffix}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB
  },
});

class TempUploadController {
  // Middleware de upload de foto de perfil temporária
  uploadProfilePictureMiddleware() {
    return upload.single('profilePicture');
  }

  // Middleware de upload de vídeo de scan facial temporário
  uploadScanFaceVideoMiddleware() {
    return upload.single('video');
  }

  // Upload temporário de foto de perfil (retorna URL)
  async uploadProfilePicture(req, res) {
    try {
      const { email } = req.body;
      const file = req.file;

      if (!file) {
        return res.status(400).json({
          error: 'Arquivo de foto não fornecido',
        });
      }

      if (!email) {
        return res.status(400).json({
          error: 'Email é obrigatório para upload temporário',
        });
      }

      // Fazer upload para Supabase Storage usando email como identificador temporário
      const fileBuffer = await fs.readFile(file.path);
      const ext = path.extname(file.originalname);
      const storagePath = `temp/profile-pictures/${email}${ext}`;

      // Verificar se Supabase está configurado
      if (!supabase) {
        throw new Error('Supabase não está configurado');
      }

      // Usar o bucket configurado
      const bucketName = getBucketName();
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(storagePath, fileBuffer, {
          contentType: `image/${ext.replace('.', '')}`,
          upsert: true,
        });

      if (uploadError) {
        // Limpar arquivo temporário
        await fs.unlink(file.path).catch(() => {});
        console.error('Erro no upload do Supabase:', uploadError);
        throw new Error(`Erro ao fazer upload: ${uploadError.message}`);
      }

      // Obter URL pública
      const { data: publicUrlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(storagePath);

      // Limpar arquivo temporário
      await fs.unlink(file.path).catch(() => {});

      return res.status(200).json({
        profilePictureUrl: publicUrlData.publicUrl,
      });
    } catch (error) {
      // Limpar arquivo temporário em caso de erro
      if (req.file) {
        await fs.unlink(req.file.path).catch(() => {});
      }
      console.error('Erro ao fazer upload temporário de foto:', error);
      return res.status(500).json({
        error: 'Erro ao fazer upload da foto',
        details: error.message,
      });
    }
  }

  // Upload temporário de vídeo de scan facial (retorna URL)
  async uploadScanFaceVideo(req, res) {
    try {
      const { email } = req.body;
      const file = req.file;

      if (!file) {
        return res.status(400).json({
          error: 'Arquivo de vídeo não fornecido',
        });
      }

      if (!email) {
        return res.status(400).json({
          error: 'Email é obrigatório para upload temporário',
        });
      }

      // Verificar se Supabase está configurado
      if (!supabase) {
        throw new Error('Supabase não está configurado');
      }

      // Fazer upload para Supabase Storage usando email como identificador temporário
      const fileBuffer = await fs.readFile(file.path);
      const ext = path.extname(file.originalname);
      const storagePath = `temp/scan-face/${email}${ext}`;

      // Usar o bucket configurado (mesmo bucket para tudo)
      const bucketName = getBucketName();
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(storagePath, fileBuffer, {
          contentType: 'video/mp4',
          upsert: true,
        });

      if (uploadError) {
        // Limpar arquivo temporário
        await fs.unlink(file.path).catch(() => {});
        console.error('Erro no upload do Supabase:', uploadError);
        throw new Error(`Erro ao fazer upload: ${uploadError.message}`);
      }

      // Obter URL pública
      const { data: publicUrlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(storagePath);

      // Limpar arquivo temporário
      await fs.unlink(file.path).catch(() => {});

      return res.status(200).json({
        videoUrl: publicUrlData.publicUrl,
      });
    } catch (error) {
      // Limpar arquivo temporário em caso de erro
      if (req.file) {
        await fs.unlink(req.file.path).catch(() => {});
      }
      console.error('Erro ao fazer upload temporário de vídeo:', error);
      return res.status(500).json({
        error: 'Erro ao fazer upload do vídeo',
        details: error.message,
      });
    }
  }
}

module.exports = new TempUploadController();
