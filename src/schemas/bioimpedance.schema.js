const { z } = require('zod');

// Schema de validação para criação de bioimpedância
const CreateBioimpedanceSchema = z.object({
  userId: z
    .string({ required_error: 'ID do usuário é obrigatório' })
    .uuid('ID do usuário inválido'),
  
  weight: z
    .number({ required_error: 'Peso é obrigatório' })
    .positive('Peso deve ser maior que zero')
    .max(500, 'Peso deve ser menor que 500kg'),
  
  height: z
    .number({ required_error: 'Altura é obrigatória' })
    .positive('Altura deve ser maior que zero')
    .max(3, 'Altura deve ser menor que 3 metros'),
  
  bmi: z
    .number({ required_error: 'IMC é obrigatório' })
    .positive('IMC deve ser maior que zero')
    .max(100, 'IMC inválido'),
  
  bmr: z
    .number({ required_error: 'TMB é obrigatório' })
    .positive('TMB deve ser maior que zero')
    .max(10000, 'TMB inválido'),
});

// Schema de validação para atualização de bioimpedância
const UpdateBioimpedanceSchema = z.object({
  weight: z
    .number()
    .positive('Peso deve ser maior que zero')
    .max(500, 'Peso deve ser menor que 500kg')
    .optional(),
  
  height: z
    .number()
    .positive('Altura deve ser maior que zero')
    .max(3, 'Altura deve ser menor que 3 metros')
    .optional(),
  
  bmi: z
    .number()
    .positive('IMC deve ser maior que zero')
    .max(100, 'IMC inválido')
    .optional(),
  
  bmr: z
    .number()
    .positive('TMB deve ser maior que zero')
    .max(10000, 'TMB inválido')
    .optional(),
});

module.exports = {
  CreateBioimpedanceSchema,
  UpdateBioimpedanceSchema,
};
