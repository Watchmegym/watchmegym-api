const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const validate = require('../middlewares/validate');
const { CreateUserSchema, UpdateUserSchema } = require('../schemas/user.schema');

// Rotas de usuários
router.post('/', validate(CreateUserSchema), UserController.create);
router.get('/', UserController.getAll);
router.get('/:id', UserController.getById);
router.put('/:id', validate(UpdateUserSchema), UserController.update);
router.delete('/:id', UserController.delete);

module.exports = router;
