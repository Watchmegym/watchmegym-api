const { prisma } = require('../config');

class SubscriptionRepository {
  async create(data) {
    return await prisma.subscription.create({
      data,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        plan: true,
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

    if (filters.planId) {
      where.planId = filters.planId;
    }

    if (filters.startDate) {
      where.startDate = {
        gte: new Date(filters.startDate),
      };
    }

    if (filters.endDate) {
      where.endDate = {
        lte: new Date(filters.endDate),
      };
    }

    return await prisma.subscription.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        plan: true,
        _count: {
          select: {
            payments: true,
          },
        },
      },
    });
  }

  async findById(id) {
    return await prisma.subscription.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            cpfCnpj: true,
            phone: true,
            asaasCustomerId: true,
          },
        },
        plan: true,
        payments: {
          orderBy: {
            dueDate: 'desc',
          },
        },
      },
    });
  }

  async findByAsaasSubscriptionId(asaasSubscriptionId) {
    return await prisma.subscription.findUnique({
      where: { asaasSubscriptionId },
      include: {
        user: true,
        plan: true,
      },
    });
  }

  async findByUserId(userId) {
    return await prisma.subscription.findMany({
      where: { userId },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        plan: true,
        payments: {
          orderBy: {
            dueDate: 'desc',
          },
          take: 5,
        },
      },
    });
  }

  async findActiveByUserId(userId) {
    return await prisma.subscription.findFirst({
      where: {
        userId,
        status: 'ACTIVE',
      },
      include: {
        plan: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async update(id, data) {
    return await prisma.subscription.update({
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
        plan: true,
      },
    });
  }

  async cancel(id) {
    return await prisma.subscription.update({
      where: { id },
      data: {
        status: 'CANCELED',
        canceledAt: new Date(),
        autoRenew: false,
      },
    });
  }

  async delete(id) {
    return await prisma.subscription.delete({
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
    return await prisma.subscription.count({ where });
  }

  async findExpired() {
    return await prisma.subscription.findMany({
      where: {
        status: 'ACTIVE',
        endDate: {
          lte: new Date(),
        },
      },
      include: {
        user: true,
        plan: true,
      },
    });
  }
}

module.exports = new SubscriptionRepository();
