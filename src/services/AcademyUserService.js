const { CreateAcademyUserSchema } = require('../schemas/academyUser.schema');
const AcademyUserRepository = require('../repositories/AcademyUserRepository');
const AcademyRepository = require('../repositories/AcademyRepository');
const UserRepository = require('../repositories/UserRepository');

class AcademyUserService {
  // Vincular usuário à academia
  async create(academyUserData) {
    try {
      // Validar dados com Zod
      const validatedData = CreateAcademyUserSchema.parse(academyUserData);

      // Verificar se academia existe
      const academy = await AcademyRepository.findById(validatedData.academyId);
      if (!academy) {
        throw new Error('Academia não encontrada');
      }

      // Verificar se usuário existe
      const user = await UserRepository.findById(validatedData.userId);
      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      // Verificar se vínculo já existe
      const existingLink = await AcademyUserRepository.findByAcademyAndUser(
        validatedData.academyId,
        validatedData.userId
      );
      if (existingLink) {
        throw new Error('Usuário já vinculado a esta academia');
      }

      // Criar vínculo
      const createdLink = await AcademyUserRepository.create(validatedData);

      return createdLink;
    } catch (error) {
      throw error;
    }
  }

  // Buscar todos os vínculos
  async findAll() {
    try {
      return await AcademyUserRepository.findAll();
    } catch (error) {
      throw error;
    }
  }

  // Buscar vínculo por ID
  async findById(id) {
    try {
      const link = await AcademyUserRepository.findById(id);
      if (!link) {
        throw new Error('Vínculo não encontrado');
      }
      return link;
    } catch (error) {
      throw error;
    }
  }

  // Buscar usuários de uma academia
  async findByAcademyId(academyId) {
    try {
      // Verificar se academia existe
      const academy = await AcademyRepository.findById(academyId);
      if (!academy) {
        throw new Error('Academia não encontrada');
      }

      return await AcademyUserRepository.findByAcademyId(academyId);
    } catch (error) {
      throw error;
    }
  }

  // Buscar academias de um usuário
  async findByUserId(userId) {
    try {
      // Verificar se usuário existe
      const user = await UserRepository.findById(userId);
      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      return await AcademyUserRepository.findByUserId(userId);
    } catch (error) {
      throw error;
    }
  }

  // Buscar academias ativas de um usuário
  async findActiveByUserId(userId) {
    try {
      // Verificar se usuário existe
      const user = await UserRepository.findById(userId);
      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      return await AcademyUserRepository.findActiveByUserId(userId);
    } catch (error) {
      throw error;
    }
  }

  // Deletar vínculo por ID
  async delete(id) {
    try {
      // Verificar se vínculo existe
      const link = await AcademyUserRepository.findById(id);
      if (!link) {
        throw new Error('Vínculo não encontrado');
      }

      // Deletar permanentemente
      await AcademyUserRepository.delete(id);
      return true;
    } catch (error) {
      throw error;
    }
  }

  // Deletar vínculo por academia e usuário
  async deleteByAcademyAndUser(academyId, userId) {
    try {
      // Verificar se vínculo existe
      const link = await AcademyUserRepository.findByAcademyAndUser(academyId, userId);
      if (!link) {
        throw new Error('Vínculo não encontrado');
      }

      // Deletar vínculo
      await AcademyUserRepository.deleteByAcademyAndUser(academyId, userId);
      return true;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new AcademyUserService();
