const express = require('express');
const router = express.Router();
const ExerciseVideoController = require('../controllers/ExerciseVideoController');
const validate = require('../middlewares/validate');
const { CreateExerciseVideoSchema, UpdateExerciseVideoSchema } = require('../schemas/exerciseVideo.schema');

// Rotas de vídeos de exercícios
router.post('/', validate(CreateExerciseVideoSchema), ExerciseVideoController.create);
router.get('/', ExerciseVideoController.getAll);
router.get('/search', ExerciseVideoController.getByTitle);
router.get('/exercise/:exerciseId', ExerciseVideoController.getByExerciseId);
router.get('/:id', ExerciseVideoController.getById);
router.put('/:id', validate(UpdateExerciseVideoSchema), ExerciseVideoController.update);
router.delete('/:id', ExerciseVideoController.delete);

module.exports = router;
