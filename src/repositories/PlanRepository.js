const { prisma } = require('../config');

class PlanRepository {
  async create(data) {
    return await prisma.plan.create({
      data,
    });
  }

  async findAll(filters = {}) {
    const where = {};

    if (filters.active !== undefined) {
      where.active = filters.active;
    }

    if (filters.cycle) {
      where.cycle = filters.cycle;
    }

    if (filters.minPrice || filters.maxPrice) {
      where.price = {};
      if (filters.minPrice) where.price.gte = filters.minPrice;
      if (filters.maxPrice) where.price.lte = filters.maxPrice;
    }

    return await prisma.plan.findMany({
      where,
      orderBy: {
        price: 'asc',
      },
      include: {
        _count: {
          select: {
            subscriptions: true,
          },
        },
      },
    });
  }

  async findById(id) {
    return await prisma.plan.findUnique({
      where: { id },
      include: {
        subscriptions: {
          where: {
            status: 'ACTIVE',
          },
          select: {
            id: true,
            userId: true,
            status: true,
            startDate: true,
            nextDueDate: true,
          },
        },
        _count: {
          select: {
            subscriptions: true,
          },
        },
      },
    });
  }

  async findByName(name) {
    return await prisma.plan.findUnique({
      where: { name },
    });
  }

  async update(id, data) {
    return await prisma.plan.update({
      where: { id },
      data,
    });
  }

  async delete(id) {
    return await prisma.plan.delete({
      where: { id },
    });
  }

  async softDelete(id) {
    return await prisma.plan.update({
      where: { id },
      data: { active: false },
    });
  }

  async count(filters = {}) {
    const where = {};
    if (filters.active !== undefined) {
      where.active = filters.active;
    }
    return await prisma.plan.count({ where });
  }

  async findActivePlans() {
    return await prisma.plan.findMany({
      where: { active: true },
      orderBy: {
        price: 'asc',
      },
    });
  }
}

module.exports = new PlanRepository();
