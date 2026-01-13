const { z } = require('zod');

// Schema de validação para criação de gravação
const CreateRecordSchema = z.object({
  cameraId: z
    .string({ required_error: 'ID da câmera é obrigatório' })
    .uuid('ID da câmera inválido'),
  
  userId: z
    .string({ required_error: 'ID do usuário é obrigatório' })
    .uuid('ID do usuário inválido'),
  
  url: z
    .string({ required_error: 'URL da gravação é obrigatória' })
    .url('URL inválida')
    .trim(),
});

// Schema de validação para atualização de gravação
const UpdateRecordSchema = z.object({
  url: z
    .string()
    .url('URL inválida')
    .trim()
    .optional(),
});

module.exports = {
  CreateRecordSchema,
  UpdateRecordSchema,
};
