# 🧪 Testes da API WatchMeGym

Este diretório contém arquivos para testar os endpoints da API.

## 📁 Arquivos de Teste

- **`auth.http`** - Testes de autenticação
- **`users.http`** - Testes de usuários
- **`bioimpedances.http`** - Testes de bioimpedâncias
- **`academies.http`** - Testes de academias
- **`academy-users.http`** - Testes de vínculos academia-usuário
- **`cameras.http`** - Testes de câmeras
- **`exercises.http`** - Testes de exercícios
- **`exercise-videos.http`** - Testes de vídeos de exercícios
- **`trainings.http`** - Testes de treinos
- **`training-exercises.http`** - Testes de exercícios de treinos
- **`statistics.http`** - Testes de estatísticas
- **`records.http`** - Testes de gravações (CRUD)
- **`recordings.http`** - Testes de gravação RTSP
- **`plans.http`** - Testes de planos
- **`subscriptions.http`** - Testes de assinaturas
- **`payments.http`** - Testes de pagamentos
- **`scan-face-videos.http`** - Testes de vídeos de scan face
- **`README.md`** - Este arquivo

## 🚀 Como Usar

### Opção 1: REST Client (VS Code) - Recomendado ✅

1. **Instale a extensão:**
   - Abra o VS Code
   - Vá em Extensions (`Ctrl+Shift+X`)
   - Busque: "REST Client"
   - Instale a extensão do Huachao Mao

2. **Execute os testes:**
   - Abra o arquivo `users.http`
   - Clique em "Send Request" acima de cada requisição
   - Ou use `Ctrl+Alt+R` (Windows/Linux) ou `Cmd+Alt+R` (Mac)

3. **Ver respostas:**
   - As respostas aparecem em uma nova aba
   - Você pode salvar variáveis e reutilizar em outras requisições

### Opção 2: cURL (Terminal)

```bash
# Health Check
curl http://localhost:3000/api/health

# Criar Usuário
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste@email.com",
    "name": "João da Silva",
    "password": "senha123"
  }'

# Listar Usuários
curl http://localhost:3000/api/users

# Buscar por ID
curl http://localhost:3000/api/users/{ID}

# Atualizar Usuário
curl -X PUT http://localhost:3000/api/users/{ID} \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João da Silva Santos"
  }'

# Deletar Usuário
curl -X DELETE http://localhost:3000/api/users/{ID}
```

### Opção 3: Postman/Insomnia

Copie as requisições do arquivo `users.http` para sua ferramenta preferida.

## 📋 Principais Endpoints Disponíveis

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/health` | Health check |
| POST | `/api/auth/register` | Registrar usuário |
| POST | `/api/auth/login` | Login |
| POST | `/api/users` | Criar usuário |
| GET | `/api/users` | Listar usuários |
| GET | `/api/users/:id` | Buscar usuário por ID |
| PUT | `/api/users/:id` | Atualizar usuário |
| DELETE | `/api/users/:id` | Deletar usuário |
| POST | `/api/scan-face-videos` | Criar vídeo de scan face |
| GET | `/api/scan-face-videos` | Listar vídeos de scan face |
| GET | `/api/scan-face-videos/:id` | Buscar vídeo por ID |
| GET | `/api/scan-face-videos/user/:userId` | Buscar vídeos por usuário |
| GET | `/api/scan-face-videos/user/:userId/latest` | Buscar vídeo mais recente |
| PUT | `/api/scan-face-videos/:id` | Atualizar vídeo |
| DELETE | `/api/scan-face-videos/:id` | Deletar vídeo |

*Consulte os arquivos `.http` individuais para ver todos os endpoints disponíveis.*

## ✅ Testes de Validação Incluídos

Cada arquivo `.http` inclui testes para:

### Exemplo: `scan-face-videos.http`
1. ✅ Criar vídeo com URL
2. ✅ Criar vídeo com upload de arquivo
3. ✅ Listar todos os vídeos
4. ✅ Buscar vídeo por ID
5. ✅ Buscar vídeos por usuário
6. ✅ Buscar vídeo mais recente
7. ✅ Atualizar vídeo
8. ✅ Deletar vídeo
9. ❌ Validações de erro (UUID inválido, URL inválida, etc.)
10. ❌ Testes de autenticação (sem token)

## 🎯 Fluxo de Teste Completo

1. **Inicie o servidor:**
   ```bash
   npm run dev
   ```

2. **Execute os testes na ordem:**
   - Health Check (`/api/health`)
   - Autenticação (`auth.http`) - Obter token
   - Criar recursos conforme necessário
   - Testar CRUD completo
   - Validar erros e validações

**Nota:** A maioria dos endpoints requer autenticação. Use o token obtido em `auth.http` nas variáveis `@token` dos outros arquivos.

3. **Teste as validações:**
   - Execute os testes de erro para verificar validações

## 📊 Exemplo de Resposta

### Sucesso (201 Created)
```json
{
  "message": "Usuário criado com sucesso",
  "user": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "teste@email.com",
    "name": "João da Silva",
    "active": true,
    "createdAt": "2024-01-13T12:00:00.000Z",
    "updatedAt": "2024-01-13T12:00:00.000Z"
  }
}
```

### Erro de Validação (400 Bad Request)
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

## 💡 Dicas

- Use variáveis no REST Client para reutilizar IDs
- O primeiro teste cria um usuário e salva o ID automaticamente
- Testes de validação devem retornar erro 400
- Senhas são criptografadas antes de salvar
- Senhas nunca são retornadas nas respostas
