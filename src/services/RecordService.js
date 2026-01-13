const { CreateRecordSchema, UpdateRecordSchema } = require('../schemas/record.schema');
const RecordRepository = require('../repositories/RecordRepository');
const CameraRepository = require('../repositories/CameraRepository');
const UserRepository = require('../repositories/UserRepository');

class RecordService {
  // Criar nova gravação
  async create(recordData) {
    try {
      // Validar dados com Zod
      const validatedData = CreateRecordSchema.parse(recordData);

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

      // Criar gravação
      const createdRecord = await RecordRepository.create(validatedData);

      return createdRecord;
    } catch (error) {
      throw error;
    }
  }

  // Buscar todas as gravações
  async findAll() {
    try {
      return await RecordRepository.findAll();
    } catch (error) {
      throw error;
    }
  }

  // Buscar gravação por ID
  async findById(id) {
    try {
      const record = await RecordRepository.findById(id);
      if (!record) {
        throw new Error('Gravação não encontrada');
      }
      return record;
    } catch (error) {
      throw error;
    }
  }

  // Buscar gravações por usuário
  async findByUserId(userId) {
    try {
      // Verificar se usuário existe
      const user = await UserRepository.findById(userId);
      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      return await RecordRepository.findByUserId(userId);
    } catch (error) {
      throw error;
    }
  }

  // Buscar gravações por câmera
  async findByCameraId(cameraId) {
    try {
      // Verificar se câmera existe
      const camera = await CameraRepository.findById(cameraId);
      if (!camera) {
        throw new Error('Câmera não encontrada');
      }

      return await RecordRepository.findByCameraId(cameraId);
    } catch (error) {
      throw error;
    }
  }

  // Buscar gravações por academia
  async findByAcademyId(academyId) {
    try {
      return await RecordRepository.findByAcademyId(academyId);
    } catch (error) {
      throw error;
    }
  }

  // Buscar gravações por exercício
  async findByExerciseId(exerciseId) {
    try {
      return await RecordRepository.findByExerciseId(exerciseId);
    } catch (error) {
      throw error;
    }
  }

  // Buscar gravações por usuário e câmera
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

      return await RecordRepository.findByUserAndCamera(userId, cameraId);
    } catch (error) {
      throw error;
    }
  }

  // Contar gravações por usuário
  async countByUserId(userId) {
    try {
      // Verificar se usuário existe
      const user = await UserRepository.findById(userId);
      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      const count = await RecordRepository.countByUserId(userId);
      return { userId, totalRecords: count };
    } catch (error) {
      throw error;
    }
  }

  // Contar gravações por câmera
  async countByCameraId(cameraId) {
    try {
      // Verificar se câmera existe
      const camera = await CameraRepository.findById(cameraId);
      if (!camera) {
        throw new Error('Câmera não encontrada');
      }

      const count = await RecordRepository.countByCameraId(cameraId);
      return { cameraId, totalRecords: count };
    } catch (error) {
      throw error;
    }
  }

  // Atualizar gravação
  async update(id, recordData) {
    try {
      // Validar dados com Zod
      const validatedData = UpdateRecordSchema.parse(recordData);

      // Verificar se gravação existe
      const record = await RecordRepository.findById(id);
      if (!record) {
        throw new Error('Gravação não encontrada');
      }

      // Atualizar no banco
      const updatedRecord = await RecordRepository.update(id, validatedData);
      return updatedRecord;
    } catch (error) {
      throw error;
    }
  }

  // Deletar gravação
  async delete(id) {
    try {
      // Verificar se gravação existe
      const record = await RecordRepository.findById(id);
      if (!record) {
        throw new Error('Gravação não encontrada');
      }

      // Deletar permanentemente
      await RecordRepository.delete(id);
      return true;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new RecordService();
