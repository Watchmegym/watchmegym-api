const express = require('express');
const router = express.Router();
const BioimpedanceController = require('../controllers/BioimpedanceController');
const validate = require('../middlewares/validate');
const { CreateBioimpedanceSchema, UpdateBioimpedanceSchema } = require('../schemas/bioimpedance.schema');

// Rotas de bioimpedâncias
router.post('/', validate(CreateBioimpedanceSchema), BioimpedanceController.create);
router.get('/', BioimpedanceController.getAll);
router.get('/:id', BioimpedanceController.getById);
router.get('/user/:userId', BioimpedanceController.getByUserId);
router.get('/user/:userId/latest', BioimpedanceController.getLatestByUserId);
router.put('/:id', validate(UpdateBioimpedanceSchema), BioimpedanceController.update);
router.delete('/:id', BioimpedanceController.delete);

module.exports = router;
