const { z } = require('zod');

// Schema de validação para criação de treino
const CreateTrainingSchema = z.object({
  name: z
    .string({ required_error: 'Nome é obrigatório' })
    .min(3, 'Nome deve ter no mínimo 3 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres')
    .trim(),
  
  description: z
    .string()
    .trim()
    .refine(
      (val) => val === '' || val.length >= 5,
      { message: 'Descrição deve ter no mínimo 5 caracteres' }
    )
    .refine(
      (val) => val === '' || val.length <= 2000,
      { message: 'Descrição deve ter no máximo 2000 caracteres' }
    )
    .default(''),
});

// Schema de validação para atualização de treino
const UpdateTrainingSchema = z.object({
  name: z
    .string()
    .min(3, 'Nome deve ter no mínimo 3 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres')
    .trim()
    .optional(),
  
  description: z
    .string()
    .trim()
    .refine(
      (val) => val === '' || val.length >= 5,
      { message: 'Descrição deve ter no mínimo 5 caracteres' }
    )
    .refine(
      (val) => val === '' || val.length <= 2000,
      { message: 'Descrição deve ter no máximo 2000 caracteres' }
    )
    .optional(),
});

module.exports = {
  CreateTrainingSchema,
  UpdateTrainingSchema,
};
