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

module.exports = {
  PORT: config.PORT,
  NODE_ENV: config.NODE_ENV,
  prisma
};
