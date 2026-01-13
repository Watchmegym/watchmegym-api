const { prisma } = require('../config');

class RecordRepository {
  // Criar gravação
  async create(recordData) {
    try {
      return await prisma.record.create({
        data: recordData,
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

  // Buscar todas as gravações
  async findAll() {
    try {
      return await prisma.record.findMany({
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

  // Buscar gravação por ID
  async findById(id) {
    try {
      return await prisma.record.findUnique({
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

  // Buscar gravações por usuário
  async findByUserId(userId) {
    try {
      return await prisma.record.findMany({
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

  // Buscar gravações por câmera
  async findByCameraId(cameraId) {
    try {
      return await prisma.record.findMany({
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

  // Buscar gravações por academia (via câmera)
  async findByAcademyId(academyId) {
    try {
      return await prisma.record.findMany({
        where: {
          camera: {
            academyId: academyId,
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

  // Buscar gravações por exercício (via câmera)
  async findByExerciseId(exerciseId) {
    try {
      return await prisma.record.findMany({
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

  // Buscar gravações por usuário e câmera
  async findByUserAndCamera(userId, cameraId) {
    try {
      return await prisma.record.findMany({
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

  // Contar gravações por usuário
  async countByUserId(userId) {
    try {
      return await prisma.record.count({
        where: { userId },
      });
    } catch (error) {
      throw error;
    }
  }

  // Contar gravações por câmera
  async countByCameraId(cameraId) {
    try {
      return await prisma.record.count({
        where: { cameraId },
      });
    } catch (error) {
      throw error;
    }
  }

  // Atualizar gravação
  async update(id, recordData) {
    try {
      return await prisma.record.update({
        where: { id },
        data: recordData,
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

  // Deletar gravação
  async delete(id) {
    try {
      return await prisma.record.delete({
        where: { id },
      });
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new RecordRepository();
