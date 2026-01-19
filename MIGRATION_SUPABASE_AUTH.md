# 🔄 Migração para Supabase Auth Puro

## 📋 Resumo da Mudança

**Antes:** Autenticação híbrida (Supabase Auth + senha bcrypt no Prisma)  
**Depois:** Autenticação APENAS Supabase Auth (sem duplicação)

---

## ✅ O Que Foi Alterado

### 1. **Schema do Prisma**

```diff
model User {
  id              String   @id @default(uuid())
+ supabaseAuthId  String?  @unique  // ID do usuário no auth.users
  email           String   @unique
  name            String
- password        String              // ❌ REMOVIDO
  active          Boolean  @default(true)
  cpfCnpj         String?  @unique
  phone           String?
  // ... outros campos
}
```

**Mudanças:**
- ✅ Adicionado `supabaseAuthId` para vincular com `auth.users`
- ❌ Removido campo `password` (Supabase gerencia)

---

### 2. **Banco de Dados**

**Migration aplicada:**
```sql
-- Adicionar supabaseAuthId
ALTER TABLE "usuarios" ADD COLUMN "supabaseAuthId" TEXT;
CREATE UNIQUE INDEX "usuarios_supabaseAuthId_key" ON "usuarios"("supabaseAuthId");

-- Remover password
ALTER TABLE "usuarios" DROP COLUMN "password";
```

---

### 3. **UserService.js**

**Removido:**
- ❌ `bcrypt` import
- ❌ Lógica de hash de senha
- ❌ Método `authenticate()` (movido para AuthService)
- ❌ Método `_removePassword()` (não precisa mais)

**Adicionado:**
- ✅ Método `findBySupabaseAuthId()`

**Simplificado:**
- `create()` - Não hasheia senha
- `update()` - Não atualiza senha
- `findAll()`, `findById()`, `findByEmail()` - Retornam usuário completo (sem senha para remover)

---

### 4. **UserRepository.js**

**Adicionado:**
```javascript
async findBySupabaseAuthId(supabaseAuthId) {
  return await prisma.user.findUnique({
    where: { supabaseAuthId }
  });
}
```

---

### 5. **user.schema.js**

```diff
const CreateUserSchema = z.object({
+ supabaseAuthId: z.string().optional().nullable(),
  email: z.string().email(),
  name: z.string().min(3),
- password: z.string().min(6),  // ❌ REMOVIDO
  phone: z.string().optional(),
+ cpfCnpj: z.string().optional(),
  active: z.boolean().default(true),
});

const UpdateUserSchema = z.object({
+ supabaseAuthId: z.string().optional(),
  email: z.string().email().optional(),
  name: z.string().min(3).optional(),
- password: z.string().min(6).optional(),  // ❌ REMOVIDO
  phone: z.string().optional(),
+ cpfCnpj: z.string().optional(),
  active: z.boolean().optional(),
});

- const LoginSchema = ...  // ❌ REMOVIDO (movido para auth.schema.js)
```

---

### 6. **AuthService.js**

**Atualizado `register()`:**
```javascript
// Antes
const user = await UserRepository.create({
  email,
  name,
  password,  // ❌ Duplicado
  ...
});

// Depois
const user = await UserRepository.create({
  supabaseAuthId: authData.user.id,  // ✅ Vinculado
  email,
  name,
  // Sem password
  ...
});
```

**Atualizado `verifyToken()`:**
```javascript
// Busca por supabaseAuthId primeiro, depois por email (para usuários antigos)
let user = await UserRepository.findBySupabaseAuthId(data.user.id).catch(() => null);

if (!user) {
  user = await UserRepository.findByEmail(data.user.email);
  
  // Migração automática: atualiza supabaseAuthId se não existir
  if (user && !user.supabaseAuthId) {
    await UserRepository.update(user.id, { supabaseAuthId: data.user.id });
  }
}
```

---

## 🔑 Como Funciona Agora

### Arquitetura

```
┌─────────────────────────────────────────┐
│  Supabase Auth (auth.users)            │
│  ├─ id (UUID)                          │
│  ├─ email                               │
│  ├─ encrypted_password                  │
│  ├─ email_confirmed_at                  │
│  └─ Gerencia: autenticação, tokens     │
└─────────────────────────────────────────┘
           ↕️ Vinculado via supabaseAuthId
┌─────────────────────────────────────────┐
│  Banco Local (usuarios - Prisma)       │
│  ├─ id (UUID próprio)                  │
│  ├─ supabaseAuthId → auth.users.id     │
│  ├─ email                               │
│  ├─ name                                │
│  ├─ phone, cpfCnpj                      │
│  ├─ active                              │
│  └─ Dados de perfil + relações         │
└─────────────────────────────────────────┘
```

---

### Fluxo de Registro

```
1. Cliente → POST /api/auth/register
   {
     email: "joao@email.com",
     password: "senha123",
     name: "João Silva"
   }

2. AuthService.register()
   ↓
3. Supabase Auth cria usuário
   → Retorna: authData.user.id = "uuid-supabase"
   ↓
4. UserRepository cria registro local
   {
     supabaseAuthId: "uuid-supabase",  ← Vincula
     email: "joao@email.com",
     name: "João Silva"
   }
   ↓
5. Retorna: { user, session: { accessToken, refreshToken } }
```

---

### Fluxo de Login

```
1. Cliente → POST /api/auth/login
   { email, password }

2. AuthService.login()
   ↓
3. Supabase Auth valida credenciais
   → Retorna: { session: { access_token, refresh_token } }
   ↓
4. UserRepository busca dados locais por email
   ↓
5. Retorna: {
     user: { id, name, email, ... },  ← Do banco local
     session: { accessToken, ... }    ← Do Supabase
   }
```

