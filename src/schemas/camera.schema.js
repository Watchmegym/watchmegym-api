const { z } = require('zod');

// Schema de validação para criação de câmera
const CreateCameraSchema = z.object({
  academyId: z
    .string({ required_error: 'ID da academia é obrigatório' })
    .uuid('ID da academia inválido'),
  
  exerciseId: z
    .string()
    .uuid('ID do exercício inválido')
    .optional()
    .nullable(),
  
  name: z
    .string({ required_error: 'Nome é obrigatório' })
    .min(3, 'Nome deve ter no mínimo 3 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres')
    .trim(),
  
  description: z
    .string({ required_error: 'Descrição é obrigatória' })
    .min(5, 'Descrição deve ter no mínimo 5 caracteres')
    .max(500, 'Descrição deve ter no máximo 500 caracteres')
    .trim(),
  
  url: z
    .string({ required_error: 'URL é obrigatória' })
    .url('URL inválida')
    .trim(),
  
  streamUrl: z
    .string({ required_error: 'URL do stream é obrigatória' })
    .url('URL do stream inválida')
    .trim(),
  
  enabled: z
    .boolean()
    .optional()
    .default(true),
});

// Schema de validação para atualização de câmera
const UpdateCameraSchema = z.object({
  exerciseId: z
    .string()
    .uuid('ID do exercício inválido')
    .optional()
    .nullable(),
  
  name: z
    .string()
    .min(3, 'Nome deve ter no mínimo 3 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres')
    .trim()
    .optional(),
  
  description: z
    .string()
    .min(5, 'Descrição deve ter no mínimo 5 caracteres')
    .max(500, 'Descrição deve ter no máximo 500 caracteres')
    .trim()
    .optional(),
  
  url: z
    .string()
    .url('URL inválida')
    .trim()
    .optional(),
  
  streamUrl: z
    .string()
    .url('URL do stream inválida')
    .trim()
    .optional(),
  
  enabled: z
    .boolean()
    .optional(),
});

module.exports = {
  CreateCameraSchema,
  UpdateCameraSchema,
};
