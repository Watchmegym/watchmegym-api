const StatisticsCameraUserService = require('../services/StatisticsCameraUserService');

class StatisticsCameraUserController {
  // Criar nova estatística
  async create(req, res) {
    try {
      const statisticsData = req.body;
      const statistics = await StatisticsCameraUserService.create(statisticsData);

      return res.status(201).json({
        message: 'Estatística criada com sucesso',
        statistics
      });
    } catch (error) {
      console.error('Erro ao criar estatística:', error);
      return res.status(400).json({
        error: error.message || 'Erro ao criar estatística'
      });
    }
  }

  // Buscar todas as estatísticas
  async getAll(req, res) {
    try {
      const statistics = await StatisticsCameraUserService.findAll();

      return res.status(200).json({
        message: 'Lista de estatísticas',
        statistics
      });
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      return res.status(500).json({
        error: 'Erro interno do servidor'
      });
    }
  }

  // Buscar estatística por ID
  async getById(req, res) {
    try {
      const { id } = req.params;
      const statistics = await StatisticsCameraUserService.findById(id);

      return res.status(200).json({
        message: 'Estatística encontrada',
        statistics
      });
    } catch (error) {
      console.error('Erro ao buscar estatística:', error);
      
      if (error.message === 'Estatística não encontrada') {
        return res.status(404).json({
          error: error.message
        });
      }

      return res.status(500).json({
        error: 'Erro interno do servidor'
      });
    }
  }

  // Buscar estatísticas por usuário
  async getByUserId(req, res) {
    try {
      const { userId } = req.params;
      const statistics = await StatisticsCameraUserService.findByUserId(userId);

      return res.status(200).json({
        message: 'Estatísticas do usuário',
        statistics
      });
    } catch (error) {
      console.error('Erro ao buscar estatísticas do usuário:', error);
      
      if (error.message === 'Usuário não encontrado') {
        return res.status(404).json({
          error: error.message
        });
      }

      return res.status(500).json({
        error: 'Erro interno do servidor'
      });
    }
  }

  // Buscar estatísticas por câmera
  async getByCameraId(req, res) {
    try {
      const { cameraId } = req.params;
      const statistics = await StatisticsCameraUserService.findByCameraId(cameraId);

      return res.status(200).json({
        message: 'Estatísticas da câmera',
        statistics
      });
    } catch (error) {
      console.error('Erro ao buscar estatísticas da câmera:', error);
      
      if (error.message === 'Câmera não encontrada') {
        return res.status(404).json({
          error: error.message
        });
      }

      return res.status(500).json({
        error: 'Erro interno do servidor'
      });
    }
  }

  // Buscar estatísticas por exercício
  async getByExerciseId(req, res) {
    try {
      const { exerciseId } = req.params;
      const statistics = await StatisticsCameraUserService.findByExerciseId(exerciseId);

      return res.status(200).json({
        message: 'Estatísticas do exercício',
        statistics
      });
    } catch (error) {
      console.error('Erro ao buscar estatísticas do exercício:', error);
      return res.status(500).json({
        error: 'Erro interno do servidor'
      });
    }
  }

  // Buscar estatísticas por usuário e câmera
  async getByUserAndCamera(req, res) {
    try {
      const { userId, cameraId } = req.params;
      const statistics = await StatisticsCameraUserService.findByUserAndCamera(userId, cameraId);

      return res.status(200).json({
        message: 'Estatísticas do usuário na câmera',
        statistics
      });
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      
      if (error.message === 'Usuário não encontrado' || error.message === 'Câmera não encontrada') {
        return res.status(404).json({
          error: error.message
        });
      }

      return res.status(500).json({
        error: 'Erro interno do servidor'
      });
    }
  }

  // Buscar estatísticas agregadas por usuário
  async getAggregatedByUser(req, res) {
    try {
      const { userId } = req.params;
      const aggregatedStats = await StatisticsCameraUserService.getAggregatedByUser(userId);

      return res.status(200).json({
        message: 'Estatísticas agregadas do usuário',
        userId,
        summary: {
          totalRecords: aggregatedStats._count.id,
          totalRepetitions: aggregatedStats._sum.quantityRepetitions,
          totalSets: aggregatedStats._sum.quantitySets,
          averageRepetitions: aggregatedStats._avg.quantityRepetitions,
          averageSets: aggregatedStats._avg.quantitySets,
        }
      });
    } catch (error) {
      console.error('Erro ao buscar estatísticas agregadas:', error);
      
      if (error.message === 'Usuário não encontrado') {
        return res.status(404).json({
          error: error.message
        });
      }

      return res.status(500).json({
        error: 'Erro interno do servidor'
      });
    }
  }

  // Buscar estatísticas agregadas por câmera
  async getAggregatedByCamera(req, res) {
    try {
      const { cameraId } = req.params;
      const aggregatedStats = await StatisticsCameraUserService.getAggregatedByCamera(cameraId);

      return res.status(200).json({
        message: 'Estatísticas agregadas da câmera',
        cameraId,
        summary: {
          totalRecords: aggregatedStats._count.id,
          totalRepetitions: aggregatedStats._sum.quantityRepetitions,
          totalSets: aggregatedStats._sum.quantitySets,
          averageRepetitions: aggregatedStats._avg.quantityRepetitions,
          averageSets: aggregatedStats._avg.quantitySets,
        }
      });
    } catch (error) {
      console.error('Erro ao buscar estatísticas agregadas:', error);
      
      if (error.message === 'Câmera não encontrada') {
        return res.status(404).json({
          error: error.message
        });
      }

      return res.status(500).json({
        error: 'Erro interno do servidor'
      });
    }
  }

  // Atualizar estatística
  async update(req, res) {
    try {
      const { id } = req.params;
      const statisticsData = req.body;
      const statistics = await StatisticsCameraUserService.update(id, statisticsData);

      return res.status(200).json({
        message: 'Estatística atualizada com sucesso',
        statistics
      });
    } catch (error) {
      console.error('Erro ao atualizar estatística:', error);
      
      if (error.message === 'Estatística não encontrada') {
        return res.status(404).json({
          error: error.message
        });
      }

      return res.status(400).json({
        error: error.message || 'Erro ao atualizar estatística'
      });
    }
  }

  // Deletar estatística
  async delete(req, res) {
    try {
      const { id } = req.params;
      await StatisticsCameraUserService.delete(id);

      return res.status(200).json({
        message: 'Estatística deletada com sucesso'
      });
    } catch (error) {
      console.error('Erro ao deletar estatística:', error);
      
      if (error.message === 'Estatística não encontrada') {
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

module.exports = new StatisticsCameraUserController();
