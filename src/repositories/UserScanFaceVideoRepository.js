const { prisma } = require('../config');

class UserScanFaceVideoRepository {
  // Criar vídeo de scan face
  async create(videoData) {
    try {
      return await prisma.userScanFaceVideo.create({
        data: videoData,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });
    } catch (error) {
      throw error;
    }
  }

  // Buscar todos os vídeos de scan face
  async findAll() {
    try {
      return await prisma.userScanFaceVideo.findMany({
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
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

  // Buscar vídeo por ID
  async findById(id) {
    try {
      return await prisma.userScanFaceVideo.findUnique({
        where: { id },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });
    } catch (error) {
      throw error;
    }
  }

  // Buscar vídeos por usuário
  async findByUserId(userId) {
    try {
      return await prisma.userScanFaceVideo.findMany({
        where: { userId },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
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

  // Buscar o vídeo mais recente de um usuário
  async findLatestByUserId(userId) {
    try {
      return await prisma.userScanFaceVideo.findFirst({
        where: { userId },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
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

  // Contar vídeos por usuário
  async countByUserId(userId) {
    try {
      return await prisma.userScanFaceVideo.count({
        where: { userId },
      });
    } catch (error) {
      throw error;
    }
  }

  // Atualizar vídeo
  async update(id, videoData) {
    try {
      return await prisma.userScanFaceVideo.update({
        where: { id },
        data: videoData,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });
    } catch (error) {
      throw error;
    }
  }

  // Deletar vídeo
  async delete(id) {
    try {
      return await prisma.userScanFaceVideo.delete({
        where: { id },
      });
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new UserScanFaceVideoRepository();
