const express = require('express');
const router = express.Router();
const PaymentController = require('../controllers/PaymentController');
const validate = require('../middlewares/validate');
const { 
  CreatePaymentSchema, 
  UpdatePaymentSchema,
  ListPaymentsSchema 
} = require('../schemas/payment.schema');

// Criar pagamento manual
router.post(
  '/',
  validate(CreatePaymentSchema),
  PaymentController.create.bind(PaymentController)
);

// Listar todos os pagamentos (com filtros opcionais)
router.get(
  '/',
  validate(ListPaymentsSchema, 'query'),
  PaymentController.getAll.bind(PaymentController)
);

// Meus pagamentos (usuário logado)
router.get(
  '/me',
  PaymentController.getMyPayments.bind(PaymentController)
);

// Meus pagamentos pendentes (usuário logado)
router.get(
  '/me/pending',
  PaymentController.getMyPendingPayments.bind(PaymentController)
);

// Contar pagamentos
router.get(
  '/count',
  PaymentController.count.bind(PaymentController)
);

// Verificar e atualizar pagamentos vencidos (Admin/Cron)
router.post(
  '/check-overdue',
  PaymentController.checkOverdue.bind(PaymentController)
);

// Buscar pagamento por ID
router.get(
  '/:id',
  PaymentController.getById.bind(PaymentController)
);

// Buscar pagamentos de um usuário
router.get(
  '/user/:userId',
  PaymentController.getByUserId.bind(PaymentController)
);

// Buscar pagamentos pendentes de um usuário
router.get(
  '/user/:userId/pending',
  PaymentController.getPendingByUserId.bind(PaymentController)
);

// Total pago por um usuário
router.get(
  '/user/:userId/total',
  PaymentController.getTotalPaidByUser.bind(PaymentController)
);

// Buscar pagamentos de uma assinatura
router.get(
  '/subscription/:subscriptionId',
  PaymentController.getBySubscriptionId.bind(PaymentController)
);

// Atualizar pagamento
router.put(
  '/:id',
  validate(UpdatePaymentSchema),
  PaymentController.update.bind(PaymentController)
);

// Marcar pagamento como pago (Admin)
router.post(
  '/:id/mark-as-paid',
  PaymentController.markAsPaid.bind(PaymentController)
);

// Deletar pagamento (Admin)
router.delete(
  '/:id',
  PaymentController.delete.bind(PaymentController)
);

module.exports = router;
