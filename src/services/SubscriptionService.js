const SubscriptionRepository = require('../repositories/SubscriptionRepository');
const PlanRepository = require('../repositories/PlanRepository');
const UserRepository = require('../repositories/UserRepository');
const PaymentRepository = require('../repositories/PaymentRepository');
const { 
  CreateSubscriptionSchema, 
  UpdateSubscriptionSchema, 
  CancelSubscriptionSchema,
  ListSubscriptionsSchema 
} = require('../schemas/subscription.schema');

class SubscriptionService {
  async create(data) {
    // Validar dados
    const validatedData = CreateSubscriptionSchema.parse(data);

    // Verificar se usuário existe
    const user = await UserRepository.findById(validatedData.userId);
    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    // Verificar se plano existe e está ativo
    const plan = await PlanRepository.findById(validatedData.planId);
    if (!plan) {
      throw new Error('Plano não encontrado');
    }
    if (!plan.active) {
      throw new Error('Este plano não está mais disponível');
    }

    // Verificar se usuário já tem assinatura ativa
    const activeSubscription = await SubscriptionRepository.findActiveByUserId(validatedData.userId);
    if (activeSubscription) {
      throw new Error('Usuário já possui uma assinatura ativa');
    }

    // Calcular datas
    const startDate = validatedData.startDate ? new Date(validatedData.startDate) : new Date();
    const nextDueDate = this.calculateNextDueDate(startDate, plan.cycle);
    const endDate = this.calculateEndDate(startDate, plan.cycle);

    // Criar assinatura local
    const subscriptionData = {
      userId: validatedData.userId,
      planId: validatedData.planId,
      status: 'ACTIVE',
      startDate,
      endDate,
      nextDueDate,
      paymentMethod: validatedData.paymentMethod || plan.billingType,
      autoRenew: validatedData.autoRenew ?? true,
    };

    const subscription = await SubscriptionRepository.create(subscriptionData);

    // Criar primeiro pagamento
    const paymentData = {
      subscriptionId: subscription.id,
      userId: validatedData.userId,
      amount: plan.price,
      status: 'PENDING',
      billingType: validatedData.paymentMethod || plan.billingType,
      dueDate: nextDueDate,
      description: `Pagamento ${plan.name} - ${this.formatDate(nextDueDate)}`,
    };

    await PaymentRepository.create(paymentData);

    // TODO: Integrar com Asaas aqui (Fase 3)
    // const asaasSubscription = await AsaasService.createSubscription(...)
    // await SubscriptionRepository.update(subscription.id, { 
    //   asaasSubscriptionId: asaasSubscription.id 
    // });

    return await SubscriptionRepository.findById(subscription.id);
  }

  async getAll(filters = {}) {
    if (Object.keys(filters).length > 0) {
      const validatedFilters = ListSubscriptionsSchema.parse(filters);
      return await SubscriptionRepository.findAll(validatedFilters);
    }
    
    return await SubscriptionRepository.findAll();
  }

  async getById(id) {
    const subscription = await SubscriptionRepository.findById(id);
    
    if (!subscription) {
      throw new Error('Assinatura não encontrada');
    }

    return subscription;
  }

  async getByUserId(userId) {
    return await SubscriptionRepository.findByUserId(userId);
  }

  async getActiveByUserId(userId) {
    const subscription = await SubscriptionRepository.findActiveByUserId(userId);
    if (!subscription) {
      throw new Error('Usuário não possui assinatura ativa');
    }
    return subscription;
  }

  async update(id, data) {
    const validatedData = UpdateSubscriptionSchema.parse(data);

    const subscription = await SubscriptionRepository.findById(id);
    if (!subscription) {
      throw new Error('Assinatura não encontrada');
    }

    // TODO: Sincronizar com Asaas se necessário

    return await SubscriptionRepository.update(id, validatedData);
  }

  async cancel(id, reason) {
    const subscription = await SubscriptionRepository.findById(id);
    if (!subscription) {
      throw new Error('Assinatura não encontrada');
    }

    if (subscription.status === 'CANCELED') {
      throw new Error('Assinatura já está cancelada');
    }

    // TODO: Cancelar no Asaas
    // await AsaasService.cancelSubscription(subscription.asaasSubscriptionId);

    return await SubscriptionRepository.cancel(id);
  }

  async reactivate(id) {
    const subscription = await SubscriptionRepository.findById(id);
    if (!subscription) {
      throw new Error('Assinatura não encontrada');
    }

    if (subscription.status !== 'CANCELED' && subscription.status !== 'SUSPENDED') {
      throw new Error('Apenas assinaturas canceladas ou suspensas podem ser reativadas');
    }

    // Recalcular datas
    const startDate = new Date();
    const nextDueDate = this.calculateNextDueDate(startDate, subscription.plan.cycle);
    const endDate = this.calculateEndDate(startDate, subscription.plan.cycle);

    return await SubscriptionRepository.update(id, {
      status: 'ACTIVE',
      startDate,
      endDate,
      nextDueDate,
      canceledAt: null,
    });
  }

  async delete(id) {
    const subscription = await SubscriptionRepository.findById(id);
    if (!subscription) {
      throw new Error('Assinatura não encontrada');
    }

    // Apenas admin pode deletar completamente
    return await SubscriptionRepository.delete(id);
  }

  async count(filters = {}) {
    return await SubscriptionRepository.count(filters);
  }

  async checkExpired() {
    const expired = await SubscriptionRepository.findExpired();
    
    for (const subscription of expired) {
      await SubscriptionRepository.update(subscription.id, {
        status: 'EXPIRED',
      });
    }

    return expired.length;
  }

  // Métodos auxiliares
  calculateNextDueDate(startDate, cycle) {
    const date = new Date(startDate);
    
    switch (cycle) {
      case 'WEEKLY':
        date.setDate(date.getDate() + 7);
        break;
      case 'BIWEEKLY':
        date.setDate(date.getDate() + 14);
        break;
      case 'MONTHLY':
        date.setMonth(date.getMonth() + 1);
        break;
      case 'QUARTERLY':
        date.setMonth(date.getMonth() + 3);
        break;
      case 'SEMIANNUALLY':
        date.setMonth(date.getMonth() + 6);
        break;
      case 'YEARLY':
        date.setFullYear(date.getFullYear() + 1);
        break;
      default:
        date.setMonth(date.getMonth() + 1);
    }
    
    return date;
  }

  calculateEndDate(startDate, cycle) {
    return this.calculateNextDueDate(startDate, cycle);
  }

  formatDate(date) {
    return new Intl.DateTimeFormat('pt-BR').format(new Date(date));
  }
}

module.exports = new SubscriptionService();
