const express = require('express');
const router = express.Router();
const PlanController = require('../controllers/PlanController');
const validate = require('../middlewares/validate');
const { CreatePlanSchema, UpdatePlanSchema, ListPlansSchema } = require('../schemas/plan.schema');

// Criar plano (Admin)
router.post(
  '/',
  validate(CreatePlanSchema),
  PlanController.create.bind(PlanController)
);

// Listar todos os planos (com filtros opcionais)
router.get(
  '/',
  validate(ListPlansSchema, 'query'),
  PlanController.getAll.bind(PlanController)
);

// Listar apenas planos ativos (público)
router.get(
  '/active',
  PlanController.getActive.bind(PlanController)
);

// Contar planos
router.get(
  '/count',
  PlanController.count.bind(PlanController)
);

// Buscar plano por ID
router.get(
  '/:id',
  PlanController.getById.bind(PlanController)
);

// Atualizar plano (Admin)
router.put(
  '/:id',
  validate(UpdatePlanSchema),
  PlanController.update.bind(PlanController)
);

// Ativar/Desativar plano (Admin)
router.patch(
  '/:id/toggle-status',
  PlanController.toggleStatus.bind(PlanController)
);

// Soft delete (desativar) - (Admin)
router.delete(
  '/:id',
  PlanController.delete.bind(PlanController)
);

// Hard delete (apenas se não tiver assinaturas) - (Admin)
router.delete(
  '/:id/hard',
  PlanController.hardDelete.bind(PlanController)
);

module.exports = router;
