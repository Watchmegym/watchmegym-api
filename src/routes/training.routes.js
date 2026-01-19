const express = require('express');
const router = express.Router();
const TrainingController = require('../controllers/TrainingController');
const validate = require('../middlewares/validate');
const { CreateTrainingSchema, UpdateTrainingSchema } = require('../schemas/training.schema');

// Rotas de treinos
router.post('/', validate(CreateTrainingSchema), TrainingController.create);
router.get('/', TrainingController.getAll);
router.get('/search', TrainingController.getByName);
router.get('/:id', TrainingController.getById);
router.put('/:id', validate(UpdateTrainingSchema), TrainingController.update);
router.delete('/:id', TrainingController.delete);

module.exports = router;
