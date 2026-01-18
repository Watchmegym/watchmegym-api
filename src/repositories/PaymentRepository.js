const { prisma } = require('../config');

class PaymentRepository {
  async create(data) {
    return await prisma.payment.create({
      data,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        subscription: {
          include: {
            plan: true,
          },
        },
      },
    });
  }

  async findAll(filters = {}) {
    const where = {};

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.userId) {
      where.userId = filters.userId;
    }

    if (filters.subscriptionId) {
      where.subscriptionId = filters.subscriptionId;
    }

    if (filters.billingType) {
      where.billingType = filters.billingType;
    }

    if (filters.startDate || filters.endDate) {
      where.dueDate = {};
      if (filters.startDate) {
        where.dueDate.gte = new Date(filters.startDate);
      }
      if (filters.endDate) {
        where.dueDate.lte = new Date(filters.endDate);
      }
    }

    return await prisma.payment.findMany({
      where,
      orderBy: {
        dueDate: 'desc',
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        subscription: {
          select: {
            id: true,
            status: true,
            plan: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });
  }

  async findById(id) {
    return await prisma.payment.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            cpfCnpj: true,
            phone: true,
          },
        },
        subscription: {
          include: {
            plan: true,
          },
        },
      },
    });
  }

  async findByAsaasPaymentId(asaasPaymentId) {
    return await prisma.payment.findUnique({
      where: { asaasPaymentId },
      include: {
        user: true,
        subscription: {
          include: {
            plan: true,
          },
        },
      },
    });
  }

  async findByUserId(userId) {
    return await prisma.payment.findMany({
      where: { userId },
      orderBy: {
        dueDate: 'desc',
      },
      include: {
        subscription: {
          include: {
            plan: true,
          },
        },
      },
    });
  }

  async findBySubscriptionId(subscriptionId) {
    return await prisma.payment.findMany({
      where: { subscriptionId },
      orderBy: {
        dueDate: 'desc',
      },
    });
  }

  async findPendingByUserId(userId) {
    return await prisma.payment.findMany({
      where: {
        userId,
        status: 'PENDING',
      },
      orderBy: {
        dueDate: 'asc',
      },
      include: {
        subscription: {
          include: {
            plan: true,
          },
        },
      },
    });
  }

  async findOverdue() {
    return await prisma.payment.findMany({
      where: {
        status: 'PENDING',
        dueDate: {
          lt: new Date(),
        },
      },
      include: {
        user: true,
        subscription: {
          include: {
            plan: true,
          },
        },
      },
    });
  }

  async update(id, data) {
    return await prisma.payment.update({
      where: { id },
      data,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        subscription: {
          include: {
            plan: true,
          },
        },
      },
    });
  }

  async delete(id) {
    return await prisma.payment.delete({
      where: { id },
    });
  }

  async count(filters = {}) {
    const where = {};
    if (filters.status) {
      where.status = filters.status;
    }
    if (filters.userId) {
      where.userId = filters.userId;
    }
    return await prisma.payment.count({ where });
  }

  async sumByUser(userId) {
    const result = await prisma.payment.aggregate({
      where: {
        userId,
        status: {
          in: ['RECEIVED', 'CONFIRMED'],
        },
      },
      _sum: {
        amount: true,
      },
    });
    return result._sum.amount || 0;
  }
}

module.exports = new PaymentRepository();
