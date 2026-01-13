const ExerciseService = require('../services/ExerciseService');

class ExerciseController {
  // Criar novo exercício
  async create(req, res) {
    try {
      const exerciseData = req.body;
      const exercise = await ExerciseService.create(exerciseData);

      return res.status(201).json({
        message: 'Exercício criado com sucesso',
        exercise
      });
    } catch (error) {
      console.error('Erro ao criar exercício:', error);
      return res.status(400).json({
        error: error.message || 'Erro ao criar exercício'
      });
    }
  }

  // Buscar todos os exercícios
  async getAll(req, res) {
    try {
      const exercises = await ExerciseService.findAll();

      return res.status(200).json({
        message: 'Lista de exercícios',
        exercises
      });
    } catch (error) {
      console.error('Erro ao buscar exercícios:', error);
      return res.status(500).json({
        error: 'Erro interno do servidor'
      });
    }
  }

  // Buscar exercício por ID
  async getById(req, res) {
    try {
      const { id } = req.params;
      const exercise = await ExerciseService.findById(id);

      return res.status(200).json({
        message: 'Exercício encontrado',
        exercise
      });
    } catch (error) {
      console.error('Erro ao buscar exercício:', error);
      
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

  // Buscar exercícios por nome
  async getByName(req, res) {
    try {
      const { name } = req.query;
      
      if (!name) {
        return res.status(400).json({
          error: 'Parâmetro "name" é obrigatório'
        });
      }

      const exercises = await ExerciseService.findByName(name);

      return res.status(200).json({
        message: 'Exercícios encontrados',
        exercises
      });
    } catch (error) {
      console.error('Erro ao buscar exercícios por nome:', error);
      return res.status(500).json({
        error: 'Erro interno do servidor'
      });
    }
  }

  // Atualizar exercício
  async update(req, res) {
    try {
      const { id } = req.params;
      const exerciseData = req.body;
      const exercise = await ExerciseService.update(id, exerciseData);

      return res.status(200).json({
        message: 'Exercício atualizado com sucesso',
        exercise
      });
    } catch (error) {
      console.error('Erro ao atualizar exercício:', error);
      
      if (error.message === 'Exercício não encontrado') {
        return res.status(404).json({
          error: error.message
        });
      }

      return res.status(400).json({
        error: error.message || 'Erro ao atualizar exercício'
      });
    }
  }

  // Deletar exercício
  async delete(req, res) {
    try {
      const { id } = req.params;
      await ExerciseService.delete(id);

      return res.status(200).json({
        message: 'Exercício deletado com sucesso'
      });
    } catch (error) {
      console.error('Erro ao deletar exercício:', error);
      
      if (error.message === 'Exercício não encontrado') {
        return res.status(404).json({
          error: error.message
        });
      }

      if (error.message.includes('câmera(s) associada(s)')) {
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

module.exports = new ExerciseController();
