const { prisma } = require('../config');

class StatisticsCameraUserRepository {
  // Criar estatística
  async create(statisticsData) {
    try {
      return await prisma.statisticsCameraUserExercise.create({
        data: statisticsData,
        include: {
          camera: {
            include: {
              academy: true,
              exercise: true,
            },
          },
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

  // Buscar todas as estatísticas
  async findAll() {
    try {
      return await prisma.statisticsCameraUserExercise.findMany({
        include: {
          camera: {
            include: {
              academy: true,
              exercise: true,
            },
          },
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

  // Buscar estatística por ID
  async findById(id) {
    try {
      return await prisma.statisticsCameraUserExercise.findUnique({
        where: { id },
        include: {
          camera: {
            include: {
              academy: true,
              exercise: true,
            },
          },
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

  // Buscar estatísticas por usuário
  async findByUserId(userId) {
    try {
      return await prisma.statisticsCameraUserExercise.findMany({
        where: { userId },
        include: {
          camera: {
            include: {
              academy: true,
              exercise: true,
            },
          },
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

  // Buscar estatísticas por câmera
  async findByCameraId(cameraId) {
    try {
      return await prisma.statisticsCameraUserExercise.findMany({
        where: { cameraId },
        include: {
          camera: {
            include: {
              academy: true,
              exercise: true,
            },
          },
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

  // Buscar estatísticas por exercício (via câmera)
  async findByExerciseId(exerciseId) {
    try {
      return await prisma.statisticsCameraUserExercise.findMany({
        where: {
          camera: {
            exerciseId: exerciseId,
          },
        },
        include: {
          camera: {
            include: {
              academy: true,
              exercise: true,
            },
          },
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

  // Buscar estatísticas por usuário e câmera
  async findByUserAndCamera(userId, cameraId) {
    try {
      return await prisma.statisticsCameraUserExercise.findMany({
        where: {
          userId,
          cameraId,
        },
        include: {
          camera: {
            include: {
              academy: true,
              exercise: true,
            },
          },
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

  // Buscar estatísticas agregadas por usuário
  async getAggregatedByUser(userId) {
    try {
      return await prisma.statisticsCameraUserExercise.aggregate({
        where: { userId },
        _sum: {
          quantityRepetitions: true,
          quantitySets: true,
        },
        _avg: {
          quantityRepetitions: true,
          quantitySets: true,
        },
        _count: {
          id: true,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  // Buscar estatísticas agregadas por câmera
  async getAggregatedByCamera(cameraId) {
    try {
      return await prisma.statisticsCameraUserExercise.aggregate({
        where: { cameraId },
        _sum: {
          quantityRepetitions: true,
          quantitySets: true,
        },
        _avg: {
          quantityRepetitions: true,
          quantitySets: true,
        },
        _count: {
          id: true,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  // Atualizar estatística
  async update(id, statisticsData) {
    try {
      return await prisma.statisticsCameraUserExercise.update({
        where: { id },
        data: statisticsData,
        include: {
          camera: {
            include: {
              academy: true,
              exercise: true,
            },
          },
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

  // Deletar estatística
  async delete(id) {
    try {
      return await prisma.statisticsCameraUserExercise.delete({
        where: { id },
      });
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new StatisticsCameraUserRepository();
