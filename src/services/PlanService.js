const PlanRepository = require('../repositories/PlanRepository');
const { CreatePlanSchema, UpdatePlanSchema, ListPlansSchema } = require('../schemas/plan.schema');

class PlanService {
  async create(data) {
    // Validar dados
    const validatedData = CreatePlanSchema.parse(data);

    // Verificar se já existe plano com mesmo nome
    const existingPlan = await PlanRepository.findByName(validatedData.name);
    if (existingPlan) {
      throw new Error('Já existe um plano com este nome');
    }

    // Criar plano
    return await PlanRepository.create(validatedData);
  }

  async getAll(filters = {}) {
    // Validar filtros se houver
    if (Object.keys(filters).length > 0) {
      const validatedFilters = ListPlansSchema.parse(filters);
      return await PlanRepository.findAll(validatedFilters);
    }
    
    return await PlanRepository.findAll();
  }

  async getById(id) {
    const plan = await PlanRepository.findById(id);
    
    if (!plan) {
      throw new Error('Plano não encontrado');
    }

    return plan;
  }

  async getActivePlans() {
    return await PlanRepository.findActivePlans();
  }

  async update(id, data) {
    // Validar dados
    const validatedData = UpdatePlanSchema.parse(data);

    // Verificar se plano existe
    const existingPlan = await PlanRepository.findById(id);
    if (!existingPlan) {
      throw new Error('Plano não encontrado');
    }

    // Se estiver alterando o nome, verificar se não existe outro com mesmo nome
    if (validatedData.name && validatedData.name !== existingPlan.name) {
      const planWithSameName = await PlanRepository.findByName(validatedData.name);
      if (planWithSameName) {
        throw new Error('Já existe um plano com este nome');
      }
    }

    // Atualizar plano
    return await PlanRepository.update(id, validatedData);
  }

  async delete(id) {
    // Verificar se plano existe
    const plan = await PlanRepository.findById(id);
    if (!plan) {
      throw new Error('Plano não encontrado');
    }

    // Verificar se tem assinaturas ativas
    if (plan.subscriptions && plan.subscriptions.length > 0) {
      throw new Error('Não é possível deletar plano com assinaturas ativas. Desative o plano ao invés de deletar.');
    }

    // Fazer soft delete (desativar)
    return await PlanRepository.softDelete(id);
  }

  async hardDelete(id) {
    // Verificar se plano existe
    const plan = await PlanRepository.findById(id);
    if (!plan) {
      throw new Error('Plano não encontrado');
    }

    // Verificar se tem assinaturas
    if (plan._count?.subscriptions > 0) {
      throw new Error('Não é possível deletar plano com assinaturas. Use desativação ao invés.');
    }

    // Deletar permanentemente
    return await PlanRepository.delete(id);
  }

  async toggleStatus(id) {
    const plan = await PlanRepository.findById(id);
    if (!plan) {
      throw new Error('Plano não encontrado');
    }

    return await PlanRepository.update(id, { active: !plan.active });
  }

  async count(filters = {}) {
    return await PlanRepository.count(filters);
  }
}

module.exports = new PlanService();
