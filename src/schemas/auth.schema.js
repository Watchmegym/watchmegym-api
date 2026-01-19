const { z } = require('zod');

// Schema para login
const LoginSchema = z.object({
  email: z
    .string({ required_error: 'Email é obrigatório' })
    .email('Email inválido')
    .toLowerCase()
    .trim(),
  
  password: z
    .string({ required_error: 'Senha é obrigatória' })
    .min(1, 'Senha é obrigatória'),
});

// Schema para registro
const RegisterSchema = z.object({
  email: z
    .string({ required_error: 'Email é obrigatório' })
    .email('Email inválido')
    .toLowerCase()
    .trim(),
  
  password: z
    .string({ required_error: 'Senha é obrigatória' })
    .min(6, 'Senha deve ter no mínimo 6 caracteres')
    .max(50, 'Senha deve ter no máximo 50 caracteres'),
  
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
});

// Schema para refresh token
const RefreshTokenSchema = z.object({
  refreshToken: z
    .string({ required_error: 'Refresh token é obrigatório' })
    .min(1, 'Refresh token é obrigatório'),
});

// Schema para recuperação de senha
const ForgotPasswordSchema = z.object({
  email: z
    .string({ required_error: 'Email é obrigatório' })
    .email('Email inválido')
    .toLowerCase()
    .trim(),
});

// Schema para resetar senha
const ResetPasswordSchema = z.object({
  token: z
    .string({ required_error: 'Token é obrigatório' })
    .min(1, 'Token é obrigatório'),
  
  password: z
    .string({ required_error: 'Nova senha é obrigatória' })
    .min(6, 'Senha deve ter no mínimo 6 caracteres')
    .max(50, 'Senha deve ter no máximo 50 caracteres'),
});

module.exports = {
  LoginSchema,
  RegisterSchema,
  RefreshTokenSchema,
  ForgotPasswordSchema,
  ResetPasswordSchema,
};
