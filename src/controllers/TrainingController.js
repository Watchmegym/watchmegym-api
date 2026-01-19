const TrainingService = require('../services/TrainingService');

class TrainingController {
  // Criar novo treino
  async create(req, res) {
    try {
      const trainingData = req.body;
      const training = await TrainingService.create(trainingData);

      return res.status(201).json({
        message: 'Treino criado com sucesso',
        training
      });
    } catch (error) {
      console.error('Erro ao criar treino:', error);
      return res.status(400).json({
        error: error.message || 'Erro ao criar treino'
      });
    }
  }

  // Buscar todos os treinos
  async getAll(req, res) {
    try {
      const trainings = await TrainingService.findAll();

      return res.status(200).json({
        message: 'Lista de treinos',
        trainings
      });
    } catch (error) {
      console.error('Erro ao buscar treinos:', error);
      return res.status(500).json({
        error: 'Erro interno do servidor'
      });
    }
  }

  // Buscar treino por ID
  async getById(req, res) {
    try {
      const { id } = req.params;
      const training = await TrainingService.findById(id);

      return res.status(200).json({
        message: 'Treino encontrado',
        training
      });
    } catch (error) {
      console.error('Erro ao buscar treino:', error);
      
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

  // Buscar treinos por nome
  async getByName(req, res) {
    try {
      const { name } = req.query;
      
      if (!name) {
        return res.status(400).json({
          error: 'Parâmetro "name" é obrigatório'
        });
      }

      const trainings = await TrainingService.findByName(name);

      return res.status(200).json({
        message: 'Treinos encontrados',
        trainings
      });
    } catch (error) {
      console.error('Erro ao buscar treinos por nome:', error);
      return res.status(500).json({
        error: 'Erro interno do servidor'
      });
    }
  }

  // Atualizar treino
  async update(req, res) {
    try {
      const { id } = req.params;
      const trainingData = req.body;
      const training = await TrainingService.update(id, trainingData);

      return res.status(200).json({
        message: 'Treino atualizado com sucesso',
        training
      });
    } catch (error) {
      console.error('Erro ao atualizar treino:', error);
      
      if (error.message === 'Treino não encontrado') {
        return res.status(404).json({
          error: error.message
        });
      }

      return res.status(400).json({
        error: error.message || 'Erro ao atualizar treino'
      });
    }
  }

  // Deletar treino
  async delete(req, res) {
    try {
      const { id } = req.params;
      await TrainingService.delete(id);

      return res.status(200).json({
        message: 'Treino deletado com sucesso'
      });
    } catch (error) {
      console.error('Erro ao deletar treino:', error);
      
      if (error.message === 'Treino não encontrado') {
        return res.status(404).json({
          error: error.message
        });
      }

      if (error.message.includes('exercício(s) associado(s)')) {
        return res.status(400).json({
          error: error.message
        });
      }

      return res.status(500).json({
        error: 'Erro interno do servidor'
      });
    }
  }
}

module.exports = new TrainingController();
