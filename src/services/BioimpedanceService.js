const { CreateBioimpedanceSchema, UpdateBioimpedanceSchema } = require('../schemas/bioimpedance.schema');
const BioimpedanceRepository = require('../repositories/BioimpedanceRepository');
const UserRepository = require('../repositories/UserRepository');

class BioimpedanceService {
  // Criar nova bioimpedância
  async create(bioimpedanceData) {
    try {
      // Validar dados com Zod
      const validatedData = CreateBioimpedanceSchema.parse(bioimpedanceData);

      // Verificar se usuário existe
      const user = await UserRepository.findById(validatedData.userId);
      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      // Criar bioimpedância
      const createdBioimpedance = await BioimpedanceRepository.create(validatedData);

      return createdBioimpedance;
    } catch (error) {
      throw error;
    }
  }

  // Buscar todas as bioimpedâncias
  async findAll() {
    try {
      return await BioimpedanceRepository.findAll();
    } catch (error) {
      throw error;
    }
  }

  // Buscar bioimpedância por ID
  async findById(id) {
    try {
      const bioimpedance = await BioimpedanceRepository.findById(id);
      if (!bioimpedance) {
        throw new Error('Bioimpedância não encontrada');
      }
      return bioimpedance;
    } catch (error) {
      throw error;
    }
  }

  // Buscar bioimpedâncias por usuário
  async findByUserId(userId) {
    try {
      // Verificar se usuário existe
      const user = await UserRepository.findById(userId);
      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      return await BioimpedanceRepository.findByUserId(userId);
    } catch (error) {
      throw error;
    }
  }

  // Buscar última bioimpedância de um usuário
  async findLatestByUserId(userId) {
    try {
      // Verificar se usuário existe
      const user = await UserRepository.findById(userId);
      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      const bioimpedance = await BioimpedanceRepository.findLatestByUserId(userId);
      if (!bioimpedance) {
        throw new Error('Nenhuma bioimpedância encontrada para este usuário');
      }

      return bioimpedance;
    } catch (error) {
      throw error;
    }
  }

  // Atualizar bioimpedância
  async update(id, bioimpedanceData) {
    try {
      // Validar dados com Zod
      const validatedData = UpdateBioimpedanceSchema.parse(bioimpedanceData);

      // Verificar se bioimpedância existe
      const bioimpedance = await BioimpedanceRepository.findById(id);
      if (!bioimpedance) {
        throw new Error('Bioimpedância não encontrada');
      }

      // Atualizar no banco
      const updatedBioimpedance = await BioimpedanceRepository.update(id, validatedData);
      return updatedBioimpedance;
    } catch (error) {
      throw error;
    }
  }

  // Deletar bioimpedância
  async delete(id) {
    try {
      // Verificar se bioimpedância existe
      const bioimpedance = await BioimpedanceRepository.findById(id);
      if (!bioimpedance) {
        throw new Error('Bioimpedância não encontrada');
      }

      // Deletar permanentemente
      await BioimpedanceRepository.delete(id);
      return true;
    } catch (error) {
      throw error;
    }
  }

