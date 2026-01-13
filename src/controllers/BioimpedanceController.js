const BioimpedanceService = require('../services/BioimpedanceService');

class BioimpedanceController {
  // Criar nova bioimpedância
  async create(req, res) {
    try {
      const bioimpedanceData = req.body;
      const bioimpedance = await BioimpedanceService.create(bioimpedanceData);

      return res.status(201).json({
        message: 'Bioimpedância criada com sucesso',
        bioimpedance
      });
    } catch (error) {
      console.error('Erro ao criar bioimpedância:', error);
      return res.status(400).json({
        error: error.message || 'Erro ao criar bioimpedância'
      });
    }
  }

  // Buscar todas as bioimpedâncias
  async getAll(req, res) {
    try {
      const bioimpedances = await BioimpedanceService.findAll();

      return res.status(200).json({
        message: 'Lista de bioimpedâncias',
        bioimpedances
      });
    } catch (error) {
      console.error('Erro ao buscar bioimpedâncias:', error);
      return res.status(500).json({
        error: 'Erro interno do servidor'
      });
    }
  }

  // Buscar bioimpedância por ID
  async getById(req, res) {
    try {
      const { id } = req.params;
      const bioimpedance = await BioimpedanceService.findById(id);

      return res.status(200).json({
        message: 'Bioimpedância encontrada',
        bioimpedance
      });
    } catch (error) {
      console.error('Erro ao buscar bioimpedância:', error);
      
      if (error.message === 'Bioimpedância não encontrada') {
        return res.status(404).json({
          error: error.message
        });
      }

      return res.status(500).json({
        error: 'Erro interno do servidor'
      });
    }
  }

  // Buscar bioimpedâncias por usuário
  async getByUserId(req, res) {
    try {
      const { userId } = req.params;
      const bioimpedances = await BioimpedanceService.findByUserId(userId);

      return res.status(200).json({
        message: 'Bioimpedâncias do usuário',
        bioimpedances
      });
    } catch (error) {
      console.error('Erro ao buscar bioimpedâncias do usuário:', error);
      
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

  // Buscar última bioimpedância de um usuário
  async getLatestByUserId(req, res) {
    try {
      const { userId } = req.params;
      const bioimpedance = await BioimpedanceService.findLatestByUserId(userId);

      return res.status(200).json({
        message: 'Última bioimpedância do usuário',
        bioimpedance
      });
    } catch (error) {
      console.error('Erro ao buscar última bioimpedância:', error);
      
      if (error.message === 'Usuário não encontrado' || 
          error.message === 'Nenhuma bioimpedância encontrada para este usuário') {
        return res.status(404).json({
          error: error.message
        });
      }

      return res.status(500).json({
        error: 'Erro interno do servidor'
      });
    }
  }

  // Atualizar bioimpedância
  async update(req, res) {
    try {
      const { id } = req.params;
      const bioimpedanceData = req.body;
      const bioimpedance = await BioimpedanceService.update(id, bioimpedanceData);

      return res.status(200).json({
        message: 'Bioimpedância atualizada com sucesso',
        bioimpedance
      });
    } catch (error) {
      console.error('Erro ao atualizar bioimpedância:', error);
      
      if (error.message === 'Bioimpedância não encontrada') {
        return res.status(404).json({
          error: error.message
        });
      }

      return res.status(400).json({
        error: error.message || 'Erro ao atualizar bioimpedância'
      });
    }
  }

  // Deletar bioimpedância
  async delete(req, res) {
    try {
      const { id } = req.params;
      await BioimpedanceService.delete(id);

      return res.status(200).json({
        message: 'Bioimpedância deletada com sucesso'
      });
    } catch (error) {
      console.error('Erro ao deletar bioimpedância:', error);
      
      if (error.message === 'Bioimpedância não encontrada') {
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

module.exports = new BioimpedanceController();
