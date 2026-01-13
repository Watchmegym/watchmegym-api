const { CreateStatisticsCameraUserSchema, UpdateStatisticsCameraUserSchema } = require('../schemas/statisticsCameraUser.schema');
const StatisticsCameraUserRepository = require('../repositories/StatisticsCameraUserRepository');
const CameraRepository = require('../repositories/CameraRepository');
const UserRepository = require('../repositories/UserRepository');

class StatisticsCameraUserService {
  // Criar nova estatística
  async create(statisticsData) {
    try {
      // Validar dados com Zod
      const validatedData = CreateStatisticsCameraUserSchema.parse(statisticsData);

      // Verificar se câmera existe
      const camera = await CameraRepository.findById(validatedData.cameraId);
      if (!camera) {
        throw new Error('Câmera não encontrada');
      }

      // Verificar se usuário existe
      const user = await UserRepository.findById(validatedData.userId);
      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      // Criar estatística
      const createdStatistics = await StatisticsCameraUserRepository.create(validatedData);

      return createdStatistics;
    } catch (error) {
      throw error;
    }
  }

  // Buscar todas as estatísticas
  async findAll() {
    try {
      return await StatisticsCameraUserRepository.findAll();
    } catch (error) {
      throw error;
    }
  }

  // Buscar estatística por ID
  async findById(id) {
    try {
      const statistics = await StatisticsCameraUserRepository.findById(id);
      if (!statistics) {
        throw new Error('Estatística não encontrada');
      }
      return statistics;
    } catch (error) {
      throw error;
    }
  }

  // Buscar estatísticas por usuário
  async findByUserId(userId) {
    try {
      // Verificar se usuário existe
      const user = await UserRepository.findById(userId);
      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      return await StatisticsCameraUserRepository.findByUserId(userId);
    } catch (error) {
      throw error;
    }
  }

  // Buscar estatísticas por câmera
  async findByCameraId(cameraId) {
    try {
      // Verificar se câmera existe
      const camera = await CameraRepository.findById(cameraId);
      if (!camera) {
        throw new Error('Câmera não encontrada');
      }

      return await StatisticsCameraUserRepository.findByCameraId(cameraId);
    } catch (error) {
      throw error;
    }
  }

  // Buscar estatísticas por exercício
  async findByExerciseId(exerciseId) {
    try {
      return await StatisticsCameraUserRepository.findByExerciseId(exerciseId);
    } catch (error) {
      throw error;
    }
  }

  // Buscar estatísticas por usuário e câmera
  async findByUserAndCamera(userId, cameraId) {
    try {
      // Verificar se usuário existe
      const user = await UserRepository.findById(userId);
      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      // Verificar se câmera existe
      const camera = await CameraRepository.findById(cameraId);
      if (!camera) {
        throw new Error('Câmera não encontrada');
      }

      return await StatisticsCameraUserRepository.findByUserAndCamera(userId, cameraId);
    } catch (error) {
      throw error;
    }
  }

  // Buscar estatísticas agregadas por usuário
  async getAggregatedByUser(userId) {
    try {
      // Verificar se usuário existe
      const user = await UserRepository.findById(userId);
      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      return await StatisticsCameraUserRepository.getAggregatedByUser(userId);
    } catch (error) {
      throw error;
    }
  }

  // Buscar estatísticas agregadas por câmera
  async getAggregatedByCamera(cameraId) {
    try {
      // Verificar se câmera existe
      const camera = await CameraRepository.findById(cameraId);
      if (!camera) {
        throw new Error('Câmera não encontrada');
      }

      return await StatisticsCameraUserRepository.getAggregatedByCamera(cameraId);
    } catch (error) {
      throw error;
    }
  }

  // Atualizar estatística
  async update(id, statisticsData) {
    try {
      // Validar dados com Zod
      const validatedData = UpdateStatisticsCameraUserSchema.parse(statisticsData);

      // Verificar se estatística existe
      const statistics = await StatisticsCameraUserRepository.findById(id);
      if (!statistics) {
        throw new Error('Estatística não encontrada');
      }

      // Atualizar no banco
      const updatedStatistics = await StatisticsCameraUserRepository.update(id, validatedData);
      return updatedStatistics;
    } catch (error) {
      throw error;
    }
  }

  // Deletar estatística
  async delete(id) {
    try {
      // Verificar se estatística existe
      const statistics = await StatisticsCameraUserRepository.findById(id);
      if (!statistics) {
        throw new Error('Estatística não encontrada');
      }

      // Deletar permanentemente
      await StatisticsCameraUserRepository.delete(id);
      return true;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new StatisticsCameraUserService();
