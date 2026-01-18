const { z } = require('zod');

// Schema para criar assinatura
const CreateSubscriptionSchema = z.object({
  userId: z.string()
    .uuid('ID do usuário inválido'),
  
  planId: z.string()
    .uuid('ID do plano inválido'),
  
  paymentMethod: z.enum(['CREDIT_CARD', 'BOLETO', 'PIX', 'UNDEFINED'], {
    errorMap: () => ({ message: 'Método de pagamento inválido' })
  }).optional(),
  
  startDate: z.string()
    .datetime('Data de início inválida')
    .optional()
    .or(z.date().optional()),
  
  autoRenew: z.boolean()
    .optional()
    .default(true),

  // Dados do cartão de crédito (se necessário)
  creditCard: z.object({
    holderName: z.string().min(3, 'Nome do titular inválido'),
    number: z.string().regex(/^\d{13,19}$/, 'Número do cartão inválido'),
    expiryMonth: z.string().regex(/^\d{2}$/, 'Mês de validade inválido'),
    expiryYear: z.string().regex(/^\d{4}$/, 'Ano de validade inválido'),
    ccv: z.string().regex(/^\d{3,4}$/, 'CVV inválido'),
  }).optional(),

  // Dados adicionais do cliente (para criar no Asaas se necessário)
  customer: z.object({
    cpfCnpj: z.string().optional(),
    phone: z.string().optional(),
    postalCode: z.string().optional(),
    address: z.string().optional(),
    addressNumber: z.string().optional(),
    complement: z.string().optional(),
    province: z.string().optional(),
  }).optional(),
});

// Schema para atualizar assinatura
const UpdateSubscriptionSchema = z.object({
  status: z.enum(['ACTIVE', 'EXPIRED', 'CANCELED', 'SUSPENDED'], {
    errorMap: () => ({ message: 'Status inválido' })
  }).optional(),
  
  endDate: z.string()
    .datetime('Data de término inválida')
    .optional()
    .or(z.date().optional()),
  
  nextDueDate: z.string()
    .datetime('Próxima data de vencimento inválida')
    .optional()
    .or(z.date().optional()),
  
  autoRenew: z.boolean().optional(),
});

// Schema para cancelar assinatura
const CancelSubscriptionSchema = z.object({
  reason: z.string()
    .min(10, 'Motivo deve ter pelo menos 10 caracteres')
    .max(500, 'Motivo deve ter no máximo 500 caracteres')
    .optional(),
});

// Schema para buscar assinaturas (query params)
const ListSubscriptionsSchema = z.object({
  status: z.enum(['ACTIVE', 'EXPIRED', 'CANCELED', 'SUSPENDED']).optional(),
  userId: z.string().uuid().optional(),
  planId: z.string().uuid().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});

module.exports = {
  CreateSubscriptionSchema,
  UpdateSubscriptionSchema,
  CancelSubscriptionSchema,
  ListSubscriptionsSchema,
};
