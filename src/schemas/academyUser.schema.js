const { z } = require('zod');

// Schema de validação para vincular usuário à academia
const CreateAcademyUserSchema = z.object({
  academyId: z
    .string({ required_error: 'ID da academia é obrigatório' })
    .uuid('ID da academia inválido'),
  
  userId: z
    .string({ required_error: 'ID do usuário é obrigatório' })
    .uuid('ID do usuário inválido'),
});

module.exports = {
  CreateAcademyUserSchema,
};
