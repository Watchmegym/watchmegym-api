# 🔐 Sistema de Autenticação - WatchMeGym API

> **⚠️ IMPORTANTE:** Autenticação gerenciada **APENAS pelo Supabase Auth**  
> A tabela `usuarios` NÃO armazena senha - apenas dados de perfil.

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Como Funciona](#como-funciona)
- [Endpoints](#endpoints)
- [Fluxo de Autenticação](#fluxo-de-autenticação)
- [Middleware de Proteção](#middleware-de-proteção)
- [Integração com Frontend](#integração-com-frontend)
- [Exemplos Práticos](#exemplos-práticos)
- [Troubleshooting](#troubleshooting)

---

## 🎯 Visão Geral

O WatchMeGym usa **Supabase Auth** para gerenciamento completo de autenticação:

- ✅ **JWT Tokens** (Access + Refresh)
- ✅ **Registro de usuários** com validação
- ✅ **Login** com email/senha
- ✅ **Recuperação de senha** por email
- ✅ **Refresh automático** de tokens
- ✅ **Sincronização** com banco local via `supabaseAuthId`
- ✅ **Senha gerenciada APENAS pelo Supabase** (não duplicada)

---

## 🔄 Como Funciona

### Arquitetura

```
┌─────────────────────────────────────────┐
│  Supabase Auth (auth.users)            │
│  ├─ id (UUID)                          │
│  ├─ email                               │
│  ├─ encrypted_password ← ÚNICA SENHA   │
│  └─ Gerencia: autenticação, tokens     │
└─────────────────────────────────────────┘
           ↕️ Vinculado via supabaseAuthId
┌─────────────────────────────────────────┐
│  Banco Local (usuarios - Prisma)       │
│  ├─ id (UUID próprio)                  │
│  ├─ supabaseAuthId → auth.users.id     │
│  ├─ email, name, phone, cpfCnpj        │
│  ├─ active                              │
│  └─ Dados de perfil + relações         │
│  ❌ SEM campo password                 │
└─────────────────────────────────────────┘
```

### Fluxo de Dados

1. **Registro**: Supabase Auth cria usuário → API cria no banco local
2. **Login**: Supabase valida credenciais → Retorna tokens JWT
3. **Requisições**: Cliente envia `Bearer token` → API valida com Supabase
4. **Refresh**: Token expira → Cliente usa refresh token → Recebe novo access token

---

## 📡 Endpoints

### 1. Registrar Usuário

**Endpoint:** `POST /api/auth/register`

**Body:**
```json
{
  "email": "joao@email.com",
  "name": "João Silva",
  "password": "senha123",
  "phone": "+5511999999999",     // opcional
  "cpfCnpj": "123.456.789-00"    // opcional
}
```

**Resposta (201):**
```json
{
  "user": {
    "id": "uuid",
    "email": "joao@email.com",
    "name": "João Silva",
    "phone": "+5511999999999",
    "cpfCnpj": "123.456.789-00",
    "active": true,
    "createdAt": "2026-01-18T10:00:00.000Z"
  },
  "message": "Usuário criado com sucesso!",
  "session": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "refresh_token_here...",
    "expiresIn": 3600,
    "expiresAt": 1737201600,
    "tokenType": "bearer"
  }
}
```

**Erros:**
- `400`: Email já cadastrado
- `400`: Dados inválidos (validação Zod)

---

### 2. Fazer Login

**Endpoint:** `POST /api/auth/login`

**Body:**
```json
{
  "email": "joao@email.com",
  "password": "senha123"
}
```

**Resposta (200):**
```json
{
  "user": {
    "id": "uuid",
    "email": "joao@email.com",
    "name": "João Silva",
    "phone": "+5511999999999",
    "cpfCnpj": "123.456.789-00",
    "active": true,
    "createdAt": "2026-01-18T10:00:00.000Z"
  },
  "session": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "refresh_token_here...",
    "expiresIn": 3600,
    "expiresAt": 1737201600,
    "tokenType": "bearer"
  }
}
```

**Erros:**
- `401`: Email ou senha incorretos
- `401`: Usuário inativo
- `401`: Email não confirmado

---

### 3. Obter Perfil do Usuário Logado

**Endpoint:** `GET /api/auth/me`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Resposta (200):**
```json
{
  "user": {
    "id": "uuid",
    "email": "joao@email.com",
    "name": "João Silva",
    "phone": "+5511999999999",
    "cpfCnpj": "123.456.789-00",
    "active": true,
    "createdAt": "2026-01-18T10:00:00.000Z"
  }
}
```

**Erros:**
- `401`: Token não fornecido
- `401`: Token inválido ou expirado

---

### 4. Atualizar Tokens (Refresh)

**Endpoint:** `POST /api/auth/refresh`

**Body:**
```json
{
  "refreshToken": "refresh_token_here..."
}
```

**Resposta (200):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (novo)",
  "refreshToken": "refresh_token_here... (novo)",
  "expiresIn": 3600,
  "expiresAt": 1737205200,
  "tokenType": "bearer"
}
```

**Erros:**
- `401`: Refresh token inválido ou expirado

---

### 5. Fazer Logout

**Endpoint:** `POST /api/auth/logout`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Resposta (200):**
```json
{
  "message": "Logout realizado com sucesso"
}
```

---

### 6. Solicitar Recuperação de Senha

**Endpoint:** `POST /api/auth/forgot-password`

**Body:**
```json
{
  "email": "joao@email.com"
}
```

**Resposta (200):**
```json
{
  "message": "Email de recuperação enviado com sucesso!"
}
```

**Nota:** Email será enviado pelo Supabase com link de reset.

---

### 7. Resetar Senha

**Endpoint:** `POST /api/auth/reset-password`

**Body:**
```json
{
  "token": "token_do_email",
  "password": "novaSenha123"
}
```

**Resposta (200):**
```json
{
  "message": "Senha atualizada com sucesso!"
}
```

---

## 🔄 Fluxo de Autenticação

### Fluxo 1: Novo Usuário

```
1. POST /api/auth/register
   ↓
2. Receber accessToken + refreshToken
   ↓
3. Armazenar tokens (localStorage/AsyncStorage)
   ↓
4. Usar accessToken em requisições:
   Authorization: Bearer {accessToken}
```

### Fluxo 2: Usuário Existente

```
1. POST /api/auth/login
   ↓
2. Receber accessToken + refreshToken
   ↓
3. Armazenar tokens
   ↓
4. Usar accessToken em requisições
```

### Fluxo 3: Token Expirado

```
1. Requisição retorna 401 (token expirado)
   ↓
2. POST /api/auth/refresh com refreshToken
   ↓
3. Receber novo accessToken + refreshToken
   ↓
4. Atualizar tokens armazenados
   ↓
5. Repetir requisição original
```

### Fluxo 4: Refresh Token Expirado

```
1. POST /api/auth/refresh retorna 401
   ↓
2. Limpar tokens armazenados
   ↓
3. Redirecionar para /login
```

### Fluxo 5: Esqueci Minha Senha

```
1. POST /api/auth/forgot-password
   ↓
2. Usuário recebe email
   ↓
3. Clicar no link do email
   ↓
4. Frontend captura token da URL
   ↓
5. POST /api/auth/reset-password com token + nova senha
   ↓
6. POST /api/auth/login com nova senha
```

---

## 🛡️ Middleware de Proteção

### Proteger Rotas

Use o middleware `auth` para proteger rotas:

```javascript
const { auth } = require('../middlewares/auth');

// Rota protegida - requer autenticação
router.get('/protected', auth, controller.method);

// Na controller, o usuário estará em req.user:
async method(req, res) {
  const userId = req.user.id;       // ✅ Disponível
  const userName = req.user.name;   // ✅ Disponível
  // ...
}
```

### Autenticação Opcional

Use `optionalAuth` para rotas que funcionam com ou sem autenticação:

```javascript
const { optionalAuth } = require('../middlewares/auth');

// Rota opcional - funciona sem token
router.get('/optional', optionalAuth, controller.method);

// Na controller:
async method(req, res) {
  if (req.user) {
    // Usuário logado
    const userId = req.user.id;
  } else {
    // Usuário anônimo
  }
}
```

### Exemplo Completo

```javascript
// src/routes/recordings.routes.js
const express = require('express');
const router = express.Router();
const RecordingController = require('../controllers/RecordingController');
const validate = require('../middlewares/validate');
const { auth } = require('../middlewares/auth');
const { StartRecordingSchema } = require('../schemas/recording.schema');

// ✅ Rota protegida - só usuários autenticados podem gravar
router.post(
  '/start',
  auth,  // ← Middleware de autenticação
  validate(StartRecordingSchema),
  RecordingController.recordFromRTSP
);

module.exports = router;
```

---

## 💻 Integração com Frontend

### React/Next.js

```javascript
// hooks/useAuth.js
import { useState, useEffect } from 'react';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    const token = localStorage.getItem('accessToken');
    
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        // Token inválido, tentar refresh
        await refreshToken();
      }
    } catch (error) {
      console.error('Erro ao verificar auth:', error);
    } finally {
      setLoading(false);
    }
  }

  async function login(email, password) {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error);
    }

    const data = await res.json();
    
    localStorage.setItem('accessToken', data.session.accessToken);
    localStorage.setItem('refreshToken', data.session.refreshToken);
    
    setUser(data.user);
    return data;
  }

  async function register(userData) {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error);
    }

    const data = await res.json();
    
    localStorage.setItem('accessToken', data.session.accessToken);
    localStorage.setItem('refreshToken', data.session.refreshToken);
    
    setUser(data.user);
    return data;
  }

  async function refreshToken() {
    const refreshToken = localStorage.getItem('refreshToken');
    
    if (!refreshToken) {
      logout();
      return;
    }

    try {
      const res = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken })
      });

      if (!res.ok) {
        logout();
        return;
      }

      const data = await res.json();
      
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      
      await checkAuth();
    } catch (error) {
      console.error('Erro ao fazer refresh:', error);
      logout();
    }
  }

  async function logout() {
    const token = localStorage.getItem('accessToken');
    
    if (token) {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
    }
    
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
  }

  return {
    user,
    loading,
    login,
    register,
    logout,
    refreshToken
  };
}
```

### Axios Interceptor

```javascript
// api/axios.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api'
});

