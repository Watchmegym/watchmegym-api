const TrainingExerciseService = require('../services/TrainingExerciseService');

class TrainingExerciseController {
  // Criar novo exercício de treino
  async create(req, res) {
    try {
      const trainingExerciseData = req.body;
      const trainingExercise = await TrainingExerciseService.create(trainingExerciseData);

      return res.status(201).json({
        message: 'Exercício de treino criado com sucesso',
        trainingExercise
      });
    } catch (error) {
      console.error('Erro ao criar exercício de treino:', error);
      return res.status(400).json({
        error: error.message || 'Erro ao criar exercício de treino'
      });
    }
  }

  // Buscar todos os exercícios de treinos
  async getAll(req, res) {
    try {
      const trainingExercises = await TrainingExerciseService.findAll();

      return res.status(200).json({
        message: 'Lista de exercícios de treinos',
        trainingExercises
      });
    } catch (error) {
      console.error('Erro ao buscar exercícios de treinos:', error);
      return res.status(500).json({
        error: 'Erro interno do servidor'
      });
    }
  }

  // Buscar exercício de treino por ID
  async getById(req, res) {
    try {
      const { id } = req.params;
      const trainingExercise = await TrainingExerciseService.findById(id);

      return res.status(200).json({
        message: 'Exercício de treino encontrado',
        trainingExercise
      });
    } catch (error) {
      console.error('Erro ao buscar exercício de treino:', error);
      
      if (error.message === 'Exercício de treino não encontrado') {
        return res.status(404).json({
          error: error.message
        });
      }

      return res.status(500).json({
        error: 'Erro interno do servidor'
      });
    }
  }

  // Buscar exercícios por treino
  async getByTrainingId(req, res) {
    try {
      const { trainingId } = req.params;
      const trainingExercises = await TrainingExerciseService.findByTrainingId(trainingId);

      return res.status(200).json({
        message: 'Exercícios do treino',
        trainingExercises
      });
    } catch (error) {
      console.error('Erro ao buscar exercícios do treino:', error);
      
      if (error.message === 'Treino não encontrado') {
        return res.status(404).json({
          error: error.message
        });
      }

      return res.status(500).json({
        error: 'Erro interno do servidor'
      });
    }
  }

  // Buscar exercícios por exercício
  async getByExerciseId(req, res) {
    try {
      const { exerciseId } = req.params;
      const trainingExercises = await TrainingExerciseService.findByExerciseId(exerciseId);

      return res.status(200).json({
        message: 'Treinos do exercício',
        trainingExercises
      });
    } catch (error) {
      console.error('Erro ao buscar treinos do exercício:', error);
      
      if (error.message === 'Exercício não encontrado') {
        return res.status(404).json({
          error: error.message
        });
      }

      return res.status(500).json({
        error: 'Erro interno do servidor'
      });
    }
  }

  // Atualizar exercício de treino
  async update(req, res) {
    try {
      const { id } = req.params;
      const trainingExerciseData = req.body;
      const trainingExercise = await TrainingExerciseService.update(id, trainingExerciseData);

      return res.status(200).json({
        message: 'Exercício de treino atualizado com sucesso',
        trainingExercise
      });
    } catch (error) {
      console.error('Erro ao atualizar exercício de treino:', error);
      
      if (error.message === 'Exercício de treino não encontrado' || 
          error.message === 'Treino não encontrado' || 
          error.message === 'Exercício não encontrado') {
        return res.status(404).json({
          error: error.message
        });
      }

      if (error.message.includes('já existe') || error.message.includes('já está associado')) {
        return res.status(400).json({
          error: error.message
        });
      }

      return res.status(400).json({
        error: error.message || 'Erro ao atualizar exercício de treino'
      });
    }
  }

  // Deletar exercício de treino
  async delete(req, res) {
    try {
      const { id } = req.params;
      await TrainingExerciseService.delete(id);

      return res.status(200).json({
        message: 'Exercício de treino deletado com sucesso'
      });
    } catch (error) {
      console.error('Erro ao deletar exercício de treino:', error);
      
      if (error.message === 'Exercício de treino não encontrado') {
        return res.status(404).json({
          error: error.message
        });
      }

      return res.status(500).json({
        error: 'Erro interno do servidor'
      });
    }
  }
}

module.exports = new TrainingExerciseController();
