const { z } = require('zod');

// Schema base com todos os campos de bioimpedância
const BioimpedanceBaseSchema = {
  // Dispositivo
  deviceModel: z.string().optional().nullable(),
  unitName: z.string().optional().nullable(),
  unitNo: z.string().optional().nullable(),
  macAddr: z.string().optional().nullable(),
  deviceNo: z.string().optional().nullable(),

  // Dados do Usuário na Máquina
  machineUserId: z.string().optional().nullable(),
  name: z.string().optional().nullable(),
  loginType: z.string().optional().nullable(),
  measureTime: z.preprocess((arg) => {
    if (typeof arg === "string" || arg instanceof Date) return new Date(arg);
  }, z.date().optional().nullable()),
  address: z.string().optional().nullable(),
  birthday: z.preprocess((arg) => {
    if (typeof arg === "string" || arg instanceof Date) return new Date(arg);
  }, z.date().optional().nullable()),
  age: z.number().int().optional().nullable(),
  sex: z.number().int().optional().nullable(),
  recordNo: z.string().optional().nullable(),

  // Dados Básicos (obrigatórios no banco, mas opcionais no schema para facilitar upserts parciais)
  weight: z.number().positive().max(500).optional(),
  height: z.number().positive().max(300).optional(),
  bmi: z.number().positive().max(100).optional(),
  bmr: z.number().positive().max(10000).optional(),

  bmiType: z.string().optional().nullable(),
  bmiStatus: z.number().int().optional().nullable(),
  bmiRange: z.string().optional().nullable(),
  weightStatus: z.number().int().optional().nullable(),
  weightRange: z.string().optional().nullable(),

  // Água Corporal
  waterECW: z.number().optional().nullable(),
  waterECWRange: z.string().optional().nullable(),
  waterECWStatus: z.number().int().optional().nullable(),
  waterICW: z.number().optional().nullable(),
  waterICWRange: z.string().optional().nullable(),
  waterICWStatus: z.number().int().optional().nullable(),
  waterRate: z.number().optional().nullable(),
  waterRateRange: z.string().optional().nullable(),
  waterRateStatus: z.number().int().optional().nullable(),

  // Proteína e Ossos
  protein: z.number().optional().nullable(),
  proteinRange: z.string().optional().nullable(),
  proteinStatus: z.number().int().optional().nullable(),
  bone: z.number().optional().nullable(),
  boneRange: z.string().optional().nullable(),
  boneStatus: z.number().int().optional().nullable(),

  // Corpo e Idade
  bodyShape: z.string().optional().nullable(),
  bodyScore: z.number().int().optional().nullable(),
  bodyAge: z.number().int().optional().nullable(),

  // Massa Magra e Gordura
  fatFree: z.number().optional().nullable(),
  fatFreeRange: z.string().optional().nullable(),
  fatFreeStatus: z.number().int().optional().nullable(),
  fat: z.number().optional().nullable(),
  fatRate: z.number().optional().nullable(),
  fatRateRange: z.string().optional().nullable(),
  fatRateStatus: z.number().int().optional().nullable(),

  // Gordura por Região
  fatLeftLeg: z.number().optional().nullable(),
  fatRightLeg: z.number().optional().nullable(),
  fatLeftArm: z.number().optional().nullable(),
  fatRightArm: z.number().optional().nullable(),
  fatTrunk: z.number().optional().nullable(),

  // Massa Muscular
  muscleRate: z.number().optional().nullable(),
  muscleRateRange: z.string().optional().nullable(),
  muscleRateStatus: z.number().int().optional().nullable(),
  muscleLeftLeg: z.number().optional().nullable(),
  muscleRightLeg: z.number().optional().nullable(),
  muscleLeftArm: z.number().optional().nullable(),
  muscleRightArm: z.number().optional().nullable(),
  muscleTrunk: z.number().optional().nullable(),
  skeletalMuscle: z.number().optional().nullable(),

  // Minerais
  mineral: z.number().optional().nullable(),
  mineralRange: z.string().optional().nullable(),
  mineralStatus: z.number().int().optional().nullable(),

  // Metabolismo
  bmrRange: z.string().optional().nullable(),
  bmrStatus: z.number().int().optional().nullable(),
  dci: z.number().int().optional().nullable(),

  // Gordura Visceral e Subcutânea
  visceralFat: z.number().int().optional().nullable(),
  visceralFatRange: z.string().optional().nullable(),
  visceralFatStatus: z.number().int().optional().nullable(),
  fatSubcutaneousRate: z.number().optional().nullable(),
  fatSubcutaneousRange: z.string().optional().nullable(),
  fatSubcutaneousStatus: z.number().int().optional().nullable(),

  // Ajustes
  weightAdjustment: z.number().optional().nullable(),
  muscleAdjustment: z.number().optional().nullable(),
  fatAdjustment: z.number().optional().nullable(),

  // Atividades
  swimMinutes: z.number().int().optional().nullable(),
  walkingMinutes: z.number().int().optional().nullable(),
  joggingMinutes: z.number().int().optional().nullable(),
  aerobicMinutes: z.number().int().optional().nullable(),
};

// Schema para criação (via painel ou manual)
const CreateBioimpedanceSchema = z.object({
  userId: z.string({ required_error: 'ID do usuário é obrigatório' }).uuid('ID do usuário inválido'),
  ...BioimpedanceBaseSchema,
  // Campos obrigatórios mínimos para criação manual
  weight: z.number({ required_error: 'Peso é obrigatório' }).positive(),
  height: z.number({ required_error: 'Altura é obrigatória' }).positive(),
  bmi: z.number({ required_error: 'IMC é obrigatório' }).positive(),
  bmr: z.number({ required_error: 'TMB é obrigatória' }).positive(),
});

// Schema para atualização
const UpdateBioimpedanceSchema = z.object({
  ...BioimpedanceBaseSchema
}).partial();

// Schema específico para o UPLOAD da máquina (recebe o JSON bruto)
const MachineUploadSchema = z.object({
  deviceModel: z.string().optional(),
  unitName: z.string().optional(),
  unitNo: z.string().optional(),
  macAddr: z.string().optional(),
  deviceNo: z.string().optional(),
  datas: z.array(z.record(z.any()))
});

module.exports = {
  CreateBioimpedanceSchema,
  UpdateBioimpedanceSchema,
  MachineUploadSchema
};
