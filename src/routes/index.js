const express = require('express');
const router = express.Router();
const userRoutes = require('./user.routes');
const bioimpedanceRoutes = require('./bioimpedance.routes');
const academyRoutes = require('./academy.routes');
const academyUserRoutes = require('./academyUser.routes');
const cameraRoutes = require('./camera.routes');
const exerciseRoutes = require('./exercise.routes');

// Rota básica
router.get('/', (req, res) => {
  res.json({ 
    message: 'Bem-vindo à API WatchMeGym!',
    status: 'online'
  });
});

// Rota de health check
router.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK',
    timestamp: new Date().toISOString()
  });
});

// Rotas de usuários
router.use('/api/users', userRoutes);

// Rotas de bioimpedâncias
router.use('/api/bioimpedances', bioimpedanceRoutes);

// Rotas de academias
router.use('/api/academies', academyRoutes);

// Rotas de vínculos academia-usuário
router.use('/api/academy-users', academyUserRoutes);

// Rotas de câmeras
router.use('/api/cameras', cameraRoutes);

// Rotas de exercícios
router.use('/api/exercises', exerciseRoutes);

module.exports = router;
