const { z } = require('zod');

// Schema para criar pagamento manual
const CreatePaymentSchema = z.object({
  subscriptionId: z.string()
    .uuid('ID da assinatura inválido')
    .optional(),
  
  userId: z.string()
    .uuid('ID do usuário inválido'),
  
  amount: z.number()
    .positive('Valor deve ser maior que zero')
    .min(0.01, 'Valor mínimo é R$ 0,01')
    .max(999999.99, 'Valor máximo é R$ 999.999,99'),
  
  billingType: z.enum(['CREDIT_CARD', 'BOLETO', 'PIX', 'UNDEFINED'], {
    errorMap: () => ({ message: 'Tipo de cobrança inválido' })
  }),
  
  dueDate: z.string()
    .datetime('Data de vencimento inválida')
    .or(z.date()),
  
  description: z.string()
    .max(500, 'Descrição deve ter no máximo 500 caracteres')
    .optional(),
});

// Schema para atualizar pagamento
const UpdatePaymentSchema = z.object({
  status: z.enum(['PENDING', 'RECEIVED', 'CONFIRMED', 'OVERDUE', 'REFUNDED', 'CANCELED'], {
    errorMap: () => ({ message: 'Status inválido' })
  }).optional(),
  
  paymentDate: z.string()
    .datetime('Data de pagamento inválida')
    .optional()
    .or(z.date().optional()),
  
  invoiceUrl: z.string()
    .url('URL do boleto inválida')
    .optional(),
  
  pixQrCode: z.string().optional(),
  
  bankSlipUrl: z.string()
    .url('URL do boleto inválida')
    .optional(),
  
  description: z.string()
    .max(500, 'Descrição deve ter no máximo 500 caracteres')
    .optional(),
});

// Schema para buscar pagamentos (query params)
const ListPaymentsSchema = z.object({
  status: z.enum(['PENDING', 'RECEIVED', 'CONFIRMED', 'OVERDUE', 'REFUNDED', 'CANCELED']).optional(),
  userId: z.string().uuid().optional(),
  subscriptionId: z.string().uuid().optional(),
  billingType: z.enum(['CREDIT_CARD', 'BOLETO', 'PIX', 'UNDEFINED']).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});

// Schema para webhook do Asaas
const AsaasWebhookSchema = z.object({
  event: z.string(),
  payment: z.object({
    id: z.string().optional(),
    customer: z.string().optional(),
    subscription: z.string().optional(),
    installment: z.string().optional(),
    value: z.number().optional(),
    netValue: z.number().optional(),
    originalValue: z.number().optional(),
    interestValue: z.number().optional(),
    description: z.string().optional(),
    billingType: z.string().optional(),
    status: z.string().optional(),
    dueDate: z.string().optional(),
    originalDueDate: z.string().optional(),
    paymentDate: z.string().optional(),
    clientPaymentDate: z.string().optional(),
    invoiceUrl: z.string().optional(),
    bankSlipUrl: z.string().optional(),
    transactionReceiptUrl: z.string().optional(),
    invoiceNumber: z.string().optional(),
    externalReference: z.string().optional(),
  }).optional(),
});

module.exports = {
  CreatePaymentSchema,
  UpdatePaymentSchema,
  ListPaymentsSchema,
  AsaasWebhookSchema,
};
