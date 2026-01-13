const { CreateExerciseSchema, UpdateExerciseSchema } = require('../schemas/exercise.schema');
const ExerciseRepository = require('../repositories/ExerciseRepository');

class ExerciseService {
  // Criar novo exercício
  async create(exerciseData) {
    try {
      // Validar dados com Zod
      const validatedData = CreateExerciseSchema.parse(exerciseData);

      // Verificar se exercício com mesmo nome já existe
      const existingExercise = await ExerciseRepository.findByExactName(validatedData.name);
      if (existingExercise) {
        throw new Error('Já existe um exercício com este nome');
      }

      // Criar exercício
      const createdExercise = await ExerciseRepository.create(validatedData);

      return createdExercise;
    } catch (error) {
      throw error;
    }
  }

  // Buscar todos os exercícios
  async findAll() {
    try {
      return await ExerciseRepository.findAll();
    } catch (error) {
      throw error;
    }
  }

  // Buscar exercício por ID
  async findById(id) {
    try {
      const exercise = await ExerciseRepository.findById(id);
      if (!exercise) {
        throw new Error('Exercício não encontrado');
      }
      return exercise;
    } catch (error) {
      throw error;
    }
  }

  // Buscar exercícios por nome
  async findByName(name) {
    try {
      return await ExerciseRepository.findByName(name);
    } catch (error) {
      throw error;
    }
  }

  // Atualizar exercício
  async update(id, exerciseData) {
    try {
      // Validar dados com Zod
      const validatedData = UpdateExerciseSchema.parse(exerciseData);

      // Verificar se exercício existe
      const exercise = await ExerciseRepository.findById(id);
      if (!exercise) {
        throw new Error('Exercício não encontrado');
      }

      // Verificar se o novo nome já existe (se estiver mudando o nome)
      if (validatedData.name && validatedData.name !== exercise.name) {
        const existingExercise = await ExerciseRepository.findByExactName(validatedData.name);
        if (existingExercise) {
          throw new Error('Já existe um exercício com este nome');
        }
      }

      // Atualizar no banco
      const updatedExercise = await ExerciseRepository.update(id, validatedData);
      return updatedExercise;
    } catch (error) {
      throw error;
    }
  }

  // Deletar exercício
  async delete(id) {
    try {
      // Verificar se exercício existe
      const exercise = await ExerciseRepository.findById(id);
      if (!exercise) {
        throw new Error('Exercício não encontrado');
      }

      // Verificar se há câmeras associadas
      const camerasCount = await ExerciseRepository.countCameras(id);
      if (camerasCount > 0) {
        throw new Error(`Não é possível deletar. Existem ${camerasCount} câmera(s) associada(s) a este exercício`);
      }

      // Deletar permanentemente
      await ExerciseRepository.delete(id);
      return true;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new ExerciseService();
