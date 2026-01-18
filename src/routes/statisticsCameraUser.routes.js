const express = require('express');
const router = express.Router();
const StatisticsCameraUserController = require('../controllers/StatisticsCameraUserController');
const validate = require('../middlewares/validate');
const { CreateStatisticsCameraUserSchema, UpdateStatisticsCameraUserSchema } = require('../schemas/statisticsCameraUser.schema');

// Rotas de estatísticas
router.post('/', validate(CreateStatisticsCameraUserSchema), StatisticsCameraUserController.create);
router.get('/', StatisticsCameraUserController.getAll);
router.get('/user/:userId', StatisticsCameraUserController.getByUserId);
router.get('/camera/:cameraId', StatisticsCameraUserController.getByCameraId);
router.get('/exercise/:exerciseId', StatisticsCameraUserController.getByExerciseId);
router.get('/user/:userId/camera/:cameraId', StatisticsCameraUserController.getByUserAndCamera);
router.get('/user/:userId/aggregated', StatisticsCameraUserController.getAggregatedByUser);
router.get('/camera/:cameraId/aggregated', StatisticsCameraUserController.getAggregatedByCamera);
router.get('/:id', StatisticsCameraUserController.getById);
router.put('/:id', validate(UpdateStatisticsCameraUserSchema), StatisticsCameraUserController.update);
router.delete('/:id', StatisticsCameraUserController.delete);

module.exports = router;
