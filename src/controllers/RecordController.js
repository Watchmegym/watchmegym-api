const RecordService = require('../services/RecordService');

class RecordController {
  // Criar nova gravação
  async create(req, res) {
    try {
      const recordData = req.body;
      const record = await RecordService.create(recordData);

      return res.status(201).json({
        message: 'Gravação criada com sucesso',
        record
      });
    } catch (error) {
      console.error('Erro ao criar gravação:', error);
      return res.status(400).json({
        error: error.message || 'Erro ao criar gravação'
      });
    }
  }

  // Buscar todas as gravações
  async getAll(req, res) {
    try {
      const records = await RecordService.findAll();

      return res.status(200).json({
        message: 'Lista de gravações',
        records
      });
    } catch (error) {
      console.error('Erro ao buscar gravações:', error);
      return res.status(500).json({
        error: 'Erro interno do servidor'
      });
    }
  }

  // Buscar gravação por ID
  async getById(req, res) {
    try {
      const { id } = req.params;
      const record = await RecordService.findById(id);

      return res.status(200).json({
        message: 'Gravação encontrada',
        record
      });
    } catch (error) {
      console.error('Erro ao buscar gravação:', error);
      
      if (error.message === 'Gravação não encontrada') {
        return res.status(404).json({
          error: error.message
        });
      }

      return res.status(500).json({
        error: 'Erro interno do servidor'
      });
    }
  }

  // Buscar gravações por usuário
  async getByUserId(req, res) {
    try {
      const { userId } = req.params;
      const records = await RecordService.findByUserId(userId);

      return res.status(200).json({
        message: 'Gravações do usuário',
        records
      });
    } catch (error) {
      console.error('Erro ao buscar gravações do usuário:', error);
      
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

  // Buscar gravações por câmera
  async getByCameraId(req, res) {
    try {
      const { cameraId } = req.params;
      const records = await RecordService.findByCameraId(cameraId);

      return res.status(200).json({
        message: 'Gravações da câmera',
        records
      });
    } catch (error) {
      console.error('Erro ao buscar gravações da câmera:', error);
      
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

  // Buscar gravações por academia
  async getByAcademyId(req, res) {
    try {
      const { academyId } = req.params;
      const records = await RecordService.findByAcademyId(academyId);

      return res.status(200).json({
        message: 'Gravações da academia',
        records
      });
    } catch (error) {
      console.error('Erro ao buscar gravações da academia:', error);
      return res.status(500).json({
        error: 'Erro interno do servidor'
      });
    }
  }

  // Buscar gravações por exercício
  async getByExerciseId(req, res) {
    try {
      const { exerciseId } = req.params;
      const records = await RecordService.findByExerciseId(exerciseId);

      return res.status(200).json({
        message: 'Gravações do exercício',
        records
      });
    } catch (error) {
      console.error('Erro ao buscar gravações do exercício:', error);
      return res.status(500).json({
        error: 'Erro interno do servidor'
      });
    }
  }

  // Buscar gravações por usuário e câmera
  async getByUserAndCamera(req, res) {
    try {
      const { userId, cameraId } = req.params;
      const records = await RecordService.findByUserAndCamera(userId, cameraId);

      return res.status(200).json({
        message: 'Gravações do usuário na câmera',
        records
      });
    } catch (error) {
      console.error('Erro ao buscar gravações:', error);
      
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

  // Contar gravações por usuário
  async countByUserId(req, res) {
    try {
      const { userId } = req.params;
      const result = await RecordService.countByUserId(userId);

      return res.status(200).json({
        message: 'Total de gravações do usuário',
        ...result
      });
    } catch (error) {
      console.error('Erro ao contar gravações:', error);
      
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

  // Contar gravações por câmera
  async countByCameraId(req, res) {
    try {
      const { cameraId } = req.params;
      const result = await RecordService.countByCameraId(cameraId);

      return res.status(200).json({
        message: 'Total de gravações da câmera',
        ...result
      });
    } catch (error) {
      console.error('Erro ao contar gravações:', error);
      
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

  // Atualizar gravação
  async update(req, res) {
    try {
      const { id } = req.params;
      const recordData = req.body;
      const record = await RecordService.update(id, recordData);

      return res.status(200).json({
        message: 'Gravação atualizada com sucesso',
        record
      });
    } catch (error) {
      console.error('Erro ao atualizar gravação:', error);
      
      if (error.message === 'Gravação não encontrada') {
        return res.status(404).json({
          error: error.message
        });
      }

      return res.status(400).json({
        error: error.message || 'Erro ao atualizar gravação'
      });
    }
  }

  // Deletar gravação
  async delete(req, res) {
    try {
      const { id } = req.params;
      await RecordService.delete(id);

      return res.status(200).json({
        message: 'Gravação deletada com sucesso'
      });
    } catch (error) {
      console.error('Erro ao deletar gravação:', error);
      
      if (error.message === 'Gravação não encontrada') {
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

module.exports = new RecordController();
