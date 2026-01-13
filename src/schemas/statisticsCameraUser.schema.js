const { z } = require('zod');

// Schema de validação para criação de estatística
const CreateStatisticsCameraUserSchema = z.object({
  cameraId: z
    .string({ required_error: 'ID da câmera é obrigatório' })
    .uuid('ID da câmera inválido'),
  
  userId: z
    .string({ required_error: 'ID do usuário é obrigatório' })
    .uuid('ID do usuário inválido'),
  
  quantityRepetitions: z
    .number({ required_error: 'Quantidade de repetições é obrigatória' })
    .int('Quantidade de repetições deve ser um número inteiro')
    .positive('Quantidade de repetições deve ser maior que zero')
    .min(1, 'Quantidade de repetições deve ser no mínimo 1')
    .max(1000, 'Quantidade de repetições deve ser no máximo 1000'),
  
  quantitySets: z
    .number({ required_error: 'Quantidade de séries é obrigatória' })
    .int('Quantidade de séries deve ser um número inteiro')
    .positive('Quantidade de séries deve ser maior que zero')
    .min(1, 'Quantidade de séries deve ser no mínimo 1')
    .max(100, 'Quantidade de séries deve ser no máximo 100'),
});

// Schema de validação para atualização de estatística
const UpdateStatisticsCameraUserSchema = z.object({
  quantityRepetitions: z
    .number()
    .int('Quantidade de repetições deve ser um número inteiro')
    .positive('Quantidade de repetições deve ser maior que zero')
    .min(1, 'Quantidade de repetições deve ser no mínimo 1')
    .max(1000, 'Quantidade de repetições deve ser no máximo 1000')
    .optional(),
  
  quantitySets: z
    .number()
    .int('Quantidade de séries deve ser um número inteiro')
    .positive('Quantidade de séries deve ser maior que zero')
    .min(1, 'Quantidade de séries deve ser no mínimo 1')
    .max(100, 'Quantidade de séries deve ser no máximo 100')
    .optional(),
});

module.exports = {
  CreateStatisticsCameraUserSchema,
  UpdateStatisticsCameraUserSchema,
};
