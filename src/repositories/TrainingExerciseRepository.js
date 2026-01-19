const { prisma } = require('../config');

class TrainingExerciseRepository {
  // Criar exercício de treino
  async create(trainingExerciseData) {
    try {
      return await prisma.trainingExercise.create({
        data: trainingExerciseData,
        include: {
          training: true,
          exercise: true,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  // Buscar todos os exercícios de treinos
  async findAll() {
    try {
      return await prisma.trainingExercise.findMany({
        include: {
          training: true,
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

  // Buscar exercício de treino por ID
  async findById(id) {
    try {
      return await prisma.trainingExercise.findUnique({
        where: { id },
        include: {
          training: true,
          exercise: true,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  // Buscar exercícios por treino
  async findByTrainingId(trainingId) {
    try {
      return await prisma.trainingExercise.findMany({
        where: { trainingId },
        include: {
          training: true,
          exercise: true,
        },
        orderBy: {
          createdAt: 'asc',
        },
      });
    } catch (error) {
      throw error;
    }
  }

  // Buscar exercícios por exercício
  async findByExerciseId(exerciseId) {
    try {
      return await prisma.trainingExercise.findMany({
        where: { exerciseId },
        include: {
          training: true,
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

  // Verificar se já existe a combinação treino-exercício
  async findByTrainingAndExercise(trainingId, exerciseId) {
    try {
      return await prisma.trainingExercise.findFirst({
        where: {
          trainingId,
          exerciseId,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  // Atualizar exercício de treino
  async update(id, trainingExerciseData) {
    try {
      return await prisma.trainingExercise.update({
        where: { id },
        data: trainingExerciseData,
        include: {
          training: true,
          exercise: true,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  // Deletar exercício de treino
  async delete(id) {
    try {
      return await prisma.trainingExercise.delete({
        where: { id },
      });
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new TrainingExerciseRepository();
