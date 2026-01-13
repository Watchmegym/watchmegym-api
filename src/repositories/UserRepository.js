const { prisma } = require('../config');

class UserRepository {
  // Criar usuário
  async create(userData) {
    try {
      return await prisma.user.create({
        data: userData
      });
    } catch (error) {
      throw error;
    }
  }

  // Buscar todos os usuários
  async findAll() {
    try {
      return await prisma.user.findMany({
        orderBy: {
          createdAt: 'desc'
        }
      });
    } catch (error) {
      throw error;
    }
  }

  // Buscar usuário por ID
  async findById(id) {
    try {
      return await prisma.user.findUnique({
        where: { id }
      });
    } catch (error) {
      throw error;
    }
  }

  // Buscar usuário por email
  async findByEmail(email) {
    try {
      return await prisma.user.findUnique({
        where: { email }
      });
    } catch (error) {
      throw error;
    }
  }

  // Atualizar usuário
  async update(id, userData) {
    try {
      return await prisma.user.update({
        where: { id },
        data: userData
      });
    } catch (error) {
      throw error;
    }
  }

  // Deletar usuário permanentemente
  async delete(id) {
    try {
      return await prisma.user.delete({
        where: { id }
      });
    } catch (error) {
      throw error;
    }
  }

  // Buscar usuários ativos
  async findActive() {
    try {
      return await prisma.user.findMany({
        where: { active: true },
        orderBy: {
          createdAt: 'desc'
        }
      });
    } catch (error) {
      throw error;
    }
  }

  // Fechar conexão do Prisma
  async disconnect() {
    await prisma.$disconnect();
  }
}

module.exports = new UserRepository();
