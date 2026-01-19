# 📡 WatchMeGym API - Endpoints

**Base URL:** `http://localhost:3000/api`

---

## 🔐 Autenticação

### Registrar
```
POST /auth/register
```
**Body:**
```json
{
  "email": "joao@email.com",
  "password": "senha123",
  "name": "João Silva",
  "phone": "+5511999999999",
  "cpfCnpj": "123.456.789-00"
}
```
**Response 201:**
```json
{
  "user": { "id": "uuid", "email": "...", "name": "...", "active": true },
  "session": { "accessToken": "...", "refreshToken": "...", "expiresIn": 3600 }
}
```

---

### Login
```
POST /auth/login
```
**Body:**
```json
{
  "email": "joao@email.com",
  "password": "senha123"
}
```
**Response 200:**
```json
{
  "user": { "id": "uuid", "email": "...", "name": "..." },
  "session": { "accessToken": "...", "refreshToken": "..." }
}
```

---

### Perfil
```
GET /auth/me
Header: Authorization: Bearer {accessToken}
```
**Response 200:**
```json
{
  "user": { "id": "uuid", "email": "...", "name": "..." }
}
```

---

### Refresh Token
```
POST /auth/refresh
```
**Body:**
```json
{
  "refreshToken": "..."
}
```
**Response 200:**
```json
{
  "accessToken": "...",
  "refreshToken": "...",
  "expiresIn": 3600
}
```

---

### Logout
```
POST /auth/logout
Header: Authorization: Bearer {accessToken}
```
**Response 200:**
```json
{
  "message": "Logout realizado com sucesso"
}
```

---

### Recuperar Senha
```
POST /auth/forgot-password
```
**Body:**
```json
{
  "email": "joao@email.com"
}
```
**Response 200:**
```json
{
  "message": "Email de recuperação enviado com sucesso!"
}
```

---

### Resetar Senha
```
POST /auth/reset-password
```
**Body:**
```json
{
  "token": "...",
  "password": "novaSenha123"
}
```
**Response 200:**
```json
{
  "message": "Senha atualizada com sucesso!"
}
```

---

## 👤 Usuários

### Listar Todos
```
GET /users
```
**Response 200:**
```json
[
  { "id": "uuid", "email": "...", "name": "...", "active": true }
]
```

---

### Buscar por ID
```
GET /users/:id
```
**Response 200:**
```json
{
  "id": "uuid",
  "email": "joao@email.com",
  "name": "João Silva",
  "phone": "+5511999999999",
  "active": true
}
```

---

### Criar
```
POST /users
```
**Body:**
```json
{
  "email": "joao@email.com",
  "name": "João Silva",
  "phone": "+5511999999999",
  "cpfCnpj": "123.456.789-00"
}
```
**Response 201:**
```json
{
  "id": "uuid",
  "email": "joao@email.com",
  "name": "João Silva"
}
```

---

### Atualizar
```
PUT /users/:id
```
**Body:**
```json
{
  "name": "João Silva Atualizado",
  "phone": "+5511888888888"
}
```
**Response 200:**
```json
{
  "id": "uuid",
  "email": "joao@email.com",
  "name": "João Silva Atualizado"
}
```

---

### Deletar (Soft Delete)
```
DELETE /users/:id
```
**Response 200:**
```json
{
  "message": "Usuário deletado com sucesso"
}
```

---

## 📊 Bioimpedância

### Listar Todos
```
GET /bioimpedances
```
**Response 200:**
```json
[
  { "id": "uuid", "userId": "uuid", "weight": 75.5, "height": 1.75, "bmi": 24.7 }
]
```

---

### Criar
```
POST /bioimpedances
```
**Body:**
```json
{
  "userId": "uuid",
  "weight": 75.5,
  "height": 1.75,
  "bmi": 24.7,
  "bmr": 1650.5
}
```
**Response 201:**
```json
{
  "id": "uuid",
  "userId": "uuid",
  "weight": 75.5,
  "height": 1.75,
  "bmi": 24.7,
  "bmr": 1650.5
}
```

---

### Buscar por Usuário
```
GET /bioimpedances/user/:userId
```
**Response 200:**
```json
[
  { "id": "uuid", "weight": 75.5, "height": 1.75, "createdAt": "..." }
]
```

---

## 🏢 Academias

