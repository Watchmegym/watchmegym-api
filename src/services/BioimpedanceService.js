const { CreateBioimpedanceSchema, UpdateBioimpedanceSchema } = require('../schemas/bioimpedance.schema');
const BioimpedanceRepository = require('../repositories/BioimpedanceRepository');
const UserRepository = require('../repositories/UserRepository');

class BioimpedanceService {
  // Criar nova bioimpedância
  async create(bioimpedanceData) {
    try {
      // Validar dados com Zod
      const validatedData = CreateBioimpedanceSchema.parse(bioimpedanceData);

      // Verificar se usuário existe
      const user = await UserRepository.findById(validatedData.userId);
      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      // Criar bioimpedância
      const createdBioimpedance = await BioimpedanceRepository.create(validatedData);

      return createdBioimpedance;
    } catch (error) {
      throw error;
    }
  }

  // Buscar todas as bioimpedâncias
  async findAll() {
    try {
      return await BioimpedanceRepository.findAll();
    } catch (error) {
      throw error;
    }
  }

  // Buscar bioimpedância por ID
  async findById(id) {
    try {
      const bioimpedance = await BioimpedanceRepository.findById(id);
      if (!bioimpedance) {
        throw new Error('Bioimpedância não encontrada');
      }
      return bioimpedance;
    } catch (error) {
      throw error;
    }
  }

  // Buscar bioimpedâncias por usuário
  async findByUserId(userId) {
    try {
      // Verificar se usuário existe
      const user = await UserRepository.findById(userId);
      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      return await BioimpedanceRepository.findByUserId(userId);
    } catch (error) {
      throw error;
    }
  }

  // Buscar última bioimpedância de um usuário
  async findLatestByUserId(userId) {
    try {
      // Verificar se usuário existe
      const user = await UserRepository.findById(userId);
      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      const bioimpedance = await BioimpedanceRepository.findLatestByUserId(userId);
      if (!bioimpedance) {
        throw new Error('Nenhuma bioimpedância encontrada para este usuário');
      }

      return bioimpedance;
    } catch (error) {
      throw error;
    }
  }

  // Atualizar bioimpedância
  async update(id, bioimpedanceData) {
    try {
      // Validar dados com Zod
      const validatedData = UpdateBioimpedanceSchema.parse(bioimpedanceData);

      // Verificar se bioimpedância existe
      const bioimpedance = await BioimpedanceRepository.findById(id);
      if (!bioimpedance) {
        throw new Error('Bioimpedância não encontrada');
      }

      // Atualizar no banco
      const updatedBioimpedance = await BioimpedanceRepository.update(id, validatedData);
      return updatedBioimpedance;
    } catch (error) {
      throw error;
    }
  }

  // Deletar bioimpedância
  async delete(id) {
    try {
      // Verificar se bioimpedância existe
      const bioimpedance = await BioimpedanceRepository.findById(id);
      if (!bioimpedance) {
        throw new Error('Bioimpedância não encontrada');
      }

      // Deletar permanentemente
      await BioimpedanceRepository.delete(id);
      return true;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new BioimpedanceService();
