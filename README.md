# 🏋️ WatchMeGym API

API RESTful para gerenciamento de academia usando Node.js, Express, Prisma e Zod.

## 🚀 Tecnologias

- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **Prisma** - ORM para banco de dados
- **PostgreSQL** - Banco de dados
- **Zod** - Validação de dados
- **bcrypt** - Criptografia de senhas
- **Nodemon** - Hot reload em desenvolvimento

## 📁 Estrutura do Projeto

```
watchmegym-api/
├── prisma/
│   ├── schema.prisma           # Schema do banco de dados
│   ├── prisma.config.ts        # Configuração do Prisma
│   ├── migrations/             # Migrations do banco
│   └── Instructions.md         # Guia de uso do Prisma
├── src/
│   ├── config/
│   │   ├── database.js         # Singleton do Prisma Client
│   │   └── server.config.js    # Configurações do servidor
│   ├── controllers/            # Camada HTTP (recebe requisições)
│   │   └── UserController.js
│   ├── services/               # Lógica de negócio
│   │   └── UserService.js
│   ├── repositories/           # Acesso ao banco de dados
│   │   └── UserRepository.js
│   ├── schemas/                # Validações com Zod
│   │   └── user.schema.js
│   ├── middlewares/            # Middlewares Express
│   │   └── validate.js
│   ├── routes/                 # Definição de rotas
│   │   ├── index.js
│   │   └── user.routes.js
│   └── app.js                  # Configuração do Express
├── server.js                   # Entry point
├── package.json
├── .env                        # Variáveis de ambiente
└── .gitignore
```

## 🏗️ Arquitetura (Camadas)

```
HTTP Request
    ↓
┌─────────────────┐
│   Controller    │ ← Recebe requisições HTTP, retorna respostas
└────────┬────────┘
         ↓
┌─────────────────┐
│    Service      │ ← Lógica de negócio, validações (Zod)
└────────┬────────┘
         ↓
┌─────────────────┐
│   Repository    │ ← Acesso ao banco de dados (Prisma)
└────────┬────────┘
         ↓
    Database
```

### Responsabilidades

| Camada | Responsabilidade |
|--------|------------------|
| **Controller** | Receber requisições HTTP, formatar respostas, status codes |
| **Service** | Validação de dados (Zod), regras de negócio, criptografia |
| **Repository** | Queries no banco de dados usando Prisma |
| **Schema (Zod)** | Definir e validar estrutura dos dados |

## ⚙️ Instalação e Configuração

### 1. Instalar dependências
```bash
npm install
```

### 2. Configurar variáveis de ambiente
Crie um arquivo `.env` na raiz:
```env
# Servidor
PORT=3000
NODE_ENV=development

# Banco de dados
DATABASE_URL="postgresql://user:password@localhost:5432/watchmegym?schema=public"
DIRECT_URL="postgresql://user:password@localhost:5432/watchmegym?schema=public"
```

### 3. Configurar banco de dados
```bash
# Criar migration inicial
npx prisma migrate dev --name init

# Gerar Prisma Client
npx prisma generate
```

### 4. Rodar o servidor
```bash
# Desenvolvimento (com hot reload)
npm run dev

# Produção
npm start
```

## 📡 Endpoints da API

### Usuários

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/users` | Criar novo usuário |
| GET | `/api/users` | Listar todos os usuários |
| GET | `/api/users/:id` | Buscar usuário por ID |
| PUT | `/api/users/:id` | Atualizar usuário |
| DELETE | `/api/users/:id` | Deletar usuário (soft delete) |

### Exemplos de Requisições

#### Criar Usuário
```bash
POST /api/users
Content-Type: application/json

{
  "email": "usuario@email.com",
  "name": "João Silva",
  "password": "senha123",
  "phone": "11987654321"
}
```

#### Listar Usuários
```bash
GET /api/users
```

#### Buscar por ID
```bash
GET /api/users/123e4567-e89b-12d3-a456-426614174000
```

#### Atualizar Usuário
```bash
PUT /api/users/123e4567-e89b-12d3-a456-426614174000
Content-Type: application/json

{
  "name": "João da Silva Santos"
}
```

#### Deletar Usuário
```bash
DELETE /api/users/123e4567-e89b-12d3-a456-426614174000
```

## ✅ Validações com Zod

As validações são definidas em `src/schemas/user.schema.js`:

- **Email**: Obrigatório, formato válido
- **Nome**: 3-100 caracteres
- **Senha**: Mínimo 6 caracteres
- **Telefone**: Opcional

Exemplo de erro de validação:
```json
{
  "error": "Dados inválidos",
  "details": [
    {
      "campo": "email",
      "mensagem": "Email inválido"
    }
  ]
}
```

## 🔐 Segurança

- Senhas criptografadas com **bcrypt** (salt rounds: 10)
- Senhas nunca são retornadas nas respostas
- Validação de dados em múltiplas camadas (middleware + service)

## 🗄️ Prisma

Ver guia completo em: `prisma/Instructions.md`

Comandos principais:
```bash
# Abrir Prisma Studio (GUI)
npx prisma studio

# Criar migration
npx prisma migrate dev --name nome_migration

# Aplicar migrations em produção
npx prisma migrate deploy
```

## 📝 Scripts Disponíveis

```bash
npm start       # Iniciar servidor (produção)
npm run dev     # Iniciar com nodemon (desenvolvimento)
```

## 🐛 Debug

Para ver logs de queries do Prisma, configure em `src/config/database.js`:
```javascript
log: ['query', 'info', 'warn', 'error']
```

## 🤝 Contribuindo

1. Sempre crie migrations para mudanças no schema
2. Valide dados usando Zod
3. Mantenha a separação de camadas
4. Não exponha senhas nas respostas

## 📄 Licença

ISC
