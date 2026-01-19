const { prisma } = require('../config');

class ExerciseVideoRepository {
  // Criar vídeo de exercício
  async create(videoData) {
    try {
      return await prisma.exerciseVideo.create({
        data: videoData,
        include: {
          exercise: true,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  // Buscar todos os vídeos de exercícios
  async findAll() {
    try {
      return await prisma.exerciseVideo.findMany({
        include: {
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

  // Buscar vídeo por ID
  async findById(id) {
    try {
      return await prisma.exerciseVideo.findUnique({
        where: { id },
        include: {
          exercise: true,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  // Buscar vídeos por exercício
  async findByExerciseId(exerciseId) {
    try {
      return await prisma.exerciseVideo.findMany({
        where: { exerciseId },
        include: {
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

  // Buscar vídeos por título
  async findByTitle(title) {
    try {
      return await prisma.exerciseVideo.findMany({
        where: {
          title: {
            contains: title,
            mode: 'insensitive',
          },
        },
        include: {
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

  // Atualizar vídeo
  async update(id, videoData) {
    try {
      return await prisma.exerciseVideo.update({
        where: { id },
        data: videoData,
        include: {
          exercise: true,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  // Deletar vídeo
  async delete(id) {
    try {
      return await prisma.exerciseVideo.delete({
        where: { id },
      });
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new ExerciseVideoRepository();
