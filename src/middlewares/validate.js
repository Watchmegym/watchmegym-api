const { ZodError } = require('zod');

/**
 * Middleware para validar dados usando schemas Zod
 * @param {ZodSchema} schema - Schema Zod para validação
 * @returns {Function} Middleware Express
 */
const validate = (schema) => {
  return (req, res, next) => {
    try {
      // Valida os dados do body
      const validatedData = schema.parse(req.body);
      
      // Substitui req.body pelos dados validados
      req.body = validatedData;
      
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        // Formatar erros do Zod
        const errors = error.errors.map(err => ({
          campo: err.path.join('.'),
          mensagem: err.message
        }));
        
        return res.status(400).json({
          error: 'Dados inválidos',
          details: errors
        });
      }
      
      // Outros erros
      return res.status(500).json({
        error: 'Erro interno do servidor'
      });
    }
  };
};

module.exports = { validate };
