const { prisma } = require('../config');

class UserRepository {
  // Criar usuário
  async create(userData) {
    try {
      return await prisma.user.create({
        data: userData
      });
    } catch (error) {
      // Tratar erro de constraint única (CPF/CNPJ duplicado)
      if (error.code === 'P2002') {
        const target = error.meta?.target || [];
        if (target.includes('cpfCnpj')) {
          throw new Error('Este CPF/CNPJ já está cadastrado no sistema');
        }
        if (target.includes('email')) {
          throw new Error('Este email já está cadastrado no sistema');
        }
        if (target.includes('supabaseAuthId')) {
          throw new Error('Este usuário já está cadastrado no sistema');
        }
        throw new Error('Dados já cadastrados no sistema');
      }
      throw error;
    }
  }

  // Buscar todos os usuários
  async findAll() {
    try {
      return await prisma.user.findMany({
        orderBy: {
          createdAt: 'desc'
        }
      });
    } catch (error) {
      throw error;
    }
  }

  // Buscar usuário por ID
  async findById(id) {
    try {
      return await prisma.user.findUnique({
        where: { id }
      });
    } catch (error) {
      throw error;
    }
  }

  // Buscar usuário por email
  async findByEmail(email) {
    try {
      return await prisma.user.findUnique({
        where: { email }
      });
    } catch (error) {
      throw error;
    }
  }

  // Buscar usuário por Supabase Auth ID
  async findBySupabaseAuthId(supabaseAuthId) {
    try {
      return await prisma.user.findUnique({
        where: { supabaseAuthId }
      });
    } catch (error) {
      throw error;
    }
  }

  // Normalizar CPF/CNPJ (remover formatação: pontos, traços, barras, espaços)
  normalizeCpfCnpj(cpfCnpj) {
    if (!cpfCnpj) return null;
    return cpfCnpj.replace(/[.\-\/ ]/g, '');
  }

  // Buscar usuário por CPF/CNPJ (busca exata)
  async findByCpfCnpj(cpfCnpj) {
    try {
      return await prisma.user.findFirst({
        where: { cpfCnpj }
      });
    } catch (error) {
      throw error;
    }
  }

  // Buscar usuário por CPF/CNPJ normalizado (ignora formatação)
  // Útil quando a máquina envia CPF sem formatação mas no banco está formatado
  // Exemplo: máquina envia "17008139780", banco tem "170.081.397-80"
  async findByCpfCnpjNormalized(cpfCnpj) {
    try {
      if (!cpfCnpj) return null;
      
      // Normalizar o CPF recebido (remover formatação)
      const normalized = this.normalizeCpfCnpj(cpfCnpj);
      
      if (!normalized) return null;

      // Usar SQL raw para buscar comparando CPFs normalizados
      // Remove formatação do CPF no banco e compara com o normalizado recebido
      const users = await prisma.$queryRaw`
        SELECT * FROM usuarios
        WHERE "cpfCnpj" IS NOT NULL
        AND REPLACE(REPLACE(REPLACE(REPLACE("cpfCnpj", '.', ''), '-', ''), '/', ''), ' ', '') = ${normalized}
        LIMIT 1
      `;

      if (users && users.length > 0) {
        // Converter o resultado raw para o formato do Prisma
        return users[0];
      }

      return null;
    } catch (error) {
      // Se falhar com SQL raw, tentar método alternativo (buscar todos e filtrar)
      console.warn('Erro ao buscar por CPF normalizado com SQL raw, tentando método alternativo:', error.message);
      
      try {
        const users = await prisma.user.findMany({
          where: {
            cpfCnpj: {
              not: null
            }
          }
        });

        // Filtrar comparando CPFs normalizados
        const user = users.find(u => {
          if (!u.cpfCnpj) return false;
          const userNormalized = this.normalizeCpfCnpj(u.cpfCnpj);
          return userNormalized === normalized;
        });

        return user || null;
      } catch (fallbackError) {
        throw fallbackError;
      }
    }
  }

  // Atualizar usuário
  async update(id, userData) {
    try {
      return await prisma.user.update({
        where: { id },
        data: userData
      });
    } catch (error) {
      throw error;
    }
  }

  // Deletar usuário permanentemente
  async delete(id) {
    try {
      return await prisma.user.delete({
        where: { id }
      });
    } catch (error) {
      throw error;
    }
  }

  // Buscar usuários ativos
  async findActive() {
    try {
      return await prisma.user.findMany({
        where: { active: true },
        orderBy: {
          createdAt: 'desc'
        }
      });
    } catch (error) {
      throw error;
    }
  }

  // Fechar conexão do Prisma
  async disconnect() {
    await prisma.$disconnect();
  }
}

module.exports = new UserRepository();
