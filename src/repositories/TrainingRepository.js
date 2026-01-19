const { prisma } = require('../config');

class TrainingRepository {
  // Criar treino
  async create(trainingData) {
    try {
      return await prisma.training.create({
        data: trainingData,
        include: {
          exercises: {
            include: {
              exercise: true,
            },
          },
        },
      });
    } catch (error) {
      throw error;
    }
  }

  // Buscar todos os treinos
  async findAll() {
    try {
      return await prisma.training.findMany({
        include: {
          exercises: {
            include: {
              exercise: true,
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

  // Buscar treino por ID
  async findById(id) {
    try {
      return await prisma.training.findUnique({
        where: { id },
        include: {
          exercises: {
            include: {
              exercise: true,
            },
          },
        },
      });
    } catch (error) {
      throw error;
    }
  }

  // Buscar treinos por nome
  async findByName(name) {
    try {
      return await prisma.training.findMany({
        where: {
          name: {
            contains: name,
            mode: 'insensitive',
          },
        },
        include: {
          exercises: {
            include: {
              exercise: true,
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

  // Verificar se treino com mesmo nome já existe
  async findByExactName(name) {
    try {
      return await prisma.training.findFirst({
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

  // Atualizar treino
  async update(id, trainingData) {
    try {
      return await prisma.training.update({
        where: { id },
        data: trainingData,
        include: {
          exercises: {
            include: {
              exercise: true,
            },
          },
        },
      });
    } catch (error) {
      throw error;
    }
  }

  // Deletar treino
  async delete(id) {
    try {
      return await prisma.training.delete({
        where: { id },
      });
    } catch (error) {
      throw error;
    }
  }

  // Contar exercícios associados ao treino
  async countExercises(id) {
    try {
      return await prisma.trainingExercise.count({
        where: { trainingId: id },
      });
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new TrainingRepository();
