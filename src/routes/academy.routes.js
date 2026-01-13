const express = require('express');
const router = express.Router();
const AcademyController = require('../controllers/AcademyController');
const { validate } = require('../middlewares/validate');
const { CreateAcademySchema, UpdateAcademySchema } = require('../schemas/academy.schema');

// Rotas de academias
router.post('/', validate(CreateAcademySchema), AcademyController.create);
router.get('/', AcademyController.getAll);
router.get('/search', AcademyController.getByName); // ANTES do /:id
router.get('/:id', AcademyController.getById);
router.put('/:id', validate(UpdateAcademySchema), AcademyController.update);
router.delete('/:id', AcademyController.delete);

module.exports = router;
