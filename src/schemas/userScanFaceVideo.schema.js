const { z } = require('zod');

// Schema de validação para criação de vídeo de scan face
const CreateUserScanFaceVideoSchema = z.object({
  userId: z
    .string({ required_error: 'userId é obrigatório' })
    .uuid('userId deve ser um UUID válido'),
  
  videoUrl: z
    .string()
    .url('videoUrl deve ser uma URL válida')
    .optional()
    .or(z.literal('')), // Permite string vazia se houver upload de arquivo
});

// Schema de validação para atualização de vídeo de scan face
const UpdateUserScanFaceVideoSchema = z.object({
  userId: z
    .string()
    .uuid('userId deve ser um UUID válido')
    .optional(),
  
  videoUrl: z
    .string()
    .url('videoUrl deve ser uma URL válida')
    .optional(),
});

module.exports = {
  CreateUserScanFaceVideoSchema,
  UpdateUserScanFaceVideoSchema,
};
