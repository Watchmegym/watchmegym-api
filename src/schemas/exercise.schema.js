const { z } = require('zod');

// Schema de validação para criação de exercício
const CreateExerciseSchema = z.object({
  name: z
    .string({ required_error: 'Nome é obrigatório' })
    .min(3, 'Nome deve ter no mínimo 3 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres')
    .trim(),
  
  description: z
    .string({ required_error: 'Descrição é obrigatória' })
    .min(5, 'Descrição deve ter no mínimo 5 caracteres')
    .max(1000, 'Descrição deve ter no máximo 1000 caracteres')
    .trim(),
});

// Schema de validação para atualização de exercício
const UpdateExerciseSchema = z.object({
  name: z
    .string()
    .min(3, 'Nome deve ter no mínimo 3 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres')
    .trim()
    .optional(),
  
  description: z
    .string()
    .min(5, 'Descrição deve ter no mínimo 5 caracteres')
    .max(1000, 'Descrição deve ter no máximo 1000 caracteres')
    .trim()
    .optional(),
});

module.exports = {
  CreateExerciseSchema,
  UpdateExerciseSchema,
};
