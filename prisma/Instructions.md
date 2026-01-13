# 📘 Instruções de Uso do Prisma

## 🔧 Configuração Inicial

### 1. Configurar variáveis de ambiente
Crie um arquivo `.env` na raiz do projeto:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/watchmegym?schema=public"
DIRECT_URL="postgresql://user:password@localhost:5432/watchmegym?schema=public"
```

### 2. Instalar dependências
```bash
npm install
```

## 🚀 Comandos Principais

### Gerar Prisma Client
Sempre que modificar o `schema.prisma`, execute:
```bash
npx prisma generate
```

### Criar Migration
Cria uma nova migration baseada nas mudanças no schema:
```bash
npx prisma migrate dev --name nome_da_migration
```

Exemplos:
```bash
npx prisma migrate dev --name create_users_table
npx prisma migrate dev --name add_phone_to_users
npx prisma migrate dev --name create_workouts_table
```

### Aplicar Migrations em Produção
```bash
npx prisma migrate deploy
```

### Resetar Banco de Dados (CUIDADO!)
Remove todos os dados e reaplica todas as migrations:
```bash
npx prisma migrate reset
```

### Ver Status das Migrations
```bash
npx prisma migrate status
```

## 🔍 Visualizar e Explorar Dados

### Abrir Prisma Studio
Interface gráfica para visualizar e editar dados:
```bash
npx prisma studio
```
Abre em: `http://localhost:5555`

### Ver Schema do Banco
```bash
npx prisma db pull
```
Atualiza o schema.prisma baseado no banco existente.

## 📊 Comandos de Debug

### Validar Schema
```bash
npx prisma validate
```

### Formatar Schema
```bash
npx prisma format
```

### Ver logs detalhados
Adicione no código:
```javascript
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});
```

## 🎯 Fluxo de Trabalho Típico

### 1. Modificar o Schema
Edite `prisma/schema.prisma`:
```prisma
model User {
  id    String @id @default(uuid())
  email String @unique
  name  String
}
```

### 2. Criar Migration
```bash
npx prisma migrate dev --name create_users
```

### 3. Gerar Client (automático com migrate dev)
Se precisar gerar manualmente:
```bash
npx prisma generate
```

### 4. Usar no Código
```javascript
const prisma = require('./config/database');

// Criar
const user = await prisma.user.create({
  data: { email: 'test@email.com', name: 'Teste' }
});

// Buscar
const users = await prisma.user.findMany();
const user = await prisma.user.findUnique({ where: { id: '123' } });

// Atualizar
const updated = await prisma.user.update({
  where: { id: '123' },
  data: { name: 'Novo Nome' }
});

// Deletar
await prisma.user.delete({ where: { id: '123' } });
```

## 🔄 Migrations Avançadas

### Ver SQL de uma Migration
Cheque o arquivo em `prisma/migrations/[timestamp]_[name]/migration.sql`

### Criar Migration Vazia (para SQL customizado)
```bash
npx prisma migrate dev --create-only --name custom_migration
```
Depois edite o SQL gerado antes de aplicar.

### Resolver Conflitos de Migration
Se houver divergência entre schema e banco:
```bash
npx prisma migrate resolve --applied [migration_name]
npx prisma migrate resolve --rolled-back [migration_name]
```

## 🐛 Troubleshooting

### Erro: "Migration engine not found"
```bash
npx prisma generate
npm install @prisma/client
```

### Erro: "Can't reach database server"
Verifique:
- Banco de dados está rodando?
- DATABASE_URL está correta no `.env`?
- Firewall bloqueando conexão?

### Limpar Cache do Prisma
```bash
npx prisma generate --force
```

### Recriar do Zero
```bash
npx prisma migrate reset
npx prisma generate
```

## 📚 Links Úteis

- [Documentação Prisma](https://www.prisma.io/docs)
- [Schema Reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)
- [Prisma Client API](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference)
- [Migrations Guide](https://www.prisma.io/docs/concepts/components/prisma-migrate)

## ⚡ Dicas Rápidas

- Sempre commit as migrations no Git
- Use `npx prisma studio` para visualizar dados rapidamente
- Em desenvolvimento, use `migrate dev`
- Em produção, use `migrate deploy`
- Faça backup antes de `migrate reset`
- Use `@@map("table_name")` para customizar nomes de tabelas
- Use `@map("column_name")` para customizar nomes de colunas
