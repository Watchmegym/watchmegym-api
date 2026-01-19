const { CreateExerciseVideoSchema, UpdateExerciseVideoSchema } = require('../schemas/exerciseVideo.schema');
const ExerciseVideoRepository = require('../repositories/ExerciseVideoRepository');
const ExerciseRepository = require('../repositories/ExerciseRepository');

class ExerciseVideoService {
  // Criar novo vídeo de exercício
  async create(videoData) {
    try {
      // Validar dados com Zod
      const validatedData = CreateExerciseVideoSchema.parse(videoData);

      // Verificar se exercício existe
      const exercise = await ExerciseRepository.findById(validatedData.exerciseId);
      if (!exercise) {
        throw new Error('Exercício não encontrado');
      }

      // Criar vídeo
      const createdVideo = await ExerciseVideoRepository.create(validatedData);

      return createdVideo;
    } catch (error) {
      throw error;
    }
  }

  // Buscar todos os vídeos
  async findAll() {
    try {
      return await ExerciseVideoRepository.findAll();
    } catch (error) {
      throw error;
    }
  }

  // Buscar vídeo por ID
  async findById(id) {
    try {
      const video = await ExerciseVideoRepository.findById(id);
      if (!video) {
        throw new Error('Vídeo não encontrado');
      }
      return video;
    } catch (error) {
      throw error;
    }
  }

  // Buscar vídeos por exercício
  async findByExerciseId(exerciseId) {
    try {
      // Verificar se exercício existe
      const exercise = await ExerciseRepository.findById(exerciseId);
      if (!exercise) {
        throw new Error('Exercício não encontrado');
      }

      return await ExerciseVideoRepository.findByExerciseId(exerciseId);
    } catch (error) {
      throw error;
    }
  }

  // Buscar vídeos por título
  async findByTitle(title) {
    try {
      return await ExerciseVideoRepository.findByTitle(title);
    } catch (error) {
      throw error;
    }
  }

  // Atualizar vídeo
  async update(id, videoData) {
    try {
      // Validar dados com Zod
      const validatedData = UpdateExerciseVideoSchema.parse(videoData);

      // Verificar se vídeo existe
      const video = await ExerciseVideoRepository.findById(id);
      if (!video) {
        throw new Error('Vídeo não encontrado');
      }

      // Verificar se exercício existe (se fornecido)
      if (validatedData.exerciseId) {
        const exercise = await ExerciseRepository.findById(validatedData.exerciseId);
        if (!exercise) {
          throw new Error('Exercício não encontrado');
        }
      }

      // Atualizar no banco
      const updatedVideo = await ExerciseVideoRepository.update(id, validatedData);
      return updatedVideo;
    } catch (error) {
      throw error;
    }
  }

  // Deletar vídeo
  async delete(id) {
    try {
      // Verificar se vídeo existe
      const video = await ExerciseVideoRepository.findById(id);
      if (!video) {
        throw new Error('Vídeo não encontrado');
      }

      // Deletar permanentemente
      await ExerciseVideoRepository.delete(id);
      return true;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new ExerciseVideoService();
