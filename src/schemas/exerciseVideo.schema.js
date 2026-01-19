const { z } = require('zod');

// Schema de validação para criação de vídeo de exercício
const CreateExerciseVideoSchema = z.object({
  exerciseId: z
    .string({ required_error: 'ID do exercício é obrigatório' })
    .uuid('ID do exercício deve ser um UUID válido'),
  
  url: z
    .string({ required_error: 'URL é obrigatória' })
    .url('URL deve ser uma URL válida')
    .trim(),
  
  thumbnailUrl: z
    .string()
    .url('Thumbnail URL deve ser uma URL válida')
    .trim()
    .optional()
    .nullable(),
  
  title: z
    .string()
    .min(3, 'Título deve ter no mínimo 3 caracteres')
    .max(200, 'Título deve ter no máximo 200 caracteres')
    .trim()
    .optional()
    .nullable(),
  
  description: z
    .string()
    .max(2000, 'Descrição deve ter no máximo 2000 caracteres')
    .trim()
    .optional()
    .nullable(),
  
  duration: z
    .number()
    .int('Duração deve ser um número inteiro')
    .positive('Duração deve ser um número positivo')
    .optional()
    .nullable(),
});

// Schema de validação para atualização de vídeo de exercício
const UpdateExerciseVideoSchema = z.object({
  exerciseId: z
    .string()
    .uuid('ID do exercício deve ser um UUID válido')
    .optional(),
  
  url: z
    .string()
    .url('URL deve ser uma URL válida')
    .trim()
    .optional(),
  
  thumbnailUrl: z
    .string()
    .url('Thumbnail URL deve ser uma URL válida')
    .trim()
    .optional()
    .nullable(),
  
  title: z
    .string()
    .min(3, 'Título deve ter no mínimo 3 caracteres')
    .max(200, 'Título deve ter no máximo 200 caracteres')
    .trim()
    .optional()
    .nullable(),
  
  description: z
    .string()
    .max(2000, 'Descrição deve ter no máximo 2000 caracteres')
    .trim()
    .optional()
    .nullable(),
  
  duration: z
    .number()
    .int('Duração deve ser um número inteiro')
    .positive('Duração deve ser um número positivo')
    .optional()
    .nullable(),
});

module.exports = {
  CreateExerciseVideoSchema,
  UpdateExerciseVideoSchema,
};