// Interceptor de requisição - adicionar token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de resposta - refresh automático
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Se 401 e não é requisição de refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        
        const { data } = await axios.post('/api/auth/refresh', {
          refreshToken
        });

        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);

        // Repetir requisição original
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh falhou, redirecionar para login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
```

### React Native

```javascript
// hooks/useAuth.js
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    const token = await AsyncStorage.getItem('accessToken');
    
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('http://localhost:3000/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        await refreshToken();
      }
    } catch (error) {
      console.error('Erro ao verificar auth:', error);
    } finally {
      setLoading(false);
    }
  }

  async function login(email, password) {
    const res = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error);
    }

    const data = await res.json();
    
    await AsyncStorage.setItem('accessToken', data.session.accessToken);
    await AsyncStorage.setItem('refreshToken', data.session.refreshToken);
    
    setUser(data.user);
    return data;
  }

  async function logout() {
    const token = await AsyncStorage.getItem('accessToken');
    
    if (token) {
      await fetch('http://localhost:3000/api/auth/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
    }
    
    await AsyncStorage.removeItem('accessToken');
    await AsyncStorage.removeItem('refreshToken');
    setUser(null);
  }

  return { user, loading, login, logout };
}
```

---

## 🔍 Exemplos Práticos

### Exemplo 1: Proteger Rota de Gravação

```javascript
// Antes (sem autenticação)
router.post('/recordings/start', validate(schema), controller.start);

