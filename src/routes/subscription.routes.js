const express = require('express');
const router = express.Router();
const SubscriptionController = require('../controllers/SubscriptionController');
const validate = require('../middlewares/validate');
const { 
  CreateSubscriptionSchema, 
  UpdateSubscriptionSchema,
  CancelSubscriptionSchema,
  ListSubscriptionsSchema 
} = require('../schemas/subscription.schema');

// Criar assinatura
router.post(
  '/',
  validate(CreateSubscriptionSchema),
  SubscriptionController.create.bind(SubscriptionController)
);

// Listar todas as assinaturas (com filtros opcionais)
router.get(
  '/',
  validate(ListSubscriptionsSchema, 'query'),
  SubscriptionController.getAll.bind(SubscriptionController)
);

// Minha assinatura ativa (usuário logado)
router.get(
  '/me',
  SubscriptionController.getMySubscription.bind(SubscriptionController)
);

// Contar assinaturas
router.get(
  '/count',
  SubscriptionController.count.bind(SubscriptionController)
);

// Verificar e atualizar assinaturas expiradas (Admin/Cron)
router.post(
  '/check-expired',
  SubscriptionController.checkExpired.bind(SubscriptionController)
);

// Buscar assinatura por ID
router.get(
  '/:id',
  SubscriptionController.getById.bind(SubscriptionController)
);

// Buscar assinaturas de um usuário
router.get(
  '/user/:userId',
  SubscriptionController.getByUserId.bind(SubscriptionController)
);

// Buscar assinatura ativa de um usuário
router.get(
  '/user/:userId/active',
  SubscriptionController.getActiveByUserId.bind(SubscriptionController)
);

// Atualizar assinatura
router.put(
  '/:id',
  validate(UpdateSubscriptionSchema),
  SubscriptionController.update.bind(SubscriptionController)
);

// Cancelar assinatura
router.post(
  '/:id/cancel',
  validate(CancelSubscriptionSchema),
  SubscriptionController.cancel.bind(SubscriptionController)
);

// Reativar assinatura
router.post(
  '/:id/reactivate',
  SubscriptionController.reactivate.bind(SubscriptionController)
);

// Deletar assinatura (Admin)
router.delete(
  '/:id',
  SubscriptionController.delete.bind(SubscriptionController)
);

module.exports = router;
