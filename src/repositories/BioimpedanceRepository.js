const { prisma } = require('../config');

class BioimpedanceRepository {
  // Criar bioimpedância
  async create(bioimpedanceData) {
    try {
      return await prisma.bioimpedance.create({
        data: bioimpedanceData
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
        orderBy: [
          { measureTime: 'desc' },
          { createdAt: 'desc' }
        ],
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
        orderBy: [
          { measureTime: 'desc' },
          { createdAt: 'desc' }
        ],
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
        data: bioimpedanceData
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
        orderBy: [
          { measureTime: 'desc' },
          { createdAt: 'desc' }
        ],
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

  // Buscar por usuário e horário de medição (para evitar duplicatas)
  async findByMeasureTime(userId, measureTime) {
    try {
      return await prisma.bioimpedance.findFirst({
        where: {
          userId,
          measureTime,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  // Criar ou Atualizar (Upsert) vindo da máquina
  async upsertFromMachine(userId, measureTime, data) {
    try {
      // Procuramos se já existe um registro para este usuário neste horário exato
      // Importante: measureTime pode ser nulo se não vier da máquina corretamente
      const existing = measureTime ? await this.findByMeasureTime(userId, measureTime) : null;

      if (existing) {
        return await this.update(existing.id, data);
      }

      // Ao criar, garantimos que o userId e data estão corretos
      return await this.create({
        ...data,
        userId, // Garante que o userId do sistema seja usado
      });
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new BioimpedanceRepository();
