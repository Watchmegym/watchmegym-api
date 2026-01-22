const { prisma } = require('../config');

class UserRepository {
  // Criar usuário
  async create(userData) {
    try {
      return await prisma.user.create({
        data: userData
      });
    } catch (error) {
      // Tratar erro de constraint única (CPF/CNPJ duplicado)
      if (error.code === 'P2002') {
        const target = error.meta?.target || [];
        if (target.includes('cpfCnpj')) {
          throw new Error('Este CPF/CNPJ já está cadastrado no sistema');
        }
        if (target.includes('email')) {
          throw new Error('Este email já está cadastrado no sistema');
        }
        if (target.includes('supabaseAuthId')) {
          throw new Error('Este usuário já está cadastrado no sistema');
        }
        throw new Error('Dados já cadastrados no sistema');
      }
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

  // Buscar usuário por Supabase Auth ID
  async findBySupabaseAuthId(supabaseAuthId) {
    try {
      return await prisma.user.findUnique({
        where: { supabaseAuthId }
      });
    } catch (error) {
      throw error;
    }
  }

  // Buscar usuário por CPF/CNPJ
  async findByCpfCnpj(cpfCnpj) {
    try {
      return await prisma.user.findFirst({
        where: { cpfCnpj }
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
