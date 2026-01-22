const express = require('express');
const router = express.Router();
const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const bioimpedanceRoutes = require('./bioimpedance.routes');
const academyRoutes = require('./academy.routes');
const academyUserRoutes = require('./academyUser.routes');
const cameraRoutes = require('./camera.routes');
const exerciseRoutes = require('./exercise.routes');
const exerciseVideoRoutes = require('./exerciseVideo.routes');
const trainingRoutes = require('./training.routes');
const trainingExerciseRoutes = require('./trainingExercise.routes');
const statisticsCameraUserRoutes = require('./statisticsCameraUser.routes');
const recordRoutes = require('./record.routes');
const recordingRoutes = require('./recording.routes');
const planRoutes = require('./plan.routes');
const subscriptionRoutes = require('./subscription.routes');
const paymentRoutes = require('./payment.routes');
const userScanFaceVideoRoutes = require('./userScanFaceVideo.routes');

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

// Rotas de autenticação
router.use('/api/auth', authRoutes);

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

// Rotas de vídeos de exercícios
router.use('/api/exercise-videos', exerciseVideoRoutes);

// Rotas de treinos
router.use('/api/trainings', trainingRoutes);

// Rotas de exercícios de treinos
router.use('/api/training-exercises', trainingExerciseRoutes);

// Rotas de estatísticas
router.use('/api/statistics', statisticsCameraUserRoutes);

// Rotas de gravações (CRUD)
router.use('/api/records', recordRoutes);

// Rotas de gravação RTSP (Funcionalidade de captura)
router.use('/api/recordings', recordingRoutes);

// Rotas de planos
router.use('/api/plans', planRoutes);

// Rotas de assinaturas
router.use('/api/subscriptions', subscriptionRoutes);

// Rotas de pagamentos
router.use('/api/payments', paymentRoutes);

// Rotas de vídeos de scan face
router.use('/api/scan-face-videos', userScanFaceVideoRoutes);

module.exports = router;
