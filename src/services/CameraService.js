const { CreateCameraSchema, UpdateCameraSchema } = require('../schemas/camera.schema');
const CameraRepository = require('../repositories/CameraRepository');
const AcademyRepository = require('../repositories/AcademyRepository');
const ExerciseRepository = require('../repositories/ExerciseRepository');

class CameraService {
  // Criar nova câmera
  async create(cameraData) {
    try {
      // Validar dados com Zod
      const validatedData = CreateCameraSchema.parse(cameraData);

      // Verificar se academia existe
      const academy = await AcademyRepository.findById(validatedData.academyId);
      if (!academy) {
        throw new Error('Academia não encontrada');
      }

      // Verificar se exercício existe (se fornecido)
      if (validatedData.exerciseId) {
        const exercise = await ExerciseRepository.findById(validatedData.exerciseId);
        if (!exercise) {
          throw new Error('Exercício não encontrado');
        }
      }

      // Criar câmera
      const createdCamera = await CameraRepository.create(validatedData);

      return createdCamera;
    } catch (error) {
      throw error;
    }
  }

  // Buscar todas as câmeras
  async findAll() {
    try {
      return await CameraRepository.findAll();
    } catch (error) {
      throw error;
    }
  }

  // Buscar câmera por ID
  async findById(id) {
    try {
      const camera = await CameraRepository.findById(id);
      if (!camera) {
        throw new Error('Câmera não encontrada');
      }
      return camera;
    } catch (error) {
      throw error;
    }
  }

  // Buscar câmeras por academia
  async findByAcademyId(academyId) {
    try {
      // Verificar se academia existe
      const academy = await AcademyRepository.findById(academyId);
      if (!academy) {
        throw new Error('Academia não encontrada');
      }

      return await CameraRepository.findByAcademyId(academyId);
    } catch (error) {
      throw error;
    }
  }

  // Buscar câmeras ativas por academia
  async findEnabledByAcademyId(academyId) {
    try {
      // Verificar se academia existe
      const academy = await AcademyRepository.findById(academyId);
      if (!academy) {
        throw new Error('Academia não encontrada');
      }

      return await CameraRepository.findEnabledByAcademyId(academyId);
    } catch (error) {
      throw error;
    }
  }

  // Buscar câmeras por nome
  async findByName(name) {
    try {
      return await CameraRepository.findByName(name);
    } catch (error) {
      throw error;
    }
  }

  // Atualizar câmera
  async update(id, cameraData) {
    try {
      // Validar dados com Zod
      const validatedData = UpdateCameraSchema.parse(cameraData);

      // Verificar se câmera existe
      const camera = await CameraRepository.findById(id);
      if (!camera) {
        throw new Error('Câmera não encontrada');
      }

      // Verificar se exercício existe (se fornecido)
      if (validatedData.exerciseId) {
        const exercise = await ExerciseRepository.findById(validatedData.exerciseId);
        if (!exercise) {
          throw new Error('Exercício não encontrado');
        }
      }

      // Atualizar no banco
      const updatedCamera = await CameraRepository.update(id, validatedData);
      return updatedCamera;
    } catch (error) {
      throw error;
    }
  }

  // Deletar câmera
  async delete(id) {
    try {
      // Verificar se câmera existe
      const camera = await CameraRepository.findById(id);
      if (!camera) {
        throw new Error('Câmera não encontrada');
      }

      // Deletar permanentemente
      await CameraRepository.delete(id);
      return true;
    } catch (error) {
      throw error;
    }
  }

  // Habilitar/Desabilitar câmera
  async toggleEnabled(id, enabled) {
    try {
      // Verificar se câmera existe
      const camera = await CameraRepository.findById(id);
      if (!camera) {
        throw new Error('Câmera não encontrada');
      }

      // Atualizar status
      const updatedCamera = await CameraRepository.toggleEnabled(id, enabled);
      return updatedCamera;
    } catch (error) {
      throw error;
    }
  }

  // Buscar câmeras por exercício
  async findByExerciseId(exerciseId) {
    try {
      return await CameraRepository.findByExerciseId(exerciseId);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new CameraService();
