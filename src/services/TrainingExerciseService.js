const { CreateTrainingExerciseSchema, UpdateTrainingExerciseSchema } = require('../schemas/trainingExercise.schema');
const TrainingExerciseRepository = require('../repositories/TrainingExerciseRepository');
const TrainingRepository = require('../repositories/TrainingRepository');
const ExerciseRepository = require('../repositories/ExerciseRepository');

class TrainingExerciseService {
  // Criar novo exercício de treino
  async create(trainingExerciseData) {
    try {
      // Validar dados com Zod
      const validatedData = CreateTrainingExerciseSchema.parse(trainingExerciseData);

      // Verificar se treino existe
      const training = await TrainingRepository.findById(validatedData.trainingId);
      if (!training) {
        throw new Error('Treino não encontrado');
      }

      // Verificar se exercício existe
      const exercise = await ExerciseRepository.findById(validatedData.exerciseId);
      if (!exercise) {
        throw new Error('Exercício não encontrado');
      }

      // Verificar se já existe a combinação treino-exercício
      const existing = await TrainingExerciseRepository.findByTrainingAndExercise(
        validatedData.trainingId,
        validatedData.exerciseId
      );
      if (existing) {
        throw new Error('Este exercício já está associado a este treino');
      }

      // Criar exercício de treino
      const createdTrainingExercise = await TrainingExerciseRepository.create(validatedData);

      return createdTrainingExercise;
    } catch (error) {
      throw error;
    }
  }

  // Buscar todos os exercícios de treinos
  async findAll() {
    try {
      return await TrainingExerciseRepository.findAll();
    } catch (error) {
      throw error;
    }
  }

  // Buscar exercício de treino por ID
  async findById(id) {
    try {
      const trainingExercise = await TrainingExerciseRepository.findById(id);
      if (!trainingExercise) {
        throw new Error('Exercício de treino não encontrado');
      }
      return trainingExercise;
    } catch (error) {
      throw error;
    }
  }

  // Buscar exercícios por treino
  async findByTrainingId(trainingId) {
    try {
      // Verificar se treino existe
      const training = await TrainingRepository.findById(trainingId);
      if (!training) {
        throw new Error('Treino não encontrado');
      }

      return await TrainingExerciseRepository.findByTrainingId(trainingId);
    } catch (error) {
      throw error;
    }
  }

  // Buscar exercícios por exercício
  async findByExerciseId(exerciseId) {
    try {
      // Verificar se exercício existe
      const exercise = await ExerciseRepository.findById(exerciseId);
      if (!exercise) {
        throw new Error('Exercício não encontrado');
      }

      return await TrainingExerciseRepository.findByExerciseId(exerciseId);
    } catch (error) {
      throw error;
    }
  }

  // Atualizar exercício de treino
  async update(id, trainingExerciseData) {
    try {
      // Validar dados com Zod
      const validatedData = UpdateTrainingExerciseSchema.parse(trainingExerciseData);

      // Verificar se exercício de treino existe
      const trainingExercise = await TrainingExerciseRepository.findById(id);
      if (!trainingExercise) {
        throw new Error('Exercício de treino não encontrado');
      }

      // Verificar se treino existe (se fornecido)
      if (validatedData.trainingId) {
        const training = await TrainingRepository.findById(validatedData.trainingId);
        if (!training) {
          throw new Error('Treino não encontrado');
        }
      }

      // Verificar se exercício existe (se fornecido)
      if (validatedData.exerciseId) {
        const exercise = await ExerciseRepository.findById(validatedData.exerciseId);
        if (!exercise) {
          throw new Error('Exercício não encontrado');
        }
      }

      // Verificar se a nova combinação já existe (se estiver mudando)
      if (validatedData.trainingId || validatedData.exerciseId) {
        const newTrainingId = validatedData.trainingId || trainingExercise.trainingId;
        const newExerciseId = validatedData.exerciseId || trainingExercise.exerciseId;
        
        const existing = await TrainingExerciseRepository.findByTrainingAndExercise(
          newTrainingId,
          newExerciseId
        );
        if (existing && existing.id !== id) {
          throw new Error('Esta combinação de treino e exercício já existe');
        }
      }

      // Atualizar no banco
      const updatedTrainingExercise = await TrainingExerciseRepository.update(id, validatedData);
      return updatedTrainingExercise;
    } catch (error) {
      throw error;
    }
  }

  // Deletar exercício de treino
  async delete(id) {
    try {
      // Verificar se exercício de treino existe
      const trainingExercise = await TrainingExerciseRepository.findById(id);
      if (!trainingExercise) {
        throw new Error('Exercício de treino não encontrado');
      }

      // Deletar permanentemente
      await TrainingExerciseRepository.delete(id);
      return true;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new TrainingExerciseService();
