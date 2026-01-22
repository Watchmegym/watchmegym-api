const { PrismaClient } = require('@prisma/client');

// Configurações gerais
const config = {
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || 'development'
};

// Prisma Client Singleton
let prisma;

if (config.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  // Em desenvolvimento, usar global para evitar múltiplas instâncias
  if (!global.prisma) {
    global.prisma = new PrismaClient({
      log: ['query', 'info', 'warn', 'error'],
    });
  }
  prisma = global.prisma;
}

/**
 * Testa a conexão com o banco de dados
 */
async function testDatabaseConnection() {
  try {
    console.log('🔍 Testando conexão com o banco de dados...');
    await prisma.$connect();
    console.log('✅ Conexão com o banco de dados estabelecida com sucesso!');
    
    // Testar uma query simples
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('✅ Query de teste executada com sucesso!');
    return true;
  } catch (error) {
    console.error('');
    console.error('═══════════════════════════════════════════════════════════');
    console.error('❌ ERRO AO CONECTAR AO BANCO DE DADOS:');
    console.error('═══════════════════════════════════════════════════════════');
    console.error('Mensagem:', error.message);
    console.error('Código:', error.code);
    
    if (error.code === 'P1001') {
      console.error('');
      console.error('⚠️  Não foi possível conectar ao servidor de banco de dados');
      console.error('   → Verifique se o servidor está rodando');
      console.error('   → Verifique a URL de conexão (DATABASE_URL) no arquivo .env');
    } else if (error.code === 'P1000') {
      console.error('');
      console.error('⚠️  Falha na autenticação do banco de dados');
      console.error('   → Verifique as credenciais no arquivo .env');
    } else if (error.code === 'P1017') {
      console.error('');
      console.error('⚠️  Servidor de banco de dados fechou a conexão');
      console.error('   → Verifique se o servidor está ativo e acessível');
    }
    
    console.error('');
    if (error.stack) {
      console.error('Stack:', error.stack);
    }
    console.error('═══════════════════════════════════════════════════════════');
    console.error('');
    return false;
  }
}

module.exports = {
  PORT: config.PORT,
  NODE_ENV: config.NODE_ENV,
  prisma,
  testDatabaseConnection
};
