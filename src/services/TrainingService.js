const { CreateTrainingSchema, UpdateTrainingSchema } = require('../schemas/training.schema');
const TrainingRepository = require('../repositories/TrainingRepository');

class TrainingService {
  // Criar novo treino
  async create(trainingData) {
    try {
      // Validar dados com Zod
      const validatedData = CreateTrainingSchema.parse(trainingData);

      // Verificar se treino com mesmo nome já existe
      const existingTraining = await TrainingRepository.findByExactName(validatedData.name);
      if (existingTraining) {
        throw new Error('Já existe um treino com este nome');
      }

      // Criar treino
      const createdTraining = await TrainingRepository.create(validatedData);

      return createdTraining;
    } catch (error) {
      throw error;
    }
  }

  // Buscar todos os treinos
  async findAll() {
    try {
      return await TrainingRepository.findAll();
    } catch (error) {
      throw error;
    }
  }

  // Buscar treino por ID
  async findById(id) {
    try {
      const training = await TrainingRepository.findById(id);
      if (!training) {
        throw new Error('Treino não encontrado');
      }
      return training;
    } catch (error) {
      throw error;
    }
  }

  // Buscar treinos por nome
  async findByName(name) {
    try {
      return await TrainingRepository.findByName(name);
    } catch (error) {
      throw error;
    }
  }

  // Atualizar treino
  async update(id, trainingData) {
    try {
      // Validar dados com Zod
      const validatedData = UpdateTrainingSchema.parse(trainingData);

      // Verificar se treino existe
      const training = await TrainingRepository.findById(id);
      if (!training) {
        throw new Error('Treino não encontrado');
      }

      // Verificar se o novo nome já existe (se estiver mudando o nome)
      if (validatedData.name && validatedData.name !== training.name) {
        const existingTraining = await TrainingRepository.findByExactName(validatedData.name);
        if (existingTraining) {
          throw new Error('Já existe um treino com este nome');
        }
      }

      // Atualizar no banco
      const updatedTraining = await TrainingRepository.update(id, validatedData);
      return updatedTraining;
    } catch (error) {
      throw error;
    }
  }

  // Deletar treino
  async delete(id) {
    try {
      // Verificar se treino existe
      const training = await TrainingRepository.findById(id);
      if (!training) {
        throw new Error('Treino não encontrado');
      }

      // Verificar se há exercícios associados
      const exercisesCount = await TrainingRepository.countExercises(id);
      if (exercisesCount > 0) {
        throw new Error(`Não é possível deletar. Existem ${exercisesCount} exercício(s) associado(s) a este treino`);
      }

      // Deletar permanentemente
      await TrainingRepository.delete(id);
      return true;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new TrainingService();
