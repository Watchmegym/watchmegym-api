const { CreateAcademySchema, UpdateAcademySchema } = require('../schemas/academy.schema');
const AcademyRepository = require('../repositories/AcademyRepository');

class AcademyService {
  // Criar nova academia
  async create(academyData) {
    try {
      // Validar dados com Zod
      const validatedData = CreateAcademySchema.parse(academyData);

      // Verificar se email já existe
      const existingAcademy = await AcademyRepository.findByEmail(validatedData.email);
      if (existingAcademy) {
        throw new Error('Email já cadastrado');
      }

      // Criar academia
      const createdAcademy = await AcademyRepository.create(validatedData);

      return createdAcademy;
    } catch (error) {
      throw error;
    }
  }

  // Buscar todas as academias
  async findAll() {
    try {
      return await AcademyRepository.findAll();
    } catch (error) {
      throw error;
    }
  }

  // Buscar academia por ID
  async findById(id) {
    try {
      const academy = await AcademyRepository.findById(id);
      if (!academy) {
        throw new Error('Academia não encontrada');
      }
      return academy;
    } catch (error) {
      throw error;
    }
  }

  // Buscar academia por email
  async findByEmail(email) {
    try {
      const academy = await AcademyRepository.findByEmail(email);
      if (!academy) {
        throw new Error('Academia não encontrada');
      }
      return academy;
    } catch (error) {
      throw error;
    }
  }

  // Buscar academia por nome
  async findByName(name) {
    try {
      return await AcademyRepository.findByName(name);
    } catch (error) {
      throw error;
    }
  }

  // Atualizar academia
  async update(id, academyData) {
    try {
      // Validar dados com Zod
      const validatedData = UpdateAcademySchema.parse(academyData);

      // Verificar se academia existe
      const academy = await AcademyRepository.findById(id);
      if (!academy) {
        throw new Error('Academia não encontrada');
      }

      // Se estiver atualizando email, verificar se já existe
      if (validatedData.email && validatedData.email !== academy.email) {
        const existingAcademy = await AcademyRepository.findByEmail(validatedData.email);
        if (existingAcademy) {
          throw new Error('Email já cadastrado');
        }
      }

      // Atualizar no banco
      const updatedAcademy = await AcademyRepository.update(id, validatedData);
      return updatedAcademy;
    } catch (error) {
      throw error;
    }
  }

  // Deletar academia
  async delete(id) {
    try {
      // Verificar se academia existe
      const academy = await AcademyRepository.findById(id);
      if (!academy) {
        throw new Error('Academia não encontrada');
      }

      // Deletar permanentemente
      await AcademyRepository.delete(id);
      return true;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new AcademyService();
