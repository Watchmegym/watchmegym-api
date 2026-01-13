const { CreateUserSchema, UpdateUserSchema, LoginSchema } = require('../schemas/user.schema');
const UserRepository = require('../repositories/UserRepository');
const bcrypt = require('bcrypt');

class UserService {
  // Método auxiliar para remover senha do objeto
  _removePassword(user) {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  // Criar novo usuário
  async create(userData) {
    try {
      // Validar dados com Zod
      const validatedData = CreateUserSchema.parse(userData);

      // Verificar se email já existe
      const existingUser = await UserRepository.findByEmail(validatedData.email);
      if (existingUser) {
        throw new Error('Email já cadastrado');
      }

      // Criptografar senha
      const hashedPassword = await bcrypt.hash(validatedData.password, 10);

      // Preparar dados do usuário
      const userToCreate = {
        ...validatedData,
        password: hashedPassword
      };

      // Salvar no banco
      const createdUser = await UserRepository.create(userToCreate);

      // Retornar usuário sem senha
      return this._removePassword(createdUser);
    } catch (error) {
      throw error;
    }
  }

  // Buscar todos os usuários
  async findAll() {
    try {
      const users = await UserRepository.findAll();
      return users.map(user => this._removePassword(user));
    } catch (error) {
      throw error;
    }
  }

  // Buscar usuário por ID
  async findById(id) {
    try {
      const user = await UserRepository.findById(id);
      if (!user) {
        throw new Error('Usuário não encontrado');
      }
      return this._removePassword(user);
    } catch (error) {
      throw error;
    }
  }

  // Buscar usuário por email
  async findByEmail(email) {
    try {
      const user = await UserRepository.findByEmail(email);
      if (!user) {
        throw new Error('Usuário não encontrado');
      }
      return this._removePassword(user);
    } catch (error) {
      throw error;
    }
  }

  // Atualizar usuário
  async update(id, userData) {
    try {
      // Validar dados com Zod
      const validatedData = UpdateUserSchema.parse(userData);

      // Verificar se usuário existe
      const user = await UserRepository.findById(id);
      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      // Se estiver atualizando a senha, criptografar
      if (validatedData.password) {
        validatedData.password = await bcrypt.hash(validatedData.password, 10);
      }

      // Se estiver atualizando email, verificar se já existe
      if (validatedData.email && validatedData.email !== user.email) {
        const existingUser = await UserRepository.findByEmail(validatedData.email);
        if (existingUser) {
          throw new Error('Email já cadastrado');
        }
      }

      // Atualizar no banco
      const updatedUser = await UserRepository.update(id, validatedData);
      return this._removePassword(updatedUser);
    } catch (error) {
      throw error;
    }
  }

  // Deletar usuário (soft delete - apenas desativa)
  async delete(id) {
    try {
      // Verificar se usuário existe
      const user = await UserRepository.findById(id);
      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      // Soft delete - apenas desativa
      await UserRepository.update(id, { active: false });
      return true;
    } catch (error) {
      throw error;
    }
  }

  // Deletar permanentemente
  async hardDelete(id) {
    try {
      // Verificar se usuário existe
      const user = await UserRepository.findById(id);
      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      // Deletar permanentemente
      await UserRepository.delete(id);
      return true;
    } catch (error) {
      throw error;
    }
  }

  // Autenticar usuário (login)
  async authenticate(email, password) {
    try {
      // Validar dados com Zod
      const validatedData = LoginSchema.parse({ email, password });

      // Buscar usuário por email
      const user = await UserRepository.findByEmail(validatedData.email);
      if (!user) {
        throw new Error('Email ou senha inválidos');
      }

      // Verificar se usuário está ativo
      if (!user.active) {
        throw new Error('Usuário inativo');
      }

      // Verificar senha
      const isPasswordValid = await bcrypt.compare(validatedData.password, user.password);
      if (!isPasswordValid) {
        throw new Error('Email ou senha inválidos');
      }

      // Retornar usuário sem senha
      return this._removePassword(user);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new UserService();
