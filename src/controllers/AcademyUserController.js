const AcademyUserService = require('../services/AcademyUserService');

class AcademyUserController {
  // Vincular usuário à academia
  async create(req, res) {
    try {
      const academyUserData = req.body;
      const link = await AcademyUserService.create(academyUserData);

      return res.status(201).json({
        message: 'Usuário vinculado à academia com sucesso',
        link
      });
    } catch (error) {
      console.error('Erro ao vincular usuário:', error);
      return res.status(400).json({
        error: error.message || 'Erro ao vincular usuário'
      });
    }
  }

  // Buscar todos os vínculos
  async getAll(req, res) {
    try {
      const links = await AcademyUserService.findAll();

      return res.status(200).json({
        message: 'Lista de vínculos',
        links
      });
    } catch (error) {
      console.error('Erro ao buscar vínculos:', error);
      return res.status(500).json({
        error: 'Erro interno do servidor'
      });
    }
  }

  // Buscar vínculo por ID
  async getById(req, res) {
    try {
      const { id } = req.params;
      const link = await AcademyUserService.findById(id);

      return res.status(200).json({
        message: 'Vínculo encontrado',
        link
      });
    } catch (error) {
      console.error('Erro ao buscar vínculo:', error);
      
      if (error.message === 'Vínculo não encontrado') {
        return res.status(404).json({
          error: error.message
        });
      }

      return res.status(500).json({
        error: 'Erro interno do servidor'
      });
    }
  }

  // Buscar usuários de uma academia
  async getByAcademyId(req, res) {
    try {
      const { academyId } = req.params;
      const links = await AcademyUserService.findByAcademyId(academyId);

      return res.status(200).json({
        message: 'Usuários da academia',
        users: links.map(link => link.user),
        links
      });
    } catch (error) {
      console.error('Erro ao buscar usuários da academia:', error);
      
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

  // Buscar academias de um usuário
  async getByUserId(req, res) {
    try {
      const { userId } = req.params;
      const links = await AcademyUserService.findByUserId(userId);

      return res.status(200).json({
        message: 'Academias do usuário',
        academies: links.map(link => link.academy),
        links
      });
    } catch (error) {
      console.error('Erro ao buscar academias do usuário:', error);
      
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

  // Deletar vínculo por ID
  async delete(req, res) {
    try {
      const { id } = req.params;
      await AcademyUserService.delete(id);

      return res.status(200).json({
        message: 'Vínculo removido com sucesso'
      });
    } catch (error) {
      console.error('Erro ao remover vínculo:', error);
      
      if (error.message === 'Vínculo não encontrado') {
        return res.status(404).json({
          error: error.message
        });
      }

      return res.status(500).json({
        error: 'Erro interno do servidor'
      });
    }
  }

  // Deletar vínculo por academia e usuário
  async deleteByAcademyAndUser(req, res) {
    try {
      const { academyId, userId } = req.params;
      await AcademyUserService.deleteByAcademyAndUser(academyId, userId);

      return res.status(200).json({
        message: 'Vínculo removido com sucesso'
      });
    } catch (error) {
      console.error('Erro ao remover vínculo:', error);
      
      if (error.message === 'Vínculo não encontrado') {
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

module.exports = new AcademyUserController();
