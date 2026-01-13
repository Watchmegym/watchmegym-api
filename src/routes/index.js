const express = require('express');
const router = express.Router();

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

module.exports = router;
