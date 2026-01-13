const { prisma } = require('../config');

class CameraRepository {
  // Criar câmera
  async create(cameraData) {
    try {
      return await prisma.camera.create({
        data: cameraData,
        include: {
          academy: true,
          exercise: true,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  // Buscar todas as câmeras
  async findAll() {
    try {
      return await prisma.camera.findMany({
        include: {
          academy: true,
          exercise: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    } catch (error) {
      throw error;
    }
  }

  // Buscar câmera por ID
  async findById(id) {
    try {
      return await prisma.camera.findUnique({
        where: { id },
        include: {
          academy: true,
          exercise: true,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  // Buscar câmeras por academia
  async findByAcademyId(academyId) {
    try {
      return await prisma.camera.findMany({
        where: { academyId },
        include: {
          academy: true,
          exercise: true,
        },
        orderBy: {
          name: 'asc',
        },
      });
    } catch (error) {
      throw error;
    }
  }

  // Buscar câmeras ativas por academia
  async findEnabledByAcademyId(academyId) {
    try {
      return await prisma.camera.findMany({
        where: {
          academyId,
          enabled: true,
        },
        include: {
          academy: true,
          exercise: true,
        },
        orderBy: {
          name: 'asc',
        },
      });
    } catch (error) {
      throw error;
    }
  }

  // Buscar câmeras por nome
  async findByName(name) {
    try {
      return await prisma.camera.findMany({
        where: {
          name: {
            contains: name,
            mode: 'insensitive',
          },
        },
        include: {
          academy: true,
          exercise: true,
        },
        orderBy: {
          name: 'asc',
        },
      });
    } catch (error) {
      throw error;
    }
  }

  // Atualizar câmera
  async update(id, cameraData) {
    try {
      return await prisma.camera.update({
        where: { id },
        data: cameraData,
        include: {
          academy: true,
          exercise: true,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  // Deletar câmera
  async delete(id) {
    try {
      return await prisma.camera.delete({
        where: { id },
      });
    } catch (error) {
      throw error;
    }
  }

  // Habilitar/Desabilitar câmera
  async toggleEnabled(id, enabled) {
    try {
      return await prisma.camera.update({
        where: { id },
        data: { enabled },
        include: {
          academy: true,
          exercise: true,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  // Buscar câmeras por exercício
  async findByExerciseId(exerciseId) {
    try {
      return await prisma.camera.findMany({
        where: { exerciseId },
        include: {
          academy: true,
          exercise: true,
        },
        orderBy: {
          name: 'asc',
        },
      });
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new CameraRepository();
