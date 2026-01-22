// Carregar variáveis de ambiente do .env
require('dotenv').config();

const app = require('./src/app');
const { PORT, testDatabaseConnection } = require('./src/config');

// O Render define a porta via variável de ambiente
const port = process.env.PORT || PORT || 3000;

console.log('');
console.log('═══════════════════════════════════════════════════════════');
console.log('          🏋️  WatchMeGym API - Inicializando');
console.log('═══════════════════════════════════════════════════════════');
console.log('');
console.log('📋 Configurações:');
console.log(`   → Ambiente: ${process.env.NODE_ENV || 'development'}`);
console.log(`   → Porta: ${port}`);
console.log(`   → DATABASE_URL: ${process.env.DATABASE_URL ? '✅ Configurada' : '❌ Não configurada'}`);
console.log(`   → SUPABASE_URL: ${process.env.SUPABASE_URL ? '✅ Configurada' : '❌ Não configurada'}`);
console.log(`   → SUPABASE_SERVICE_ROLE_KEY: ${process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅ Configurada' : '❌ Não configurada'}`);
console.log('');

// Tratamento de erros não capturados
process.on('uncaughtException', (error) => {
  console.error('');
  console.error('═══════════════════════════════════════════════════════════');
  console.error('❌ ERRO NÃO CAPTURADO (uncaughtException):');
  console.error('═══════════════════════════════════════════════════════════');
  console.error('Mensagem:', error.message);
  console.error('Stack:', error.stack);
  console.error('═══════════════════════════════════════════════════════════');
  console.error('');
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('');
  console.error('═══════════════════════════════════════════════════════════');
  console.error('❌ PROMISE REJEITADA NÃO TRATADA (unhandledRejection):');
  console.error('═══════════════════════════════════════════════════════════');
  console.error('Razão:', reason);
  if (reason instanceof Error) {
    console.error('Stack:', reason.stack);
  }
  console.error('Promise:', promise);
  console.error('═══════════════════════════════════════════════════════════');
  console.error('');
});

// Inicializar servidor com teste de conexão
async function startServer() {
  // Testar conexão com banco de dados antes de iniciar o servidor
  const dbConnected = await testDatabaseConnection();
  
  if (!dbConnected) {
    console.error('');
    console.error('⚠️  Servidor será iniciado mesmo com falha na conexão do banco');
    console.error('   → Algumas funcionalidades podem não funcionar corretamente');
    console.error('');
  }

  // Tratamento de erros do servidor
  const server = app.listen(port, '0.0.0.0', () => {
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

  // Tratamento de erros do servidor HTTP
  server.on('error', (error) => {
    console.error('');
    console.error('═══════════════════════════════════════════════════════════');
    console.error('❌ ERRO NO SERVIDOR HTTP:');
    console.error('═══════════════════════════════════════════════════════════');
    console.error('Código:', error.code);
    console.error('Mensagem:', error.message);
    console.error('Stack:', error.stack);
    
    if (error.code === 'EADDRINUSE') {
      console.error('');
      console.error('⚠️  A porta já está em uso!');
      console.error(`   Tente usar outra porta ou encerre o processo que está usando a porta ${port}`);
    } else if (error.code === 'EACCES') {
      console.error('');
      console.error('⚠️  Permissão negada para usar a porta!');
      console.error(`   Você precisa de privilégios de administrador para usar a porta ${port}`);
    }
    
    console.error('═══════════════════════════════════════════════════════════');
    console.error('');
    process.exit(1);
  });

  // Log quando o servidor for encerrado
  process.on('SIGTERM', () => {
    console.log('');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('🛑 Encerrando servidor (SIGTERM)...');
    console.log('═══════════════════════════════════════════════════════════');
    server.close(() => {
      console.log('✅ Servidor encerrado com sucesso');
      process.exit(0);
    });
  });

  process.on('SIGINT', () => {
    console.log('');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('🛑 Encerrando servidor (SIGINT)...');
    console.log('═══════════════════════════════════════════════════════════');
    server.close(() => {
      console.log('✅ Servidor encerrado com sucesso');
      process.exit(0);
    });
  });
}

// Iniciar servidor
startServer().catch((error) => {
  console.error('');
  console.error('═══════════════════════════════════════════════════════════');
  console.error('❌ ERRO AO INICIAR SERVIDOR:');
  console.error('═══════════════════════════════════════════════════════════');
  console.error('Mensagem:', error.message);
  console.error('Stack:', error.stack);
  console.error('═══════════════════════════════════════════════════════════');
  console.error('');
  process.exit(1);
});

