const AuthService = require('../services/AuthService');

/**
 * Middleware para proteger rotas que precisam de autenticação
 * Valida o access token no header Authorization
 * 
 * Uso:
 * router.get('/protected', auth, controller.method);
 */
const auth = async (req, res, next) => {
  try {
    // 1. Extrair token do header
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        error: 'Token não fornecido',
        message: 'Forneça o token no header: Authorization: Bearer {token}',
      });
    }

    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Formato de token inválido',
        message: 'Use o formato: Authorization: Bearer {token}',
      });
    }

    const accessToken = authHeader.replace('Bearer ', '');

    // 2. Verificar token com Supabase
    const user = await AuthService.verifyToken(accessToken);

    // 3. Adicionar usuário ao request para uso nos controllers
    req.user = user;

    next();
  } catch (error) {
    console.error('Erro ao verificar token:', error.message);

    if (error.message.includes('inválido') || error.message.includes('expirado')) {
      return res.status(401).json({
        error: 'Token inválido ou expirado',
        message: 'Faça login novamente ou renove o token usando /api/auth/refresh',
      });
    }

    return res.status(401).json({
      error: 'Não autorizado',
      message: error.message,
    });
  }
};

/**
 * Middleware opcional de autenticação
 * Se token estiver presente, valida e adiciona user ao req
 * Se não estiver presente, apenas continua
 * 
 * Uso:
 * router.get('/optional', optionalAuth, controller.method);
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // Sem token, continua sem user
      req.user = null;
      return next();
    }

    const accessToken = authHeader.replace('Bearer ', '');
    const user = await AuthService.verifyToken(accessToken);

    req.user = user;
    next();
  } catch (error) {
    // Se token inválido, continua sem user (não bloqueia)
    req.user = null;
    next();
  }
};

module.exports = { auth, optionalAuth };
