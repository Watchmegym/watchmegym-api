const PlanService = require('../services/PlanService');

class PlanController {
  async create(req, res) {
    try {
      const plan = await PlanService.create(req.body);
      res.status(201).json(plan);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getAll(req, res) {
    try {
      const plans = await PlanService.getAll(req.query);
      res.json(plans);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getActive(req, res) {
    try {
      const plans = await PlanService.getActivePlans();
      res.json(plans);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getById(req, res) {
    try {
      const plan = await PlanService.getById(req.params.id);
      res.json(plan);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  async update(req, res) {
    try {
      const plan = await PlanService.update(req.params.id, req.body);
      res.json(plan);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async delete(req, res) {
    try {
      await PlanService.delete(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async hardDelete(req, res) {
    try {
      await PlanService.hardDelete(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async toggleStatus(req, res) {
    try {
      const plan = await PlanService.toggleStatus(req.params.id);
      res.json(plan);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async count(req, res) {
    try {
      const count = await PlanService.count(req.query);
      res.json({ count });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new PlanController();