### Listar Todas
```
GET /academies
```
**Response 200:**
```json
[
  { "id": "uuid", "name": "Academia FitLife", "address": "...", "email": "..." }
]
```

---

### Criar
```
POST /academies
```
**Body:**
```json
{
  "name": "Academia FitLife",
  "address": "Rua das Flores, 123",
  "phone": "11987654321",
  "email": "contato@fitlife.com"
}
```
**Response 201:**
```json
{
  "id": "uuid",
  "name": "Academia FitLife",
  "address": "Rua das Flores, 123"
}
```

---

## 🎥 Câmeras

### Listar Todas
```
GET /cameras
```
**Response 200:**
```json
[
  { "id": "uuid", "name": "Câmera Supino", "streamUrl": "rtsp://...", "enabled": true }
]
```

---

### Criar
```
POST /cameras
```
**Body:**
```json
{
  "academyId": "uuid",
  "exerciseId": "uuid",
  "name": "Câmera Supino",
  "description": "Câmera área de musculação",
  "url": "http://192.168.1.100",
  "streamUrl": "rtsp://admin:senha@192.168.1.100:554/stream1",
  "enabled": true
}
```
**Response 201:**
```json
{
  "id": "uuid",
  "name": "Câmera Supino",
  "streamUrl": "rtsp://..."
}
```

---

## 💪 Exercícios

### Listar Todos
```
GET /exercises
```
**Response 200:**
```json
[
  { "id": "uuid", "name": "Supino Reto", "description": "Exercício para peitoral" }
]
```

---

### Criar
```
POST /exercises
```
**Body:**
```json
{
  "name": "Supino Reto",
  "description": "Exercício para peitoral"
}
```
**Response 201:**
```json
{
  "id": "uuid",
  "name": "Supino Reto",
  "description": "Exercício para peitoral"
}
```

---

## 📈 Estatísticas

### Listar Todas
```
GET /statistics
```
**Response 200:**
```json
[
  { "id": "uuid", "cameraId": "uuid", "userId": "uuid", "quantityRepetitions": 12, "quantitySets": 3 }
]
```

---

### Criar
```
POST /statistics
```
**Body:**
```json
{
  "cameraId": "uuid",
  "userId": "uuid",
  "quantityRepetitions": 12,
  "quantitySets": 3
}
```
**Response 201:**
```json
{
  "id": "uuid",
  "quantityRepetitions": 12,
  "quantitySets": 3
}
```

---

## 🎬 Gravações (RTSP/HTTP)

### Iniciar Gravação
```
POST /recordings/start
```
**Body:**
```json
{
  "cameraId": "uuid",
  "userId": "uuid",
  "duration": 10
}
```
**Response 201:**
```json
{
  "message": "Gravação iniciada com sucesso",
  "record": {
    "id": "uuid",
    "cameraId": "uuid",
    "userId": "uuid",
    "url": "https://supabase.co/storage/.../video.mp4",
    "createdAt": "2026-01-19T10:00:00.000Z"
  }
}
```

---

### Status da Gravação
```
GET /recordings/status/:recordId
```
**Response 200:**
```json
{
  "id": "uuid",
  "status": "completed",
  "url": "https://supabase.co/storage/.../video.mp4"
}
```

---

## 📹 Records (Registro de Gravações)

### Listar Todos
```
GET /records
```
**Response 200:**
```json
[
  { "id": "uuid", "cameraId": "uuid", "userId": "uuid", "url": "https://..." }
]
```

---

### Buscar por Usuário
```
GET /records/user/:userId
```
**Response 200:**
```json
[
  { "id": "uuid", "url": "https://...", "createdAt": "..." }
]
```

---

### Buscar por Câmera
```
GET /records/camera/:cameraId
```
**Response 200:**
```json
[
  { "id": "uuid", "url": "https://...", "createdAt": "..." }
]
```

---

## 💳 Planos

### Listar Todos
```
GET /plans
```
**Response 200:**
```json
[
  { "id": "uuid", "name": "Mensal", "price": 99.90, "billingType": "CREDIT_CARD", "active": true }
]
```

---

