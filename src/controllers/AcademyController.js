const AcademyService = require('../services/AcademyService');

class AcademyController {
  // Criar nova academia
  async create(req, res) {
    try {
      const academyData = req.body;
      const academy = await AcademyService.create(academyData);

      return res.status(201).json({
        message: 'Academia criada com sucesso',
        academy
      });
    } catch (error) {
      console.error('Erro ao criar academia:', error);
      return res.status(400).json({
        error: error.message || 'Erro ao criar academia'
      });
    }
  }

  // Buscar todas as academias
  async getAll(req, res) {
    try {
      const academies = await AcademyService.findAll();

      return res.status(200).json({
        message: 'Lista de academias',
        academies
      });
    } catch (error) {
      console.error('Erro ao buscar academias:', error);
      return res.status(500).json({
        error: 'Erro interno do servidor'
      });
    }
  }

  // Buscar academia por ID
  async getById(req, res) {
    try {
      const { id } = req.params;
      const academy = await AcademyService.findById(id);

      return res.status(200).json({
        message: 'Academia encontrada',
        academy
      });
    } catch (error) {
      console.error('Erro ao buscar academia:', error);
      
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

  // Buscar academia por nome
  async getByName(req, res) {
    try {
      const { name } = req.query;
      
      if (!name) {
        return res.status(400).json({
          error: 'Parâmetro "name" é obrigatório'
        });
      }

      const academies = await AcademyService.findByName(name);

      return res.status(200).json({
        message: 'Academias encontradas',
        academies
      });
    } catch (error) {
      console.error('Erro ao buscar academias por nome:', error);
      return res.status(500).json({
        error: 'Erro interno do servidor'
      });
    }
  }

  // Atualizar academia
  async update(req, res) {
    try {
      const { id } = req.params;
      const academyData = req.body;
      const academy = await AcademyService.update(id, academyData);

      return res.status(200).json({
        message: 'Academia atualizada com sucesso',
        academy
      });
    } catch (error) {
      console.error('Erro ao atualizar academia:', error);
      
      if (error.message === 'Academia não encontrada') {
        return res.status(404).json({
          error: error.message
        });
      }

      return res.status(400).json({
        error: error.message || 'Erro ao atualizar academia'
      });
    }
  }

  // Deletar academia
  async delete(req, res) {
    try {
      const { id } = req.params;
      await AcademyService.delete(id);

      return res.status(200).json({
        message: 'Academia deletada com sucesso'
      });
    } catch (error) {
      console.error('Erro ao deletar academia:', error);
      
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
}

module.exports = new AcademyController();
