const SubscriptionService = require('../services/SubscriptionService');

class SubscriptionController {
  async create(req, res) {
    try {
      const subscription = await SubscriptionService.create(req.body);
      res.status(201).json(subscription);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getAll(req, res) {
    try {
      const subscriptions = await SubscriptionService.getAll(req.query);
      res.json(subscriptions);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getById(req, res) {
    try {
      const subscription = await SubscriptionService.getById(req.params.id);
      res.json(subscription);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  async getByUserId(req, res) {
    try {
      const subscriptions = await SubscriptionService.getByUserId(req.params.userId);
      res.json(subscriptions);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  async getActiveByUserId(req, res) {
    try {
      const subscription = await SubscriptionService.getActiveByUserId(req.params.userId);
      res.json(subscription);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  async getMySubscription(req, res) {
    try {
      // Assumindo que userId virá do token JWT futuramente
      const userId = req.query.userId || req.params.userId;
      
      if (!userId) {
        return res.status(400).json({ error: 'userId é obrigatório' });
      }

      const subscription = await SubscriptionService.getActiveByUserId(userId);
      res.json(subscription);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  async update(req, res) {
    try {
      const subscription = await SubscriptionService.update(req.params.id, req.body);
      res.json(subscription);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async cancel(req, res) {
    try {
      const subscription = await SubscriptionService.cancel(req.params.id, req.body.reason);
      res.json({
        message: 'Assinatura cancelada com sucesso',
        subscription,
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async reactivate(req, res) {
    try {
      const subscription = await SubscriptionService.reactivate(req.params.id);
      res.json({
        message: 'Assinatura reativada com sucesso',
        subscription,
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async delete(req, res) {
    try {
      await SubscriptionService.delete(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async count(req, res) {
    try {
      const count = await SubscriptionService.count(req.query);
      res.json({ count });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async checkExpired(req, res) {
    try {
      const count = await SubscriptionService.checkExpired();
      res.json({
        message: `${count} assinatura(s) expirada(s) atualizada(s)`,
        count,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new SubscriptionController();
