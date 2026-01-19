const { z } = require('zod');

// Schema de validação para criação de usuário
// NOTA: Password NÃO está aqui - é gerenciado pelo Supabase Auth
// Para criar usuário com autenticação, use AuthService.register()
const CreateUserSchema = z.object({
  supabaseAuthId: z
    .string()
    .optional()
    .nullable(),

  email: z
    .string({ required_error: 'Email é obrigatório' })
    .email('Email inválido')
    .toLowerCase()
    .trim(),
  
  name: z
    .string({ required_error: 'Nome é obrigatório' })
    .min(3, 'Nome deve ter no mínimo 3 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres')
    .trim(),
  
  phone: z
    .string()
    .optional()
    .nullable(),

  cpfCnpj: z
    .string()
    .optional()
    .nullable(),
  
  active: z
    .boolean()
    .optional()
    .default(true),
});

// Schema de validação para atualização de usuário (todos campos opcionais)
// NOTA: Password NÃO pode ser atualizado aqui - use Supabase Auth
const UpdateUserSchema = z.object({
  supabaseAuthId: z
    .string()
    .optional()
    .nullable(),

  email: z
    .string()
    .email('Email inválido')
    .toLowerCase()
    .trim()
    .optional(),
  
  name: z
    .string()
    .min(3, 'Nome deve ter no mínimo 3 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres')
    .trim()
    .optional(),
  
  phone: z
    .string()
    .optional()
    .nullable(),

  cpfCnpj: z
    .string()
    .optional()
    .nullable(),
  
  active: z
    .boolean()
    .optional(),
});

module.exports = {
  CreateUserSchema,
  UpdateUserSchema,
};
