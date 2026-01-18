const PaymentRepository = require('../repositories/PaymentRepository');
const SubscriptionRepository = require('../repositories/SubscriptionRepository');
const UserRepository = require('../repositories/UserRepository');
const { 
  CreatePaymentSchema, 
  UpdatePaymentSchema,
  ListPaymentsSchema 
} = require('../schemas/payment.schema');

class PaymentService {
  async create(data) {
    // Validar dados
    const validatedData = CreatePaymentSchema.parse(data);

    // Verificar se usuário existe
    const user = await UserRepository.findById(validatedData.userId);
    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    // Se tiver assinatura, verificar se existe
    if (validatedData.subscriptionId) {
      const subscription = await SubscriptionRepository.findById(validatedData.subscriptionId);
      if (!subscription) {
        throw new Error('Assinatura não encontrada');
      }
    }

    // Criar pagamento
    const payment = await PaymentRepository.create({
      ...validatedData,
      dueDate: new Date(validatedData.dueDate),
    });

    // TODO: Criar cobrança no Asaas (Fase 3)
    // const asaasPayment = await AsaasService.createPayment(...)
    // await PaymentRepository.update(payment.id, {
    //   asaasPaymentId: asaasPayment.id,
    //   invoiceUrl: asaasPayment.invoiceUrl,
    //   bankSlipUrl: asaasPayment.bankSlipUrl,
    // });

    return payment;
  }

  async getAll(filters = {}) {
    if (Object.keys(filters).length > 0) {
      const validatedFilters = ListPaymentsSchema.parse(filters);
      return await PaymentRepository.findAll(validatedFilters);
    }
    
    return await PaymentRepository.findAll();
  }

  async getById(id) {
    const payment = await PaymentRepository.findById(id);
    
    if (!payment) {
      throw new Error('Pagamento não encontrado');
    }

    return payment;
  }

  async getByUserId(userId) {
    return await PaymentRepository.findByUserId(userId);
  }

  async getPendingByUserId(userId) {
    return await PaymentRepository.findPendingByUserId(userId);
  }

  async getBySubscriptionId(subscriptionId) {
    return await PaymentRepository.findBySubscriptionId(subscriptionId);
  }

  async update(id, data) {
    const validatedData = UpdatePaymentSchema.parse(data);

    const payment = await PaymentRepository.findById(id);
    if (!payment) {
      throw new Error('Pagamento não encontrado');
    }

    // Atualizar pagamento
    const updatedPayment = await PaymentRepository.update(id, {
      ...validatedData,
      paymentDate: validatedData.paymentDate ? new Date(validatedData.paymentDate) : undefined,
    });

    // Se o status mudou para RECEIVED ou CONFIRMED, atualizar assinatura
    if (
      (validatedData.status === 'RECEIVED' || validatedData.status === 'CONFIRMED') &&
      payment.status !== 'RECEIVED' &&
      payment.status !== 'CONFIRMED' &&
      payment.subscriptionId
    ) {
      await this.activateSubscription(payment.subscriptionId);
    }

    // Se o status mudou para OVERDUE, suspender assinatura
    if (
      validatedData.status === 'OVERDUE' &&
      payment.status !== 'OVERDUE' &&
      payment.subscriptionId
    ) {
      await this.suspendSubscription(payment.subscriptionId);
    }

    return updatedPayment;
  }

  async delete(id) {
    const payment = await PaymentRepository.findById(id);
    if (!payment) {
      throw new Error('Pagamento não encontrado');
    }

    return await PaymentRepository.delete(id);
  }

  async markAsPaid(id, paymentDate = new Date()) {
    return await this.update(id, {
      status: 'RECEIVED',
      paymentDate,
    });
  }

  async markAsOverdue(id) {
    return await this.update(id, {
      status: 'OVERDUE',
    });
  }

  async count(filters = {}) {
    return await PaymentRepository.count(filters);
  }

  async getTotalPaidByUser(userId) {
    return await PaymentRepository.sumByUser(userId);
  }

  async checkOverdue() {
    const overduePayments = await PaymentRepository.findOverdue();
    
    for (const payment of overduePayments) {
      await PaymentRepository.update(payment.id, {
        status: 'OVERDUE',
      });

      // Suspender assinatura se tiver
      if (payment.subscriptionId) {
        await this.suspendSubscription(payment.subscriptionId);
      }
    }

    return overduePayments.length;
  }

  // Métodos auxiliares privados
  async activateSubscription(subscriptionId) {
    const subscription = await SubscriptionRepository.findById(subscriptionId);
    if (subscription && subscription.status !== 'ACTIVE') {
      await SubscriptionRepository.update(subscriptionId, {
        status: 'ACTIVE',
      });
    }
  }

  async suspendSubscription(subscriptionId) {
    const subscription = await SubscriptionRepository.findById(subscriptionId);
    if (subscription && subscription.status === 'ACTIVE') {
      await SubscriptionRepository.update(subscriptionId, {
        status: 'SUSPENDED',
      });
    }
  }

  // Processar webhook do Asaas (será implementado na Fase 5)
  async processWebhook(event, paymentData) {
    // TODO: Implementar na Fase 5
    console.log('Webhook recebido:', event, paymentData);
  }
}

module.exports = new PaymentService();
