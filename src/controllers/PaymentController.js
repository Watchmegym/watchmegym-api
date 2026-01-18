const PaymentService = require('../services/PaymentService');

class PaymentController {
  async create(req, res) {
    try {
      const payment = await PaymentService.create(req.body);
      res.status(201).json(payment);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getAll(req, res) {
    try {
      const payments = await PaymentService.getAll(req.query);
      res.json(payments);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getById(req, res) {
    try {
      const payment = await PaymentService.getById(req.params.id);
      res.json(payment);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  async getByUserId(req, res) {
    try {
      const payments = await PaymentService.getByUserId(req.params.userId);
      res.json(payments);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  async getPendingByUserId(req, res) {
    try {
      const payments = await PaymentService.getPendingByUserId(req.params.userId);
      res.json(payments);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  async getMyPayments(req, res) {
    try {
      // Assumindo que userId virá do token JWT futuramente
      const userId = req.query.userId || req.params.userId;
      
      if (!userId) {
        return res.status(400).json({ error: 'userId é obrigatório' });
      }

      const payments = await PaymentService.getByUserId(userId);
      res.json(payments);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  async getMyPendingPayments(req, res) {
    try {
      // Assumindo que userId virá do token JWT futuramente
      const userId = req.query.userId || req.params.userId;
      
      if (!userId) {
        return res.status(400).json({ error: 'userId é obrigatório' });
      }

      const payments = await PaymentService.getPendingByUserId(userId);
      res.json(payments);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  async getBySubscriptionId(req, res) {
    try {
      const payments = await PaymentService.getBySubscriptionId(req.params.subscriptionId);
      res.json(payments);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  async update(req, res) {
    try {
      const payment = await PaymentService.update(req.params.id, req.body);
      res.json(payment);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async markAsPaid(req, res) {
    try {
      const payment = await PaymentService.markAsPaid(req.params.id, req.body.paymentDate);
      res.json({
        message: 'Pagamento marcado como pago',
        payment,
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async delete(req, res) {
    try {
      await PaymentService.delete(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async count(req, res) {
    try {
      const count = await PaymentService.count(req.query);
      res.json({ count });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getTotalPaidByUser(req, res) {
    try {
      const total = await PaymentService.getTotalPaidByUser(req.params.userId);
      res.json({
        userId: req.params.userId,
        totalPaid: total,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async checkOverdue(req, res) {
    try {
      const count = await PaymentService.checkOverdue();
      res.json({
        message: `${count} pagamento(s) vencido(s) atualizado(s)`,
        count,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new PaymentController();
