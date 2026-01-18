const express = require('express');
const router = express.Router();
const AcademyUserController = require('../controllers/AcademyUserController');
const validate = require('../middlewares/validate');
const { CreateAcademyUserSchema } = require('../schemas/academyUser.schema');

// Rotas de vínculos academia-usuário
router.post('/', validate(CreateAcademyUserSchema), AcademyUserController.create);
router.get('/', AcademyUserController.getAll);
router.get('/:id', AcademyUserController.getById);
router.get('/academy/:academyId', AcademyUserController.getByAcademyId);
router.get('/user/:userId', AcademyUserController.getByUserId);
router.delete('/:id', AcademyUserController.delete);
router.delete('/academy/:academyId/user/:userId', AcademyUserController.deleteByAcademyAndUser);

module.exports = router;
