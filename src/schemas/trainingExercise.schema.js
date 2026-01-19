const { z } = require('zod');

// Schema de validação para criação de exercício de treino
const CreateTrainingExerciseSchema = z.object({
  trainingId: z
    .string({ required_error: 'ID do treino é obrigatório' })
    .uuid('ID do treino deve ser um UUID válido'),
  
  exerciseId: z
    .string({ required_error: 'ID do exercício é obrigatório' })
    .uuid('ID do exercício deve ser um UUID válido'),
});

// Schema de validação para atualização de exercício de treino
const UpdateTrainingExerciseSchema = z.object({
  trainingId: z
    .string()
    .uuid('ID do treino deve ser um UUID válido')
    .optional(),
  
  exerciseId: z
    .string()
    .uuid('ID do exercício deve ser um UUID válido')
    .optional(),
});

module.exports = {
  CreateTrainingExerciseSchema,
  UpdateTrainingExerciseSchema,
};
