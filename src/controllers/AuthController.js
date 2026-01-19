const AuthService = require('../services/AuthService');

class AuthController {
  /**
   * POST /api/auth/login
   * Fazer login
   */
  async login(req, res) {
    try {
      const { email, password } = req.body;

      const result = await AuthService.login(email, password);

      return res.status(200).json(result);
    } catch (error) {
      console.error('Erro ao fazer login:', error);

      // Erros de autenticação retornam 401
      if (
        error.message.includes('incorretos') ||
        error.message.includes('inativo') ||
        error.message.includes('não confirmado')
      ) {
        return res.status(401).json({
          error: error.message,
        });
      }

      return res.status(500).json({
        error: 'Erro ao fazer login',
        details: error.message,
      });
    }
  }

  /**
   * POST /api/auth/register
   * Registrar novo usuário
   */
  async register(req, res) {
    try {
      const userData = req.body;

      const result = await AuthService.register(userData);

      return res.status(201).json(result);
    } catch (error) {
      console.error('Erro ao registrar usuário:', error);

      // Erros de validação retornam 400
      if (error.message.includes('já está cadastrado')) {
        return res.status(400).json({
          error: error.message,
        });
      }

      return res.status(500).json({
        error: 'Erro ao registrar usuário',
        details: error.message,
      });
    }
  }

  /**
   * POST /api/auth/refresh
   * Atualizar tokens
   */
  async refreshToken(req, res) {
    try {
      const { refreshToken } = req.body;

      const result = await AuthService.refreshToken(refreshToken);

      return res.status(200).json(result);
    } catch (error) {
      console.error('Erro ao atualizar token:', error);

      if (error.message.includes('inválido') || error.message.includes('expirado')) {
        return res.status(401).json({
          error: error.message,
        });
      }

      return res.status(500).json({
        error: 'Erro ao atualizar token',
        details: error.message,
      });
    }
  }

  /**
   * POST /api/auth/logout
   * Fazer logout
   */
  async logout(req, res) {
    try {
      const accessToken = req.headers.authorization?.replace('Bearer ', '');

      if (!accessToken) {
        return res.status(400).json({
          error: 'Access token não fornecido',
        });
      }

      await AuthService.logout(accessToken);

      return res.status(200).json({
        message: 'Logout realizado com sucesso',
      });
    } catch (error) {
      console.error('Erro ao fazer logout:', error);

      return res.status(500).json({
        error: 'Erro ao fazer logout',
        details: error.message,
      });
    }
  }

  /**
   * POST /api/auth/forgot-password
   * Solicitar recuperação de senha
   */
  async forgotPassword(req, res) {
    try {
      const { email } = req.body;

      const result = await AuthService.forgotPassword(email);

      return res.status(200).json(result);
    } catch (error) {
      console.error('Erro ao solicitar recuperação de senha:', error);

      return res.status(500).json({
        error: 'Erro ao solicitar recuperação de senha',
        details: error.message,
      });
    }
  }

  /**
   * POST /api/auth/reset-password
   * Resetar senha usando token
   */
  async resetPassword(req, res) {
    try {
      const { token, password } = req.body;

      const result = await AuthService.resetPassword(token, password);

      return res.status(200).json(result);
    } catch (error) {
      console.error('Erro ao resetar senha:', error);

      return res.status(500).json({
        error: 'Erro ao resetar senha',
        details: error.message,
      });
    }
  }

  /**
   * GET /api/auth/me
   * Obter dados do usuário logado
   */
  async me(req, res) {
    try {
      const accessToken = req.headers.authorization?.replace('Bearer ', '');

      if (!accessToken) {
        return res.status(401).json({
          error: 'Token não fornecido',
        });
      }

      const user = await AuthService.verifyToken(accessToken);

      return res.status(200).json({ user });
    } catch (error) {
      console.error('Erro ao verificar token:', error);

      if (error.message.includes('inválido') || error.message.includes('expirado')) {
        return res.status(401).json({
          error: error.message,
        });
      }

      return res.status(500).json({
        error: 'Erro ao verificar token',
        details: error.message,
      });
    }
  }
}

module.exports = new AuthController();