### Criar
```
POST /plans
```
**Body:**
```json
{
  "name": "Plano Mensal",
  "description": "Acesso completo",
  "price": 99.90,
  "billingType": "CREDIT_CARD",
  "cycle": "MONTHLY",
  "features": { "gravacoes_ilimitadas": true },
  "active": true
}
```
**Response 201:**
```json
{
  "id": "uuid",
  "name": "Plano Mensal",
  "price": 99.90
}
```

---

## 📝 Assinaturas

### Listar Todas
```
GET /subscriptions
```
**Response 200:**
```json
[
  { "id": "uuid", "userId": "uuid", "planId": "uuid", "status": "ACTIVE", "nextDueDate": "..." }
]
```

---

### Criar
```
POST /subscriptions
```
**Body:**
```json
{
  "userId": "uuid",
  "planId": "uuid",
  "paymentMethod": "CREDIT_CARD",
  "nextDueDate": "2026-02-19"
}
```
**Response 201:**
```json
{
  "id": "uuid",
  "userId": "uuid",
  "planId": "uuid",
  "status": "ACTIVE"
}
```

---

### Buscar por Usuário
```
GET /subscriptions/user/:userId
```
**Response 200:**
```json
[
  { "id": "uuid", "planId": "uuid", "status": "ACTIVE", "nextDueDate": "..." }
]
```

---

## 💰 Pagamentos

### Listar Todos
```
GET /payments
```
**Response 200:**
```json
[
  { "id": "uuid", "subscriptionId": "uuid", "amount": 99.90, "status": "RECEIVED", "dueDate": "..." }
]
```

---

### Criar
```
POST /payments
```
**Body:**
```json
{
  "subscriptionId": "uuid",
  "userId": "uuid",
  "amount": 99.90,
  "billingType": "CREDIT_CARD",
  "dueDate": "2026-02-19"
}
```
**Response 201:**
```json
{
  "id": "uuid",
  "amount": 99.90,
  "status": "PENDING",
  "dueDate": "2026-02-19"
}
```

---

### Buscar por Assinatura
```
GET /payments/subscription/:subscriptionId
```
**Response 200:**
```json
[
  { "id": "uuid", "amount": 99.90, "status": "RECEIVED", "paymentDate": "..." }
]
```

---

## 🔗 Vínculos Academia-Usuário

### Criar Vínculo
```
POST /academy-users
```
**Body:**
```json
{
  "userId": "uuid",
  "academyId": "uuid"
}
```
**Response 201:**
```json
{
  "id": "uuid",
  "userId": "uuid",
  "academyId": "uuid"
}
```

---

### Usuários de uma Academia
```
GET /academy-users/academy/:academyId
```
**Response 200:**
```json
[
  { "id": "uuid", "userId": "uuid", "user": { "name": "...", "email": "..." } }
]
```

---

### Academias de um Usuário
```
GET /academy-users/user/:userId
```
**Response 200:**
```json
{
  "message": "Academias do usuário",
  "academies": [
    { "id": "uuid", "name": "...", "address": "..." }
  ],
  "links": [
    { "id": "uuid", "academyId": "uuid", "userId": "uuid", "academy": {...}, "user": {...} }
  ]
}
```

---

### Academias Ativas de um Usuário
```
GET /academy-users/active/:userId
```
**Response 200:**
```json
{
  "message": "Academias ativas do usuário",
  "academies": [
    { "id": "uuid", "name": "...", "address": "..." }
  ],
  "links": [
    { "id": "uuid", "academyId": "uuid", "userId": "uuid", "academy": {...}, "user": {...} }
  ]
}
```
**Nota:** Retorna apenas vínculos onde o usuário está ativo (`user.active = true`)

---

## ⚠️ Erros Padrão

### 400 - Bad Request
```json
{
  "error": "Dados inválidos",
  "details": [
    { "campo": "email", "mensagem": "Email inválido" }
  ]
}
```

### 401 - Unauthorized
```json
{
  "error": "Token inválido ou expirado"
}
```

### 404 - Not Found
```json
{
  "error": "Recurso não encontrado"
}
```

### 500 - Internal Server Error
```json
{
  "error": "Erro interno do servidor",
  "details": "Mensagem de erro"
}
```

---

## 📝 Notas

- **Headers obrigatórios:** `Content-Type: application/json`
- **Autenticação:** `Authorization: Bearer {accessToken}`
- **Paginação:** Não implementada (retorna todos)
- **Ordenação:** `createdAt DESC` (mais recente primeiro)
