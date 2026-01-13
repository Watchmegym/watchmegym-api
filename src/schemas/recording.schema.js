const { z } = require('zod');

// Schema de validação para iniciar gravação
const StartRecordingSchema = z.object({
  cameraId: z
    .string({ required_error: 'ID da câmera é obrigatório' })
    .uuid('ID da câmera inválido'),
  
  userId: z
    .string({ required_error: 'ID do usuário é obrigatório' })
    .uuid('ID do usuário inválido'),
  
  duration: z
    .number({ required_error: 'Duração é obrigatória' })
    .int('Duração deve ser um número inteiro')
    .min(1, 'Duração mínima: 1 segundo')
    .max(300, 'Duração máxima: 300 segundos (5 minutos)'),
});

// Schema para gravação múltipla
const StartMultipleRecordingsSchema = z.object({
  recordings: z.array(StartRecordingSchema)
    .min(1, 'Pelo menos uma gravação é necessária')
    .max(10, 'Máximo de 10 gravações simultâneas'),
});

module.exports = {
  StartRecordingSchema,
  StartMultipleRecordingsSchema,
};
