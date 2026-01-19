const express = require('express');
const router = express.Router();
const TrainingExerciseController = require('../controllers/TrainingExerciseController');
const validate = require('../middlewares/validate');
const { CreateTrainingExerciseSchema, UpdateTrainingExerciseSchema } = require('../schemas/trainingExercise.schema');

// Rotas de exercícios de treinos
router.post('/', validate(CreateTrainingExerciseSchema), TrainingExerciseController.create);
router.get('/', TrainingExerciseController.getAll);
router.get('/training/:trainingId', TrainingExerciseController.getByTrainingId);
router.get('/exercise/:exerciseId', TrainingExerciseController.getByExerciseId);
router.get('/:id', TrainingExerciseController.getById);
router.put('/:id', validate(UpdateTrainingExerciseSchema), TrainingExerciseController.update);
router.delete('/:id', TrainingExerciseController.delete);

module.exports = router;
