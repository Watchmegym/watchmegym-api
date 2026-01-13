const express = require('express');
const router = express.Router();
const userRoutes = require('./user.routes');
const bioimpedanceRoutes = require('./bioimpedance.routes');
const academyRoutes = require('./academy.routes');

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

module.exports = router;
