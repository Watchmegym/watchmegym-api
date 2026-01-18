# 🏋️ WatchMeGym API

API RESTful completa para gerenciamento de academias com sistema de gravação de câmeras RTSP/HTTP, bioimpedância, exercícios e estatísticas.

## 📋 Índice

- [Visão Geral](#-visão-geral)
- [Funcionalidades](#-funcionalidades)
- [Tecnologias](#-tecnologias)
- [Arquitetura](#️-arquitetura)
- [Instalação](#-instalação)
- [Configuração](#️-configuração)
- [Endpoints da API](#-endpoints-da-api)
- [Sistema de Gravação](#-sistema-de-gravação-rtspshttp)
- [Como Estender](#-como-estender-o-projeto)
- [Deploy](#-deploy)
- [Contribuindo](#-contribuindo)

---

## 🎯 Visão Geral

O **WatchMeGym** é uma API completa para gerenciamento de academias que integra:

- 👥 **Gestão de usuários** e academias
- 📊 **Bioimpedância** e métricas corporais
- 🎥 **Gravação de câmeras** (RTSP/HTTP/MJPEG)
- 💪 **Exercícios** e estatísticas de treino
- 📁 **Storage integrado** (Supabase/AWS S3)

### Stack Principal

```
Backend: Node.js + Express
ORM: Prisma
Banco: PostgreSQL (Supabase)
Validação: Zod
Storage: Supabase Storage
Vídeo: FFmpeg + fluent-ffmpeg
```

---

## ✨ Funcionalidades

### 👤 Gestão de Usuários
- [x] CRUD completo de usuários
- [x] Autenticação com bcrypt
- [x] Soft delete
- [x] Busca e filtros

### 🏢 Gestão de Academias
- [x] CRUD de academias
- [x] Vínculo usuário-academia (many-to-many)
- [x] Gerenciamento de membros

### 📊 Bioimpedância
- [x] Registro de medições corporais
- [x] Histórico por usuário
- [x] Cálculo de IMC e TMB

### 🎥 Câmeras e Monitoramento
- [x] CRUD de câmeras
- [x] Suporte RTSP e HTTP/MJPEG
- [x] Vínculo com exercícios
- [x] Status (ativo/inativo)

### 💪 Exercícios
- [x] Cadastro de exercícios
- [x] Vínculo com câmeras
- [x] Descrições e metadados

### 📈 Estatísticas de Treino
- [x] Registro de séries e repetições
- [x] Histórico por usuário/câmera/exercício
- [x] Análise de desempenho

### 🎬 Sistema de Gravação
- [x] Gravação de streams RTSP/HTTP/MJPEG
- [x] Timer manual preciso
- [x] Storage organizado (data/usuário/câmera)
- [x] Upload automático para Supabase
- [x] Múltiplas gravações simultâneas

---

## 🚀 Tecnologias

### Core
```json
{
  "runtime": "Node.js v18+",
  "framework": "Express 4.18",
  "orm": "Prisma 5.22",
  "database": "PostgreSQL",
  "validation": "Zod 3.24"
}
```

### Dependências Principais
```json
{
  "@prisma/client": "^5.22.0",
  "@supabase/supabase-js": "^2.39.0",
  "bcrypt": "^5.1.1",
  "express": "^4.18.2",
  "fluent-ffmpeg": "^2.1.3",
  "zod": "^3.24.1"
}
```

### Dev Dependencies
```json
{
  "nodemon": "^3.0.2",
  "prisma": "^5.22.0"
}
```

---

## 🏗️ Arquitetura

### Estrutura de Pastas

```
watchmegym-api/
├── prisma/
│   ├── schema.prisma              # Schema do banco de dados
│   ├── migrations/                # Histórico de migrations
│   └── Instructions.md            # Guia Prisma
│
├── src/
│   ├── config/
│   │   ├── index.js              # Configurações gerais + Prisma singleton
│   │   └── supabase.js           # Cliente Supabase + teste automático
│   │
│   ├── controllers/              # Camada HTTP (requisições/respostas)
│   │   ├── UserController.js
│   │   ├── BioimpedanceController.js
│   │   ├── AcademyController.js
│   │   ├── AcademyUserController.js
│   │   ├── CameraController.js
│   │   ├── ExerciseController.js
│   │   ├── StatisticsCameraUserController.js
│   │   ├── RecordController.js
│   │   └── RecordingController.js
│   │
│   ├── services/                 # Lógica de negócio
│   │   ├── UserService.js
│   │   ├── BioimpedanceService.js
│   │   ├── AcademyService.js
│   │   ├── AcademyUserService.js
│   │   ├── CameraService.js
│   │   ├── ExerciseService.js
│   │   ├── StatisticsCameraUserService.js
│   │   ├── RecordService.js
│   │   └── RecordingService.js   # Sistema de gravação RTSP/HTTP
│   │
│   ├── repositories/             # Acesso ao banco (Prisma)
│   │   ├── UserRepository.js
│   │   ├── BioimpedanceRepository.js
│   │   ├── AcademyRepository.js
│   │   ├── AcademyUserRepository.js
│   │   ├── CameraRepository.js
│   │   ├── ExerciseRepository.js
│   │   ├── StatisticsCameraUserRepository.js
│   │   └── RecordRepository.js
│   │
│   ├── schemas/                  # Validações Zod
│   │   ├── user.schema.js
│   │   ├── bioimpedance.schema.js
│   │   ├── academy.schema.js
│   │   ├── academyUser.schema.js
│   │   ├── camera.schema.js
│   │   ├── exercise.schema.js
│   │   ├── statisticsCameraUser.schema.js
│   │   ├── record.schema.js
│   │   └── recording.schema.js
│   │
│   ├── middlewares/
│   │   └── validate.js           # Middleware de validação
│   │
│   ├── routes/
│   │   ├── index.js              # Centralizador de rotas
│   │   ├── user.routes.js
│   │   ├── bioimpedance.routes.js
│   │   ├── academy.routes.js
│   │   ├── academyUser.routes.js
│   │   ├── camera.routes.js
│   │   ├── exercise.routes.js
│   │   ├── statisticsCameraUser.routes.js
│   │   ├── record.routes.js
│   │   └── recording.routes.js
│   │
│   └── app.js                    # Configuração do Express
│
├── tests/                        # Testes HTTP (REST Client)
│   ├── users.http
│   ├── bioimpedances.http
│   ├── academies.http
│   ├── academy-users.http
│   ├── cameras.http
│   ├── exercises.http
│   ├── statistics.http
│   ├── records.http
│   └── recordings.http
│
├── scripts/
│   └── check-supabase-config.js  # Verificar configuração Supabase
│
├── docs/
│   └── (documentação adicional)
│
├── temp/
│   └── recordings/               # Gravações temporárias
│
├── public/
│   └── recordings/               # Gravações locais (dev)
│
├── server.js                     # Entry point
├── package.json
├── .env                          # Variáveis de ambiente (não commitado)
├── .gitignore
└── README.md
```

### Fluxo de Requisição (Camadas)

```
┌─────────────────────────────────────────────────────────┐
│                    HTTP Request                         │
└────────────────────────┬────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│  ROUTE (user.routes.js)                                 │
│  • Define endpoint (POST /api/users)                    │
│  • Aplica middleware de validação                       │
└────────────────────────┬────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│  CONTROLLER (UserController.js)                         │
│  • Recebe req/res                                       │
│  • Chama service                                        │
│  • Retorna status code e resposta JSON                  │
└────────────────────────┬────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│  SERVICE (UserService.js)                               │
│  • Valida dados com Zod                                 │
│  • Aplica regras de negócio                             │
│  • Criptografa senha (bcrypt)                           │
│  • Chama repository                                     │
└────────────────────────┬────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│  REPOSITORY (UserRepository.js)                         │
│  • Executa queries Prisma                               │
│  • Acessa banco de dados                                │
└────────────────────────┬────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│                PostgreSQL Database                       │
└─────────────────────────────────────────────────────────┘
```

### Responsabilidades por Camada

| Camada | Responsabilidade | Exemplo |
|--------|-----------------|---------|
| **Route** | Definir endpoints, aplicar middlewares | `router.post('/users', validate(CreateUserSchema), ...)` |
| **Controller** | Receber req/res, status codes | `res.status(201).json(user)` |
| **Service** | Lógica de negócio, validação Zod | `bcrypt.hash(password, 10)` |
| **Repository** | Queries Prisma, acesso ao banco | `prisma.user.create({ data })` |
| **Schema** | Validação de estrutura de dados | `z.string().email()` |

---

## 📦 Instalação

### Pré-requisitos

```bash
Node.js >= 18.0.0
PostgreSQL >= 14
FFmpeg (para gravação de vídeos)
```

### Instalar FFmpeg

#### Windows:
```powershell
choco install ffmpeg
```

#### Linux (Ubuntu/Debian):
```bash
sudo apt-get update
sudo apt-get install ffmpeg
```

#### macOS:
```bash
brew install ffmpeg
```

Verificar instalação:
```bash
ffmpeg -version
```

### Clonar e Instalar

```bash
# Clonar repositório
git clone <seu-repositorio>
cd watchmegym-api

# Instalar dependências
npm install
```

---

## ⚙️ Configuração

### 1. Variáveis de Ambiente

Crie um arquivo `.env` na raiz:

```env
# ==========================================
# SERVIDOR
# ==========================================
PORT=3000
NODE_ENV=development
BASE_URL=http://localhost:3000

# ==========================================
# BANCO DE DADOS (PostgreSQL)
# ==========================================
DATABASE_URL="postgresql://user:password@localhost:5432/watchmegym?schema=public"
DIRECT_URL="postgresql://user:password@localhost:5432/watchmegym?schema=public"

# Ou usar Supabase:
# DATABASE_URL="postgresql://postgres.xxxxx:[password]@aws-0-us-east-1.pooler.supabase.com:6543/postgres"
# DIRECT_URL="postgresql://postgres.xxxxx:[password]@aws-0-us-east-1.pooler.supabase.com:5432/postgres"

# ==========================================
# SUPABASE STORAGE (RECOMENDADO)
# ==========================================
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key_aqui
SUPABASE_STORAGE_BUCKET=recordings

# ==========================================
# AWS S3 (ALTERNATIVA - Opcional)
# ==========================================
# AWS_REGION=us-east-1
# AWS_ACCESS_KEY_ID=your_access_key
# AWS_SECRET_ACCESS_KEY=your_secret_key
# AWS_BUCKET_NAME=watchmegym-recordings
```

### 2. Configurar Banco de Dados

```bash
# Executar migrations
npx prisma migrate dev

# Gerar Prisma Client
npx prisma generate

# Abrir Prisma Studio (GUI)
npx prisma studio
```

### 3. Configurar Supabase Storage (Opcional mas Recomendado)

Ver guia completo em: `docs/SUPABASE_QUICK_SETUP.md`

**Resumo:**
1. Criar bucket `recordings` no Supabase
2. Marcar como público
3. Configurar políticas RLS
4. Copiar Service Role Key
5. Adicionar no `.env`

### 4. Iniciar Servidor

```bash
# Desenvolvimento (com hot-reload)
npm run dev

# Produção
npm start
```

Servidor rodando em: `http://localhost:3000`

---

## 📡 Endpoints da API

### Health Check

```http
GET /api/health
```

Retorna status da API.

---

### 👤 Usuários (`/api/users`)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/users` | Criar usuário |
| GET | `/api/users` | Listar todos |
| GET | `/api/users/:id` | Buscar por ID |
| PUT | `/api/users/:id` | Atualizar |
| DELETE | `/api/users/:id` | Deletar (soft delete) |
| GET | `/api/users/email/:email` | Buscar por email |
| GET | `/api/users/search?name=` | Buscar por nome |
| PATCH | `/api/users/:id/toggle-status` | Ativar/desativar |
| GET | `/api/users/count` | Contar usuários |

**Exemplo - Criar Usuário:**
```json
POST /api/users
{
  "email": "joao@email.com",
  "name": "João Silva",
  "password": "senha123"
}
```

---

### 📊 Bioimpedância (`/api/bioimpedances`)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/bioimpedances` | Criar registro |
| GET | `/api/bioimpedances` | Listar todos |
| GET | `/api/bioimpedances/:id` | Buscar por ID |
| PUT | `/api/bioimpedances/:id` | Atualizar |
| DELETE | `/api/bioimpedances/:id` | Deletar |
| GET | `/api/bioimpedances/user/:userId` | Listar por usuário |

**Exemplo - Criar Bioimpedância:**
```json
POST /api/bioimpedances
{
  "userId": "uuid-do-usuario",
  "weight": 75.5,
  "height": 1.75,
  "bmi": 24.7,
  "bmr": 1650.5
}
```

---

### 🏢 Academias (`/api/academies`)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/academies` | Criar academia |
| GET | `/api/academies` | Listar todas |
| GET | `/api/academies/:id` | Buscar por ID |
| PUT | `/api/academies/:id` | Atualizar |
| DELETE | `/api/academies/:id` | Deletar |

**Exemplo - Criar Academia:**
```json
POST /api/academies
{
  "name": "Academia FitLife",
  "address": "Rua das Flores, 123",
  "phone": "11987654321",
  "email": "contato@fitlife.com"
}
```

---

### 🔗 Vínculo Academia-Usuário (`/api/academy-users`)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/academy-users` | Vincular usuário |
| GET | `/api/academy-users` | Listar todos |
| GET | `/api/academy-users/:id` | Buscar por ID |
| DELETE | `/api/academy-users/:id` | Remover vínculo |
| GET | `/api/academy-users/academy/:academyId` | Usuários de uma academia |
| GET | `/api/academy-users/user/:userId` | Academias de um usuário |

---

### 🎥 Câmeras (`/api/cameras`)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/cameras` | Criar câmera |
| GET | `/api/cameras` | Listar todas |
| GET | `/api/cameras/:id` | Buscar por ID |
| PUT | `/api/cameras/:id` | Atualizar |
| DELETE | `/api/cameras/:id` | Deletar |
| GET | `/api/cameras/academy/:academyId` | Câmeras de uma academia |
| PATCH | `/api/cameras/:id/toggle-status` | Habilitar/desabilitar |

**Exemplo - Criar Câmera:**
```json
POST /api/cameras
{
  "academyId": "uuid-da-academia",
  "exerciseId": "uuid-do-exercicio",  // opcional
  "name": "Câmera Área de Musculação",
  "description": "Câmera principal",
  "url": "http://192.168.1.100",
  "streamUrl": "rtsp://admin:senha@192.168.1.100:554/stream1",
  "enabled": true
}
```

**Tipos de Stream Suportados:**
- `rtsp://` - RTSP streams
- `http://` - HTTP/MJPEG streams
- `https://` - HTTPS streams

---

### 💪 Exercícios (`/api/exercises`)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/exercises` | Criar exercício |
| GET | `/api/exercises` | Listar todos |
| GET | `/api/exercises/:id` | Buscar por ID |
| PUT | `/api/exercises/:id` | Atualizar |
| DELETE | `/api/exercises/:id` | Deletar |

**Exemplo - Criar Exercício:**
```json
POST /api/exercises
{
  "name": "Supino Reto",
  "description": "Exercício para peitoral"
}
```

---

### 📈 Estatísticas (`/api/statistics`)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/statistics` | Criar registro |
| GET | `/api/statistics` | Listar todos |
| GET | `/api/statistics/:id` | Buscar por ID |
| PUT | `/api/statistics/:id` | Atualizar |
| DELETE | `/api/statistics/:id` | Deletar |
| GET | `/api/statistics/user/:userId` | Estatísticas de um usuário |
| GET | `/api/statistics/camera/:cameraId` | Estatísticas de uma câmera |

**Exemplo - Criar Estatística:**
```json
POST /api/statistics
{
  "cameraId": "uuid-da-camera",
  "userId": "uuid-do-usuario",
  "quantityRepetitions": 12,
  "quantitySets": 3
}
```

---

### 📹 Gravações (`/api/records`)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/records` | Criar registro manual |
| GET | `/api/records` | Listar todas |
| GET | `/api/records/:id` | Buscar por ID |
| DELETE | `/api/records/:id` | Deletar |
| GET | `/api/records/user/:userId` | Gravações de um usuário |
| GET | `/api/records/camera/:cameraId` | Gravações de uma câmera |

---

### 🎬 Sistema de Gravação RTSP/HTTP (`/api/recordings`)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/recordings/start` | Iniciar gravação |
| POST | `/api/recordings/start-multiple` | Múltiplas gravações |
| GET | `/api/recordings/status/:recordId` | Status da gravação |

**Exemplo - Iniciar Gravação:**
```json
POST /api/recordings/start
{
  "cameraId": "uuid-da-camera",
  "userId": "uuid-do-usuario",
  "duration": 10  // segundos (1-300)
}
```

**Resposta:**
```json
{
  "message": "Gravação iniciada com sucesso",
  "record": {
    "id": "uuid",
    "cameraId": "uuid-da-camera",
    "userId": "uuid-do-usuario",
    "url": "https://supabase.co/storage/.../2026-01-13/joao-silva/camera-principal/video.mp4",
    "createdAt": "2026-01-13T10:00:00.000Z"
  }
}
```

---

## 🎬 Sistema de Gravação RTSP/HTTP

### Características

- ✅ **Streams suportados**: RTSP, HTTP, MJPEG, HLS
- ✅ **Timer manual preciso**: Grava exatamente a duração solicitada
- ✅ **Storage organizado**: `data/usuario/camera/video.mp4`
- ✅ **Upload automático**: Supabase Storage ou AWS S3
- ✅ **Codec H.264**: Compatível com todos os players
- ✅ **Framerate fixo**: 25 fps (configura vel)
- ✅ **Qualidade otimizada**: CRF 28 (balanceamento tamanho/qualidade)

### Como Funciona

1. **Cliente faz requisição** com `cameraId`, `userId`, `duration`
2. **Sistema busca** informações da câmera (streamUrl)
3. **FFmpeg inicia** captura do stream
4. **Timer manual** controla duração exata
5. **Gravação salva** em arquivo temporário
6. **Upload automático** para Supabase Storage
7. **Record criado** no banco com URL pública
8. **Arquivo temporário** é removido

### Organização no Storage

```
recordings/
  └── 2026-01-13/
      └── joao-silva/
          └── camera-musculacao/
              ├── camera-xxx-1768290674134.mp4
              └── camera-xxx-1768290800250.mp4
```

### Configuração

**1. FFmpeg** (obrigatório):
```bash
# Windows
choco install ffmpeg

# Linux
sudo apt-get install ffmpeg

# Mac
brew install ffmpeg
```

**2. Storage** (escolha uma):

#### Supabase Storage (Recomendado):
```env
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_SERVICE_ROLE_KEY=sua_key
SUPABASE_STORAGE_BUCKET=recordings
```

#### AWS S3:
```env
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=sua_key
AWS_SECRET_ACCESS_KEY=sua_secret
AWS_BUCKET_NAME=watchmegym-recordings
```

### Exemplos de URLs de Stream

```javascript
// RTSP (Hikvision)
"rtsp://admin:senha@192.168.1.100:554/Streaming/Channels/101"

// RTSP (Dahua/Intelbras)
"rtsp://admin:senha@192.168.1.100:554/cam/realmonitor?channel=1&subtype=0"

// HTTP/MJPEG
"http://192.168.1.100/nphMotionJpeg?Resolution=640x480&Quality=Standard"

// HTTP
"http://192.168.1.100:8080/video"
```

### Limitações

- Duração: 1-300 segundos (5 minutos máximo)
- Perda de ~2 segundos no início (buffering)
- Framerate fixo: 25 fps

---

## 🛠️ Como Estender o Projeto

### Adicionar Novo Modelo (Exemplo: `Membership`)

#### 1. Criar Schema no Prisma

```prisma
// prisma/schema.prisma
model Membership {
  id        String   @id @default(uuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  type      String   // "mensal", "trimestral", "anual"
  startDate DateTime
  endDate   DateTime
  active    Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("memberships")
}

// Adicionar relação no User
model User {
  // ... campos existentes
  memberships Membership[]
}
```

#### 2. Criar Migration

```bash
npx prisma migrate dev --name create_memberships_table
npx prisma generate
```

#### 3. Criar Schema de Validação

```javascript
// src/schemas/membership.schema.js
const { z } = require('zod');

const CreateMembershipSchema = z.object({
  userId: z.string().uuid(),
  type: z.enum(['mensal', 'trimestral', 'anual']),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
});

const UpdateMembershipSchema = CreateMembershipSchema.partial();

module.exports = {
  CreateMembershipSchema,
  UpdateMembershipSchema,
};
```

#### 4. Criar Repository

```javascript
// src/repositories/MembershipRepository.js
const { prisma } = require('../config');

class MembershipRepository {
  async create(data) {
    return await prisma.membership.create({ data });
  }

  async findAll() {
    return await prisma.membership.findMany({
      include: { user: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id) {
    return await prisma.membership.findUnique({
      where: { id },
      include: { user: true },
    });
  }

  async update(id, data) {
    return await prisma.membership.update({
      where: { id },
      data,
    });
  }

  async delete(id) {
    return await prisma.membership.delete({ where: { id } });
  }

  async findByUser(userId) {
    return await prisma.membership.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }
}

module.exports = new MembershipRepository();
```

#### 5. Criar Service

```javascript
// src/services/MembershipService.js
const MembershipRepository = require('../repositories/MembershipRepository');
const { CreateMembershipSchema, UpdateMembershipSchema } = require('../schemas/membership.schema');

class MembershipService {
  async create(data) {
    const validatedData = CreateMembershipSchema.parse(data);
    return await MembershipRepository.create(validatedData);
  }

  async getAll() {
    return await MembershipRepository.findAll();
  }

  async getById(id) {
    const membership = await MembershipRepository.findById(id);
    if (!membership) throw new Error('Membership não encontrado');
    return membership;
  }

  async update(id, data) {
    const validatedData = UpdateMembershipSchema.parse(data);
    await this.getById(id); // Verifica se existe
    return await MembershipRepository.update(id, validatedData);
  }

  async delete(id) {
    await this.getById(id);
    return await MembershipRepository.delete(id);
  }

  async getByUser(userId) {
    return await MembershipRepository.findByUser(userId);
  }
}

module.exports = new MembershipService();
```

#### 6. Criar Controller

```javascript
// src/controllers/MembershipController.js
const MembershipService = require('../services/MembershipService');

class MembershipController {
  async create(req, res) {
    try {
      const membership = await MembershipService.create(req.body);
      res.status(201).json(membership);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getAll(req, res) {
    try {
      const memberships = await MembershipService.getAll();
      res.json(memberships);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getById(req, res) {
    try {
      const membership = await MembershipService.getById(req.params.id);
      res.json(membership);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  async update(req, res) {
    try {
      const membership = await MembershipService.update(req.params.id, req.body);
      res.json(membership);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async delete(req, res) {
    try {
      await MembershipService.delete(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  async getByUser(req, res) {
    try {
      const memberships = await MembershipService.getByUser(req.params.userId);
      res.json(memberships);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new MembershipController();
```

#### 7. Criar Routes

```javascript
// src/routes/membership.routes.js
const express = require('express');
const router = express.Router();
const MembershipController = require('../controllers/MembershipController');

router.post('/', MembershipController.create.bind(MembershipController));
router.get('/', MembershipController.getAll.bind(MembershipController));
router.get('/:id', MembershipController.getById.bind(MembershipController));
router.put('/:id', MembershipController.update.bind(MembershipController));
router.delete('/:id', MembershipController.delete.bind(MembershipController));
router.get('/user/:userId', MembershipController.getByUser.bind(MembershipController));

module.exports = router;
```

#### 8. Registrar Routes

```javascript
// src/routes/index.js
const membershipRoutes = require('./membership.routes');

// ...

router.use('/api/memberships', membershipRoutes);
```

#### 9. Criar Testes

```http
# tests/memberships.http

### Criar Membership
POST http://localhost:3000/api/memberships
Content-Type: application/json

{
  "userId": "uuid-do-usuario",
  "type": "mensal",
  "startDate": "2026-01-13T00:00:00.000Z",
  "endDate": "2026-02-13T00:00:00.000Z"
}

### Listar Memberships
GET http://localhost:3000/api/memberships
```

---

## 🚀 Deploy

### Deploy no Render

Ver guia completo em: `DEPLOY.md`

**Resumo rápido:**

1. **Criar PostgreSQL** no Render
2. **Criar Web Service** no Render
3. **Configurar variáveis** de ambiente
4. **Build command**: `npm install && npx prisma generate && npx prisma migrate deploy`
5. **Start command**: `npm start`

**Importante para Gravações:**
- Configure Supabase Storage (sistema de arquivos do Render é efêmero)
- FFmpeg já vem instalado no Render ✅

---

## 🤝 Contribuindo

### Padrões do Projeto

1. **Sempre use as 4 camadas**: Route → Controller → Service → Repository
2. **Valide com Zod**: Toda entrada de dados deve ser validada
3. **Migrations**: Qualquer mudança no schema precisa de migration
4. **Soft Delete**: Prefira desativar em vez de deletar
5. **Testes HTTP**: Crie testes em `tests/` para cada endpoint
6. **Documentação**: Atualize o README ao adicionar funcionalidades

### Convenções de Código

```javascript
// Naming
- Classes: PascalCase (UserController)
- Variáveis/funções: camelCase (findById)
- Arquivos: camelCase.tipo.js (user.schema.js)
- Constantes: UPPER_SNAKE_CASE (DATABASE_URL)

// Estrutura de arquivos
- Um modelo = 4 arquivos (schema, repository, service, controller)
- Um módulo = 1 pasta de rotas + testes

// Commits
- feat: Nova funcionalidade
- fix: Correção de bug
- docs: Documentação
- refactor: Refatoração
- test: Testes
```

### Fluxo de Desenvolvimento

```bash
# 1. Criar branch
git checkout -b feat/nova-funcionalidade

# 2. Desenvolver
# - Criar schema Prisma
# - Criar migration
# - Criar schema Zod
# - Criar repository
# - Criar service
# - Criar controller
# - Criar routes
# - Criar testes

# 3. Testar
npm run dev
# Testar com REST Client

# 4. Commit
git add .
git commit -m "feat: adiciona funcionalidade X"

# 5. Push
git push origin feat/nova-funcionalidade

# 6. Pull Request
```

---

## 📚 Recursos Adicionais

### Documentação

- [Prisma Docs](https://www.prisma.io/docs)
- [Zod Docs](https://zod.dev)
- [Express Docs](https://expressjs.com)
- [Supabase Docs](https://supabase.com/docs)
- [FFmpeg Docs](https://ffmpeg.org/documentation.html)

### Ferramentas Recomendadas

- **VS Code Extensions**:
  - Prisma
  - REST Client
  - ESLint
  - Prettier
- **Postman/Insomnia**: Testar APIs
- **Prisma Studio**: Visualizar banco de dados
- **VLC**: Testar streams RTSP

---

## 🔐 Segurança

- ✅ Senhas criptografadas com bcrypt (10 rounds)
- ✅ Validação em múltiplas camadas
- ✅ Senhas nunca retornadas em respostas
- ✅ Service Role Key nunca exposta no frontend
- ✅ Soft delete por padrão
- ⚠️ TODO: Implementar autenticação JWT
- ⚠️ TODO: Implementar rate limiting
- ⚠️ TODO: Implementar CORS configurável

---

## 📄 Licença

ISC

---

## 👥 Autores

Desenvolvido como sistema completo de gestão de academias com monitoramento por câmeras.

---

## 🆘 Suporte

Encontrou um bug? Tem uma sugestão?

1. Verifique os arquivos em `docs/`
2. Consulte os testes em `tests/`
3. Abra uma issue no repositório

---

**Feito com ❤️ e muito código** 🚀
