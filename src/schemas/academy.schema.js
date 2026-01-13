const { z } = require('zod');

// Schema de validação para criação de academia
const CreateAcademySchema = z.object({
  name: z
    .string({ required_error: 'Nome é obrigatório' })
    .min(3, 'Nome deve ter no mínimo 3 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres')
    .trim(),
  
  address: z
    .string({ required_error: 'Endereço é obrigatório' })
    .min(5, 'Endereço deve ter no mínimo 5 caracteres')
    .max(200, 'Endereço deve ter no máximo 200 caracteres')
    .trim(),
  
  phone: z
    .string({ required_error: 'Telefone é obrigatório' })
    .min(10, 'Telefone inválido')
    .max(15, 'Telefone inválido')
    .trim(),
  
  email: z
    .string({ required_error: 'Email é obrigatório' })
    .email('Email inválido')
    .toLowerCase()
    .trim(),
});

// Schema de validação para atualização de academia
const UpdateAcademySchema = z.object({
  name: z
    .string()
    .min(3, 'Nome deve ter no mínimo 3 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres')
    .trim()
    .optional(),
  
  address: z
    .string()
    .min(5, 'Endereço deve ter no mínimo 5 caracteres')
    .max(200, 'Endereço deve ter no máximo 200 caracteres')
    .trim()
    .optional(),
  
  phone: z
    .string()
    .min(10, 'Telefone inválido')
    .max(15, 'Telefone inválido')
    .trim()
    .optional(),
  
  email: z
    .string()
    .email('Email inválido')
    .toLowerCase()
    .trim()
    .optional(),
});

module.exports = {
  CreateAcademySchema,
  UpdateAcademySchema,
};
