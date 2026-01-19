const ExerciseVideoService = require('../services/ExerciseVideoService');

class ExerciseVideoController {
  // Criar novo vídeo de exercício
  async create(req, res) {
    try {
      const videoData = req.body;
      const video = await ExerciseVideoService.create(videoData);

      return res.status(201).json({
        message: 'Vídeo de exercício criado com sucesso',
        video
      });
    } catch (error) {
      console.error('Erro ao criar vídeo de exercício:', error);
      return res.status(400).json({
        error: error.message || 'Erro ao criar vídeo de exercício'
      });
    }
  }

  // Buscar todos os vídeos
  async getAll(req, res) {
    try {
      const videos = await ExerciseVideoService.findAll();

      return res.status(200).json({
        message: 'Lista de vídeos de exercícios',
        videos
      });
    } catch (error) {
      console.error('Erro ao buscar vídeos:', error);
      return res.status(500).json({
        error: 'Erro interno do servidor'
      });
    }
  }

  // Buscar vídeo por ID
  async getById(req, res) {
    try {
      const { id } = req.params;
      const video = await ExerciseVideoService.findById(id);

      return res.status(200).json({
        message: 'Vídeo encontrado',
        video
      });
    } catch (error) {
      console.error('Erro ao buscar vídeo:', error);
      
      if (error.message === 'Vídeo não encontrado') {
        return res.status(404).json({
          error: error.message
        });
      }

      return res.status(500).json({
        error: 'Erro interno do servidor'
      });
    }
  }

  // Buscar vídeos por exercício
  async getByExerciseId(req, res) {
    try {
      const { exerciseId } = req.params;
      const videos = await ExerciseVideoService.findByExerciseId(exerciseId);

      return res.status(200).json({
        message: 'Vídeos do exercício',
        videos
      });
    } catch (error) {
      console.error('Erro ao buscar vídeos do exercício:', error);
      
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

  // Buscar vídeos por título
  async getByTitle(req, res) {
    try {
      const { title } = req.query;
      
      if (!title) {
        return res.status(400).json({
          error: 'Parâmetro "title" é obrigatório'
        });
      }

      const videos = await ExerciseVideoService.findByTitle(title);

      return res.status(200).json({
        message: 'Vídeos encontrados',
        videos
      });
    } catch (error) {
      console.error('Erro ao buscar vídeos por título:', error);
      return res.status(500).json({
        error: 'Erro interno do servidor'
      });
    }
  }

  // Atualizar vídeo
  async update(req, res) {
    try {
      const { id } = req.params;
      const videoData = req.body;
      const video = await ExerciseVideoService.update(id, videoData);

      return res.status(200).json({
        message: 'Vídeo atualizado com sucesso',
        video
      });
    } catch (error) {
      console.error('Erro ao atualizar vídeo:', error);
      
      if (error.message === 'Vídeo não encontrado' || error.message === 'Exercício não encontrado') {
        return res.status(404).json({
          error: error.message
        });
      }

      return res.status(400).json({
        error: error.message || 'Erro ao atualizar vídeo'
      });
    }
  }

  // Deletar vídeo
  async delete(req, res) {
    try {
      const { id } = req.params;
      await ExerciseVideoService.delete(id);

      return res.status(200).json({
        message: 'Vídeo deletado com sucesso'
      });
    } catch (error) {
      console.error('Erro ao deletar vídeo:', error);
      
      if (error.message === 'Vídeo não encontrado') {
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

module.exports = new ExerciseVideoController();
