const CameraService = require('../services/CameraService');

class CameraController {
  // Criar nova câmera
  async create(req, res) {
    try {
      const cameraData = req.body;
      const camera = await CameraService.create(cameraData);

      return res.status(201).json({
        message: 'Câmera criada com sucesso',
        camera
      });
    } catch (error) {
      console.error('Erro ao criar câmera:', error);
      return res.status(400).json({
        error: error.message || 'Erro ao criar câmera'
      });
    }
  }

  // Buscar todas as câmeras
  async getAll(req, res) {
    try {
      const cameras = await CameraService.findAll();

      return res.status(200).json({
        message: 'Lista de câmeras',
        cameras
      });
    } catch (error) {
      console.error('Erro ao buscar câmeras:', error);
      return res.status(500).json({
        error: 'Erro interno do servidor'
      });
    }
  }

  // Buscar câmera por ID
  async getById(req, res) {
    try {
      const { id } = req.params;
      const camera = await CameraService.findById(id);

      return res.status(200).json({
        message: 'Câmera encontrada',
        camera
      });
    } catch (error) {
      console.error('Erro ao buscar câmera:', error);
      
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

  // Buscar câmeras por academia
  async getByAcademyId(req, res) {
    try {
      const { academyId } = req.params;
      const cameras = await CameraService.findByAcademyId(academyId);

      return res.status(200).json({
        message: 'Câmeras da academia',
        cameras
      });
    } catch (error) {
      console.error('Erro ao buscar câmeras da academia:', error);
      
      if (error.message === 'Academia não encontrada') {
        return res.status(404).json({
          error: error.message
        });
      }

      return res.status(500).json({
        error: 'Erro interno do servidor'
      });
    }
  }

  // Buscar câmeras ativas por academia
  async getEnabledByAcademyId(req, res) {
    try {
      const { academyId } = req.params;
      const cameras = await CameraService.findEnabledByAcademyId(academyId);

      return res.status(200).json({
        message: 'Câmeras ativas da academia',
        cameras
      });
    } catch (error) {
      console.error('Erro ao buscar câmeras ativas:', error);
      
      if (error.message === 'Academia não encontrada') {
        return res.status(404).json({
          error: error.message
        });
      }

      return res.status(500).json({
        error: 'Erro interno do servidor'
      });
    }
  }

  // Buscar câmeras por nome
  async getByName(req, res) {
    try {
      const { name } = req.query;
      
      if (!name) {
        return res.status(400).json({
          error: 'Parâmetro "name" é obrigatório'
        });
      }

      const cameras = await CameraService.findByName(name);

      return res.status(200).json({
        message: 'Câmeras encontradas',
        cameras
      });
    } catch (error) {
      console.error('Erro ao buscar câmeras por nome:', error);
      return res.status(500).json({
        error: 'Erro interno do servidor'
      });
    }
  }

  // Atualizar câmera
  async update(req, res) {
    try {
      const { id } = req.params;
      const cameraData = req.body;
      const camera = await CameraService.update(id, cameraData);

      return res.status(200).json({
        message: 'Câmera atualizada com sucesso',
        camera
      });
    } catch (error) {
      console.error('Erro ao atualizar câmera:', error);
      
      if (error.message === 'Câmera não encontrada') {
        return res.status(404).json({
          error: error.message
        });
      }

      return res.status(400).json({
        error: error.message || 'Erro ao atualizar câmera'
      });
    }
  }

  // Deletar câmera
  async delete(req, res) {
    try {
      const { id } = req.params;
      await CameraService.delete(id);

      return res.status(200).json({
        message: 'Câmera deletada com sucesso'
      });
    } catch (error) {
      console.error('Erro ao deletar câmera:', error);
      
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

  // Habilitar/Desabilitar câmera
  async toggleEnabled(req, res) {
    try {
      const { id } = req.params;
      const { enabled } = req.body;

      if (typeof enabled !== 'boolean') {
        return res.status(400).json({
          error: 'Campo "enabled" deve ser true ou false'
        });
      }

      const camera = await CameraService.toggleEnabled(id, enabled);

      return res.status(200).json({
        message: `Câmera ${enabled ? 'habilitada' : 'desabilitada'} com sucesso`,
        camera
      });
    } catch (error) {
      console.error('Erro ao alternar status da câmera:', error);
      
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

  // Buscar câmeras por exercício
  async getByExerciseId(req, res) {
    try {
      const { exerciseId } = req.params;
      const cameras = await CameraService.findByExerciseId(exerciseId);

      return res.status(200).json({
        message: 'Câmeras do exercício',
        cameras
      });
    } catch (error) {
      console.error('Erro ao buscar câmeras do exercício:', error);
      return res.status(500).json({
        error: 'Erro interno do servidor'
      });
    }
  }
}

module.exports = new CameraController();
