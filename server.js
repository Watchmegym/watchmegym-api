// Carregar variáveis de ambiente do .env
require('dotenv').config();

const app = require('./src/app');
const { PORT } = require('./src/config');


// O Render define a porta via variável de ambiente
const port = process.env.PORT || PORT || 3000;

console.log('');
console.log('═══════════════════════════════════════════════════════════');
console.log('          🏋️  WatchMeGym API - Inicializando');
console.log('═══════════════════════════════════════════════════════════');

app.listen(port, '0.0.0.0', () => {
  console.log('');
  console.log(`🚀 Servidor rodando na porta ${port}`);
  console.log(`📍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📍 URL: http://localhost:${port}`);
  console.log(`📍 Health Check: http://localhost:${port}/api/health`);
  console.log('');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('  Servidor pronto para receber requisições! ✨');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('');
});