---

### Fluxo de Verificação de Token

```
1. Cliente → GET /api/auth/me
   Authorization: Bearer {accessToken}

2. AuthService.verifyToken()
   ↓
3. Supabase Auth valida token
   → Retorna: { user: { id: "uuid-supabase", email } }
   ↓
4. UserRepository busca por supabaseAuthId
   ↓
5. Retorna: { user: { id, name, email, ... } }
```

---

## 🔄 Migração de Usuários Existentes

### Usuários Antigos (sem supabaseAuthId)

**Problema:** Usuários criados antes da migração têm `supabaseAuthId = null`

**Solução Automática:**

```javascript
// No verifyToken(), se não encontrar por supabaseAuthId:
if (!user) {
  user = await UserRepository.findByEmail(data.user.email);
  
  // Atualiza automaticamente
  if (user && !user.supabaseAuthId) {
    await UserRepository.update(user.id, { 
      supabaseAuthId: data.user.id 
    });
  }
}
```

**Quando acontece:**
- No primeiro login após migração
- Automático e transparente
- Não requer ação do usuário

---

### Migração Manual (Opcional)

Se quiser migrar todos os usuários de uma vez:

```javascript
// Script de migração (executar uma vez)
const { supabase } = require('./src/config/supabase');
const UserRepository = require('./src/repositories/UserRepository');

async function migrateUsers() {
  // 1. Buscar todos os usuários locais sem supabaseAuthId
  const users = await prisma.user.findMany({
    where: { supabaseAuthId: null }
  });

  console.log(`Migrando ${users.length} usuários...`);

  for (const user of users) {
    try {
      // 2. Buscar no Supabase Auth por email
      const { data, error } = await supabase.auth.admin.listUsers();
      
      const supabaseUser = data.users.find(u => u.email === user.email);
      
      if (supabaseUser) {
        // 3. Atualizar supabaseAuthId
        await UserRepository.update(user.id, {
          supabaseAuthId: supabaseUser.id
        });
        console.log(`✅ Migrado: ${user.email}`);
      } else {
        console.log(`⚠️  Não encontrado no Supabase: ${user.email}`);
      }
    } catch (error) {
      console.error(`❌ Erro ao migrar ${user.email}:`, error.message);
    }
  }

  console.log('Migração concluída!');
}

migrateUsers();
```

---

## ⚠️ Breaking Changes

### Para Desenvolvedores

**1. UserService não autentica mais:**
```javascript
// ❌ ANTES (NÃO FUNCIONA MAIS)
const user = await UserService.authenticate(email, password);

// ✅ AGORA
const result = await AuthService.login(email, password);
```

**2. CreateUserSchema não tem password:**
```javascript
// ❌ ANTES
const userData = {
  email: "test@test.com",
  name: "Test",
  password: "senha123"  // ❌ Não existe mais
};

// ✅ AGORA (para criar usuário SEM autenticação)
const userData = {
  email: "test@test.com",
  name: "Test"
  // Sem password
};

// ✅ AGORA (para criar usuário COM autenticação)
const result = await AuthService.register({
  email: "test@test.com",
  name: "Test",
  password: "senha123"  // AuthService gerencia
});
```

**3. User model não tem password:**
```javascript
// ❌ ANTES
const user = await UserRepository.findById(id);
console.log(user.password);  // Existia

// ✅ AGORA
const user = await UserRepository.findById(id);
console.log(user.supabaseAuthId);  // Novo campo
// user.password não existe mais
```

---

## ✅ Vantagens da Nova Arquitetura

### 1. **Sem Duplicação**
- ❌ Antes: Senha em 2 lugares (auth.users + usuarios)
- ✅ Agora: Senha apenas no Supabase Auth

### 2. **Única Fonte de Verdade**
- Autenticação totalmente gerenciada pelo Supabase
- Menos código para manter
- Menos bugs potenciais

### 3. **Funcionalidades Automáticas**
- ✅ Confirmação de email
- ✅ Recuperação de senha
- ✅ Refresh tokens
- ✅ Rate limiting
- ✅ Auditoria de logins

### 4. **Segurança**
- ✅ Senha nunca passa pela nossa API
- ✅ Supabase gerencia hash/salt
- ✅ JWT assinados pelo Supabase

### 5. **Flexibilidade**
- ✅ Fácil adicionar OAuth (Google, GitHub, etc)
- ✅ MFA (Multi-Factor Authentication)
- ✅ Magic Links

---

## 📚 Referências

- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [Prisma Schema](https://www.prisma.io/docs/concepts/components/prisma-schema)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)

---

## 🔧 Troubleshooting

### Erro: "Usuário não encontrado no banco de dados"

**Causa:** Usuário existe no Supabase Auth mas não no banco local

**Solução:**
```javascript
// Criar usuário local manualmente
await UserRepository.create({
  supabaseAuthId: "uuid-from-supabase",
  email: "user@email.com",
  name: "User Name",
  active: true
});
```

### Erro: "supabaseAuthId não é único"

**Causa:** Tentando criar dois usuários com mesmo supabaseAuthId

**Solução:** Verificar se já existe usuário com aquele ID:
```javascript
const existing = await UserRepository.findBySupabaseAuthId(supabaseAuthId);
if (existing) {
  // Usar o existente
}
```

### Usuários antigos não conseguem fazer login

**Causa:** Senha só existe no banco local (antes da migração)

**Solução:**
1. Usuário precisa criar conta no Supabase Auth
2. Ou fazer "esqueci minha senha" para criar senha no Supabase
3. Ou rodar script de migração manual

---

**Versão:** 1.0  
**Data:** 19/01/2026  
**Status:** ✅ Migração completa