// Depois (com autenticação)
router.post('/recordings/start', auth, validate(schema), controller.start);

// No controller, acessar usuário logado:
async start(req, res) {
  const userId = req.user.id;  // ✅ ID do usuário autenticado
  // ...
}
```

### Exemplo 2: Rota com Dados Personalizados

```javascript
// Retornar dados do usuário logado
router.get('/my-recordings', auth, async (req, res) => {
  const recordings = await RecordRepository.findByUserId(req.user.id);
  res.json({ recordings });
});
```

### Exemplo 3: Admin Check

```javascript
// Middleware custom para admin
const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Acesso negado' });
  }
  next();
};

// Rota só para admin
router.delete('/users/:id', auth, isAdmin, controller.delete);
```

---

## 🔧 Troubleshooting

### Token Inválido ou Expirado

**Problema:** `401 - Token inválido ou expirado`

**Solução:**
1. Verificar se token está no formato correto: `Bearer {token}`
2. Usar `/api/auth/refresh` para renovar token
3. Se refresh falhar, fazer login novamente

### Email Não Confirmado

**Problema:** `401 - Email ainda não foi confirmado`

**Solução:**
1. Verificar caixa de entrada (e spam) do email
2. Clicar no link de confirmação do Supabase
3. Configurar confirmação automática no painel Supabase (dev only)

### Supabase Não Configurado

**Problema:** `500 - Supabase não está configurado`

**Solução:**
1. Verificar variáveis de ambiente:
   ```env
   SUPABASE_URL=https://xxx.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
   ```
2. Reiniciar servidor

### CORS Error

**Problema:** `CORS policy: No 'Access-Control-Allow-Origin' header`

**Solução:**
```javascript
// src/app.js
const cors = require('cors');

app.use(cors({
  origin: 'http://localhost:3001',  // Frontend URL
  credentials: true
}));
```

---

## 📝 Boas Práticas

### Segurança

1. **NUNCA** commitar tokens no código
2. **NUNCA** expor `SERVICE_ROLE_KEY` no frontend
3. **SEMPRE** usar HTTPS em produção
4. **SEMPRE** validar tokens no backend
5. Implementar rate limiting
6. Configurar CORS adequadamente

### Tokens

1. **Access Token**: Curta duração (1h), usar em todas as requisições
2. **Refresh Token**: Longa duração (7 dias), armazenar de forma segura
3. Implementar refresh automático no frontend
4. Limpar tokens no logout

### UX

1. Mostrar loading durante autenticação
2. Redirecionar automaticamente após login
3. Mensagens de erro claras
4. Salvamento automático de formulários

---

**Versão:** 1.0  
**Data:** 18/01/2026  
**Status:** ✅ Completo e funcional
