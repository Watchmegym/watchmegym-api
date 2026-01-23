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
const tempUploadRoutes = require('./tempUpload.routes');

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

// Rota de teste HTML
router.get('/test', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="pt-br">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>WatchMeGym API - Teste</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap" rel="stylesheet">
        <style>
            :root {
                --primary: #FFD700;
                --bg: #0A0A0A;
                --card-bg: #1A1A1A;
                --text: #FFFFFF;
                --text-muted: #A0A0A0;
            }
            body {
                font-family: 'Inter', sans-serif;
                background-color: var(--bg);
                color: var(--text);
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                margin: 0;
                overflow: hidden;
            }
            .container {
                text-align: center;
                padding: 3rem;
                background: var(--card-bg);
                border-radius: 24px;
                box-shadow: 0 20px 40px rgba(0,0,0,0.4);
                border: 1px solid rgba(255, 215, 0, 0.1);
                max-width: 500px;
                width: 90%;
                animation: fadeIn 0.8s ease-out;
            }
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }
            .icon {
                font-size: 4rem;
                margin-bottom: 1rem;
            }
            h1 {
                margin: 0;
                font-weight: 800;
                font-size: 2.5rem;
                background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
            }
            p {
                color: var(--text-muted);
                font-size: 1.1rem;
                margin-top: 1rem;
            }
            .status-badge {
                display: inline-flex;
                align-items: center;
                background: rgba(0, 255, 127, 0.1);
                color: #00FF7F;
                padding: 0.5rem 1rem;
                border-radius: 50px;
                font-weight: 600;
                font-size: 0.9rem;
                margin-top: 1.5rem;
            }
            .status-dot {
                width: 8px;
                height: 8px;
                background: #00FF7F;
                border-radius: 50%;
                margin-right: 8px;
                box-shadow: 0 0 10px #00FF7F;
                animation: pulse 2s infinite;
            }
            @keyframes pulse {
                0% { opacity: 1; }
                50% { opacity: 0.4; }
                100% { opacity: 1; }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="icon">🏋️</div>
            <h1>WatchMeGym API</h1>
            <p>O servidor está funcionando perfeitamente e pronto para receber conexões.</p>
            <div class="status-badge">
                <div class="status-dot"></div>
                ONLINE
            </div>
        </div>
    </body>
    </html>
  `);
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

// Rotas de upload temporário (antes de criar usuário)
router.use('/api/temp-upload', tempUploadRoutes);

module.exports = router;
