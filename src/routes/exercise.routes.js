const express = require('express');
const router = express.Router();
const ExerciseController = require('../controllers/ExerciseController');
const validate = require('../middlewares/validate');
const { CreateExerciseSchema, UpdateExerciseSchema } = require('../schemas/exercise.schema');

// Rotas de exercícios
router.post('/', validate(CreateExerciseSchema), ExerciseController.create);
router.get('/', ExerciseController.getAll);
router.get('/search', ExerciseController.getByName);
router.get('/:id', ExerciseController.getById);
router.put('/:id', validate(UpdateExerciseSchema), ExerciseController.update);
router.delete('/:id', ExerciseController.delete);

module.exports = router;
