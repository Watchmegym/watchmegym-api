const { z } = require('zod');

// Schema para criar plano
const CreatePlanSchema = z.object({
  name: z.string()
    .min(3, 'Nome deve ter pelo menos 3 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres'),
  
  description: z.string()
    .min(10, 'Descrição deve ter pelo menos 10 caracteres')
    .max(500, 'Descrição deve ter no máximo 500 caracteres'),
  
  price: z.number()
    .positive('Preço deve ser maior que zero')
    .min(0.01, 'Preço mínimo é R$ 0,01')
    .max(999999.99, 'Preço máximo é R$ 999.999,99'),
  
  billingType: z.enum(['CREDIT_CARD', 'BOLETO', 'PIX', 'UNDEFINED'], {
    errorMap: () => ({ message: 'Tipo de cobrança inválido' })
  }).default('CREDIT_CARD'),
  
  cycle: z.enum(['MONTHLY', 'QUARTERLY', 'YEARLY', 'WEEKLY', 'BIWEEKLY', 'SEMIANNUALLY'], {
    errorMap: () => ({ message: 'Ciclo de cobrança inválido' })
  }).default('MONTHLY'),
  
  features: z.array(z.string()).optional().or(z.record(z.any())).optional(),
  
  active: z.boolean().optional().default(true),
});

// Schema para atualizar plano
const UpdatePlanSchema = z.object({
  name: z.string()
    .min(3, 'Nome deve ter pelo menos 3 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres')
    .optional(),
  
  description: z.string()
    .min(10, 'Descrição deve ter pelo menos 10 caracteres')
    .max(500, 'Descrição deve ter no máximo 500 caracteres')
    .optional(),
  
  price: z.number()
    .positive('Preço deve ser maior que zero')
    .min(0.01, 'Preço mínimo é R$ 0,01')
    .max(999999.99, 'Preço máximo é R$ 999.999,99')
    .optional(),
  
  billingType: z.enum(['CREDIT_CARD', 'BOLETO', 'PIX', 'UNDEFINED'], {
    errorMap: () => ({ message: 'Tipo de cobrança inválido' })
  }).optional(),
  
  cycle: z.enum(['MONTHLY', 'QUARTERLY', 'YEARLY', 'WEEKLY', 'BIWEEKLY', 'SEMIANNUALLY'], {
    errorMap: () => ({ message: 'Ciclo de cobrança inválido' })
  }).optional(),
  
  features: z.array(z.string()).optional().or(z.record(z.any())).optional(),
  
  active: z.boolean().optional(),
});

// Schema para buscar planos (query params)
const ListPlansSchema = z.object({
  active: z.string().transform(val => val === 'true').optional(),
  cycle: z.enum(['MONTHLY', 'QUARTERLY', 'YEARLY', 'WEEKLY', 'BIWEEKLY', 'SEMIANNUALLY']).optional(),
  minPrice: z.string().transform(val => parseFloat(val)).optional(),
  maxPrice: z.string().transform(val => parseFloat(val)).optional(),
});

module.exports = {
  CreatePlanSchema,
  UpdatePlanSchema,
  ListPlansSchema,
};
