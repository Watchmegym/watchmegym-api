const { prisma } = require('../config');

class AcademyRepository {
  // Criar academia
  async create(academyData) {
    try {
      return await prisma.academy.create({
        data: academyData
      });
    } catch (error) {
      throw error;
    }
  }

  // Buscar todas as academias
  async findAll() {
    try {
      return await prisma.academy.findMany({
        orderBy: {
          createdAt: 'desc'
        }
      });
    } catch (error) {
      throw error;
    }
  }

  // Buscar academia por ID
  async findById(id) {
    try {
      return await prisma.academy.findUnique({
        where: { id }
      });
    } catch (error) {
      throw error;
    }
  }

  // Buscar academia por email
  async findByEmail(email) {
    try {
      return await prisma.academy.findUnique({
        where: { email }
      });
    } catch (error) {
      throw error;
    }
  }

  // Buscar academia por nome (pesquisa parcial)
  async findByName(name) {
    try {
      return await prisma.academy.findMany({
        where: {
          name: {
            contains: name,
            mode: 'insensitive'
          }
        },
        orderBy: {
          name: 'asc'
        }
      });
    } catch (error) {
      throw error;
    }
  }

  // Atualizar academia
  async update(id, academyData) {
    try {
      return await prisma.academy.update({
        where: { id },
        data: academyData
      });
    } catch (error) {
      throw error;
    }
  }

  // Deletar academia
  async delete(id) {
    try {
      return await prisma.academy.delete({
        where: { id }
      });
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new AcademyRepository();
