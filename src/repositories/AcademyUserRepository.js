const { prisma } = require('../config');

class AcademyUserRepository {
  // Vincular usuário à academia
  async create(academyUserData) {
    try {
      return await prisma.academyUser.create({
        data: academyUserData,
        include: {
          academy: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              active: true,
            },
          },
        },
      });
    } catch (error) {
      throw error;
    }
  }

  // Buscar todos os vínculos
  async findAll() {
    try {
      return await prisma.academyUser.findMany({
        include: {
          academy: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              active: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    } catch (error) {
      throw error;
    }
  }

  // Buscar vínculo por ID
  async findById(id) {
    try {
      return await prisma.academyUser.findUnique({
        where: { id },
        include: {
          academy: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              active: true,
            },
          },
        },
      });
    } catch (error) {
      throw error;
    }
  }

  // Buscar usuários de uma academia
  async findByAcademyId(academyId) {
    try {
      return await prisma.academyUser.findMany({
        where: { academyId },
        include: {
          academy: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              active: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    } catch (error) {
      throw error;
    }
  }

  // Buscar academias de um usuário
  async findByUserId(userId) {
    try {
      return await prisma.academyUser.findMany({
        where: { userId },
        include: {
          academy: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              active: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    } catch (error) {
      throw error;
    }
  }

  // Verificar se vínculo já existe
  async findByAcademyAndUser(academyId, userId) {
    try {
      return await prisma.academyUser.findFirst({
        where: {
          academyId,
          userId,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  // Deletar vínculo
  async delete(id) {
    try {
      return await prisma.academyUser.delete({
        where: { id },
      });
    } catch (error) {
      throw error;
    }
  }

  // Deletar vínculo por academy e user
  async deleteByAcademyAndUser(academyId, userId) {
    try {
      return await prisma.academyUser.deleteMany({
        where: {
          academyId,
          userId,
        },
      });
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new AcademyUserRepository();
