const express = require('express');
const router = express.Router();
const CameraController = require('../controllers/CameraController');
const { validate } = require('../middlewares/validate');
const { CreateCameraSchema, UpdateCameraSchema } = require('../schemas/camera.schema');

// Rotas de câmeras
router.post('/', validate(CreateCameraSchema), CameraController.create);
router.get('/', CameraController.getAll);
router.get('/search', CameraController.getByName);
router.get('/academy/:academyId', CameraController.getByAcademyId);
router.get('/academy/:academyId/enabled', CameraController.getEnabledByAcademyId);
router.get('/exercise/:exerciseId', CameraController.getByExerciseId);
router.get('/:id', CameraController.getById);
router.put('/:id', validate(UpdateCameraSchema), CameraController.update);
router.patch('/:id/toggle', CameraController.toggleEnabled);
router.delete('/:id', CameraController.delete);

module.exports = router;
