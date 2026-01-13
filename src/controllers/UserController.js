const UserService = require('../services/UserService');

class UserController {
  // Criar novo usuário
  async create(req, res) {
    try {
      const userData = req.body;
      const user = await UserService.create(userData);

      return res.status(201).json({
        message: 'Usuário criado com sucesso',
        user
      });
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      return res.status(400).json({
        error: error.message || 'Erro ao criar usuário'
      });
    }
  }

  // Buscar todos os usuários
  async getAll(req, res) {
    try {
      const users = await UserService.findAll();

      return res.status(200).json({
        message: 'Lista de usuários',
        users
      });
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      return res.status(500).json({
        error: 'Erro interno do servidor'
      });
    }
  }

  // Buscar usuário por ID
  async getById(req, res) {
    try {
      const { id } = req.params;
      const user = await UserService.findById(id);

      return res.status(200).json({
        message: 'Usuário encontrado',
        user
      });
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      
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

  // Atualizar usuário
  async update(req, res) {
    try {
      const { id } = req.params;
      const userData = req.body;
      const user = await UserService.update(id, userData);

      return res.status(200).json({
        message: 'Usuário atualizado com sucesso',
        user
      });
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      
      if (error.message === 'Usuário não encontrado') {
        return res.status(404).json({
          error: error.message
        });
      }

      return res.status(400).json({
        error: error.message || 'Erro ao atualizar usuário'
      });
    }
  }

  // Deletar usuário
  async delete(req, res) {
    try {
      const { id } = req.params;
      await UserService.delete(id);

      return res.status(200).json({
        message: 'Usuário deletado com sucesso'
      });
    } catch (error) {
      console.error('Erro ao deletar usuário:', error);
      
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
}

module.exports = new UserController();
