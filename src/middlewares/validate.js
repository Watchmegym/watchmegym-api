const { ZodError } = require('zod');

/**
 * Middleware para validar dados usando schemas Zod
 * @param {ZodSchema} schema - Schema Zod para validação
 * @param {String} source - Fonte dos dados: 'body' (padrão) ou 'query'
 * @returns {Function} Middleware Express
 */
const validate = (schema, source = 'body') => {
  return (req, res, next) => {
    try {
      // Determina a fonte dos dados
      const dataSource = source === 'query' ? req.query : req.body;
      
      // Valida os dados
      const validatedData = schema.parse(dataSource);
      
      // Substitui os dados validados
      if (source === 'query') {
        req.query = validatedData;
      } else {
        req.body = validatedData;
      }
      
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

module.exports = validate;
