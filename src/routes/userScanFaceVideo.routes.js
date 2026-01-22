const express = require('express');
const router = express.Router();
const UserScanFaceVideoController = require('../controllers/UserScanFaceVideoController');
const validate = require('../middlewares/validate');
const { CreateUserScanFaceVideoSchema, UpdateUserScanFaceVideoSchema } = require('../schemas/userScanFaceVideo.schema');
const { auth } = require('../middlewares/auth');

// Rotas de vídeos de scan face
// Todas as rotas requerem autenticação
router.post(
  '/',
  auth,
  UserScanFaceVideoController.uploadMiddleware(),
  validate(CreateUserScanFaceVideoSchema),
  (req, res) => UserScanFaceVideoController.create(req, res)
);

router.get(
  '/',
  auth,
  (req, res) => UserScanFaceVideoController.getAll(req, res)
);

router.get(
  '/:id',
  auth,
  (req, res) => UserScanFaceVideoController.getById(req, res)
);

router.get(
  '/user/:userId',
  auth,
  (req, res) => UserScanFaceVideoController.getByUserId(req, res)
);

router.get(
  '/user/:userId/latest',
  auth,
  (req, res) => UserScanFaceVideoController.getLatestByUserId(req, res)
);

router.put(
  '/:id',
  auth,
  UserScanFaceVideoController.uploadMiddleware(),
  validate(UpdateUserScanFaceVideoSchema),
  (req, res) => UserScanFaceVideoController.update(req, res)
);

router.delete(
  '/:id',
  auth,
  (req, res) => UserScanFaceVideoController.delete(req, res)
);

module.exports = router;
