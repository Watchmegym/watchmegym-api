const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');
const validate = require('../middlewares/validate');
const {
  LoginSchema,
  RegisterSchema,
  RefreshTokenSchema,
  ForgotPasswordSchema,
  ResetPasswordSchema,
} = require('../schemas/auth.schema');

// POST /api/auth/login - Fazer login
router.post('/login', validate(LoginSchema), AuthController.login);

// POST /api/auth/register - Registrar novo usuário
router.post('/register', validate(RegisterSchema), AuthController.register);

// POST /api/auth/register-with-files - Registrar com URLs de arquivos já prontas
router.post('/register-with-files', AuthController.registerWithFiles);

// POST /api/auth/refresh - Atualizar tokens
router.post('/refresh', validate(RefreshTokenSchema), AuthController.refreshToken);

// POST /api/auth/logout - Fazer logout
router.post('/logout', AuthController.logout);

// POST /api/auth/forgot-password - Solicitar recuperação de senha
router.post('/forgot-password', validate(ForgotPasswordSchema), AuthController.forgotPassword);

// POST /api/auth/reset-password - Resetar senha
router.post('/reset-password', validate(ResetPasswordSchema), AuthController.resetPassword);

// GET /api/auth/me - Obter dados do usuário logado
router.get('/me', AuthController.me);

module.exports = router;
