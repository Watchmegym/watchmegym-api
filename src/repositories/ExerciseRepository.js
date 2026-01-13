const { prisma } = require('../config');

class ExerciseRepository {
  // Criar exercício
  async create(exerciseData) {
    try {
      return await prisma.exercise.create({
        data: exerciseData,
        include: {
          cameras: {
            include: {
              academy: true,
            },
          },
        },
      });
    } catch (error) {
      throw error;
    }
  }

  // Buscar todos os exercícios
  async findAll() {
    try {
      return await prisma.exercise.findMany({
        include: {
          cameras: {
            include: {
              academy: true,
            },
          },
        },
        orderBy: {
          name: 'asc',
        },
      });
    } catch (error) {
      throw error;
    }
  }

  // Buscar exercício por ID
  async findById(id) {
    try {
      return await prisma.exercise.findUnique({
        where: { id },
        include: {
          cameras: {
            include: {
              academy: true,
            },
          },
        },
      });
    } catch (error) {
      throw error;
    }
  }

  // Buscar exercícios por nome
  async findByName(name) {
    try {
      return await prisma.exercise.findMany({
        where: {
          name: {
            contains: name,
            mode: 'insensitive',
          },
        },
        include: {
          cameras: {
            include: {
              academy: true,
            },
          },
        },
        orderBy: {
          name: 'asc',
        },
      });
    } catch (error) {
      throw error;
    }
  }

  // Verificar se exercício com mesmo nome já existe
  async findByExactName(name) {
    try {
      return await prisma.exercise.findFirst({
        where: {
          name: {
            equals: name,
            mode: 'insensitive',
          },
        },
      });
    } catch (error) {
      throw error;
    }
  }

  // Atualizar exercício
  async update(id, exerciseData) {
    try {
      return await prisma.exercise.update({
        where: { id },
        data: exerciseData,
        include: {
          cameras: {
            include: {
              academy: true,
            },
          },
        },
      });
    } catch (error) {
      throw error;
    }
  }

  // Deletar exercício
  async delete(id) {
    try {
      return await prisma.exercise.delete({
        where: { id },
      });
    } catch (error) {
      throw error;
    }
  }

  // Contar câmeras associadas ao exercício
  async countCameras(id) {
    try {
      return await prisma.camera.count({
        where: { exerciseId: id },
      });
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new ExerciseRepository();
