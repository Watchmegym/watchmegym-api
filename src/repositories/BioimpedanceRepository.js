const { prisma } = require('../config');

class BioimpedanceRepository {
  // Criar bioimpedância
  async create(bioimpedanceData) {
    try {
      return await prisma.bioimpedance.create({
        data: bioimpedanceData,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });
    } catch (error) {
      throw error;
    }
  }

  // Buscar todas as bioimpedâncias
  async findAll() {
    try {
      return await prisma.bioimpedance.findMany({
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    } catch (error) {
      throw error;
    }
  }

  // Buscar bioimpedância por ID
  async findById(id) {
    try {
      return await prisma.bioimpedance.findUnique({
        where: { id },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });
    } catch (error) {
      throw error;
    }
  }

  // Buscar bioimpedâncias por usuário
  async findByUserId(userId) {
    try {
      return await prisma.bioimpedance.findMany({
        where: { userId },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    } catch (error) {
      throw error;
    }
  }

  // Atualizar bioimpedância
  async update(id, bioimpedanceData) {
    try {
      return await prisma.bioimpedance.update({
        where: { id },
        data: bioimpedanceData,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });
    } catch (error) {
      throw error;
    }
  }

  // Deletar bioimpedância
  async delete(id) {
    try {
      return await prisma.bioimpedance.delete({
        where: { id },
      });
    } catch (error) {
      throw error;
    }
  }

  // Buscar última bioimpedância de um usuário
  async findLatestByUserId(userId) {
    try {
      return await prisma.bioimpedance.findFirst({
        where: { userId },
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new BioimpedanceRepository();
