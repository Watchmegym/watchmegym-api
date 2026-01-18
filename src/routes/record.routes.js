const express = require('express');
const router = express.Router();
const RecordController = require('../controllers/RecordController');
const validate = require('../middlewares/validate');
const { CreateRecordSchema, UpdateRecordSchema } = require('../schemas/record.schema');

// Rotas de gravações
router.post('/', validate(CreateRecordSchema), RecordController.create);
router.get('/', RecordController.getAll);
router.get('/user/:userId', RecordController.getByUserId);
router.get('/camera/:cameraId', RecordController.getByCameraId);
router.get('/academy/:academyId', RecordController.getByAcademyId);
router.get('/exercise/:exerciseId', RecordController.getByExerciseId);
router.get('/user/:userId/camera/:cameraId', RecordController.getByUserAndCamera);
router.get('/user/:userId/count', RecordController.countByUserId);
router.get('/camera/:cameraId/count', RecordController.countByCameraId);
router.get('/:id', RecordController.getById);
router.put('/:id', validate(UpdateRecordSchema), RecordController.update);
router.delete('/:id', RecordController.delete);

module.exports = router;