  // Processar Upload da Máquina (Lógica Legada)
  async processMachineUpload(machineData) {
    try {
      console.log('🚀 Recebendo dados da máquina:', machineData);
      const { deviceModel, unitName, unitNo, macAddr, deviceNo, datas } = machineData;

      if (!datas || !Array.isArray(datas) || datas.length === 0) {
        throw new Error('Nenhum dado fornecido');
      }

      const results = [];

      for (const data of datas) {
        if (!data.userID || !data.measureTime) {
          console.log('⚠️ Dados incompletos - userID ou measureTime ausente');
          continue;
        }

        // 1. Mapeamento de Campos (Legado -> Novo)
        const mappedData = {
          // Dispositivo
          deviceModel: deviceModel || null,
          unitName: unitName || null,
          unitNo: unitNo || null,
          macAddr: macAddr || null,
          deviceNo: deviceNo || null,

          // Usuário na máquina
          machineUserId: data.userID,
          name: data.name || null,
          loginType: data.loginType ? String(data.loginType) : null,
          measureTime: data.measureTime ? new Date(data.measureTime) : null,
          address: data.address || null,
          birthday: data.birthday ? new Date(data.birthday) : null,
          age: data.age ? parseInt(data.age) : null,
          sex: data.sex ? parseInt(data.sex) : null,
          recordNo: data.recordNo || null,

          // Dados Básicos
          weight: data.weight ? parseFloat(data.weight) : null,
          height: data.height ? parseFloat(data.height) : null,
          bmi: data.bmi ? parseFloat(data.bmi) : null,
          bmiType: data.bmiType || null,
          bmiStatus: data.bmi_s ? parseInt(data.bmi_s) : null,
          bmiRange: data.bmi_n || null,
          weightStatus: data.weight_s ? parseInt(data.weight_s) : null,
          weightRange: data.weight_n || null,

          // Água Corporal
          waterECW: data.waterECW ? parseFloat(data.waterECW) : null,
          waterECWRange: data.waterECW_n || null,
          waterECWStatus: data.waterECW_s ? parseInt(data.waterECW_s) : null,
          waterICW: data.waterICW ? parseFloat(data.waterICW) : null,
          waterICWRange: data.waterICW_n || null,
          waterICWStatus: data.waterICW_s ? parseInt(data.waterICW_s) : null,
          waterRate: data.waterRate ? parseFloat(data.waterRate) : null,
          waterRateRange: data.waterRate_n || null,
          waterRateStatus: data.waterRate_s ? parseInt(data.waterRate_s) : null,

          // Proteína
          protein: data.protein ? parseFloat(data.protein) : null,
          proteinRange: data.protein_n || null,
          proteinStatus: data.protein_s ? parseInt(data.protein_s) : null,

          // Ossos
          bone: data.bone ? parseFloat(data.bone) : null,
          boneRange: data.bone_n || null,
          boneStatus: data.bone_s ? parseInt(data.bone_s) : null,

          // Corpo
          bodyShape: data.bodyShape || null,
          bodyScore: data.bodyScore ? parseInt(data.bodyScore) : null,
          bodyAge: data.bodyAge ? parseInt(data.bodyAge) : null,

          // Massa Magra e Gordura
          fatFree: data.fatFree ? parseFloat(data.fatFree) : null,
          fatFreeRange: data.fatFree_n || null,
          fatFreeStatus: data.fatFree_s ? parseInt(data.fatFree_s) : null,
          fat: data.fat ? parseFloat(data.fat) : null,
          fatRate: data.fatRate ? parseFloat(data.fatRate) : null,
          fatRateRange: data.fatRate_n || null,
          fatRateStatus: data.fatRate_s ? parseInt(data.fatRate_s) : null,

          // Gordura por Região
          fatLeftLeg: data.fatLeftLeg ? parseFloat(data.fatLeftLeg) : null,
          fatRightLeg: data.fatRightLeg ? parseFloat(data.fatRightLeg) : null,
          fatLeftArm: data.fatLeftArm ? parseFloat(data.fatLeftArm) : null,
          fatRightArm: data.fatRightArm ? parseFloat(data.fatRightArm) : null,
          fatTrunk: data.fatTrunk ? parseFloat(data.fatTrunk) : null,

          // Massa Muscular
          muscleRate: data.muscleRate ? parseFloat(data.muscleRate) : null,
          muscleRateRange: data.muscleRate_n || null,
          muscleRateStatus: data.muscleRate_s ? parseInt(data.muscleRate_s) : null,
          muscleLeftLeg: data.muscleLeftLeg ? parseFloat(data.muscleLeftLeg) : null,
          muscleRightLeg: data.muscleRightLeg ? parseFloat(data.muscleRightLeg) : null,
          muscleLeftArm: data.muscleLeftArm ? parseFloat(data.muscleLeftArm) : null,
          muscleRightArm: data.muscleRightArm ? parseFloat(data.muscleRightArm) : null,
          muscleTrunk: data.muscleTrunk ? parseFloat(data.muscleTrunk) : null,
          skeletalMuscle: data.skeletalMuscle ? parseFloat(data.skeletalMuscle) : null,

          // Minerais
          mineral: data.mineral ? parseFloat(data.mineral) : null,
          mineralRange: data.mineral_n || null,
          mineralStatus: data.mineral_s ? parseInt(data.mineral_s) : null,

          // Metabolismo
          bmr: data.bmr ? parseFloat(data.bmr) : null,
          bmrRange: data.bmr_n || null,
          bmrStatus: data.bmr_s ? parseInt(data.bmr_s) : null,
          dci: data.dci ? parseInt(data.dci) : null,

          // Gordura Visceral e Subcutânea
          visceralFat: data.vfal ? parseInt(data.vfal) : null,
          visceralFatRange: data.vfal_n || null,
          visceralFatStatus: data.vfal_s ? parseInt(data.vfal_s) : null,
          fatSubcutaneousRate: data.fatSubCutRate ? parseFloat(data.fatSubCutRate) : null,
          fatSubcutaneousRange: data.fatSubCutRate_n || null,
          fatSubcutaneousStatus: data.fatSubCutRate_s ? parseInt(data.fatSubCutRate_s) : null,

          // Ajustes
          weightAdjustment: data.weAdjus ? parseFloat(data.weAdjus) : null,
          muscleAdjustment: data.muAdjus ? parseFloat(data.muAdjus) : null,
          fatAdjustment: data.faAdjus ? parseFloat(data.faAdjus) : null,

          // Atividades (Minutos)
          swimMinutes: data.swim ? parseInt(data.swim) : null,
          walkingMinutes: data.walking ? parseInt(data.walking) : null,
          joggingMinutes: data.jogging ? parseInt(data.jogging) : null,
          aerobicMinutes: data.aerobic ? parseInt(data.aerobic) : null,
        };

        // 2. Tentar encontrar o usuário no nosso sistema
        // A máquina envia machineUserId que é o CPF/CNPJ sem formatação
        let userId = null;
        const machineUserId = data.userID || data.userId;
        
        if (machineUserId) {
          // Primeiro tenta buscar por ID direto (caso seja UUID)
          let user = await UserRepository.findById(machineUserId);
          
          // Se não encontrou, tenta buscar por CPF/CNPJ normalizado
          // (a máquina envia CPF sem formatação: 17008139780)
          // mas no banco pode estar formatado: 170.081.397-80
          if (!user) {
            user = await UserRepository.findByCpfCnpjNormalized(machineUserId);
          }
          
          if (user) {
            userId = user.id;
            console.log(`✅ Usuário encontrado: ${user.name} (${user.email}) - CPF: ${user.cpfCnpj}`);
          } else {
            console.log(`⚠️ Usuário não encontrado para machineUserId: ${machineUserId}. Salvando como medição sem vínculo.`);
            console.log(`   💡 Dica: Verifique se o CPF/CNPJ "${machineUserId}" está cadastrado no sistema.`);
          }
        } else {
          console.log(`⚠️ machineUserId não fornecido. Salvando como medição sem vínculo.`);
        }

        // 3. Executar Upsert
        const result = await BioimpedanceRepository.upsertFromMachine(userId, mappedData.measureTime, mappedData);
        results.push(result);
      }

      return results;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new BioimpedanceService();
