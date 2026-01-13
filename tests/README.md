# 🧪 Testes da API WatchMeGym

Este diretório contém arquivos para testar os endpoints da API.

## 📁 Arquivos

- **`users.http`** - Arquivo de teste para REST Client (VS Code)
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

## 📋 Endpoints Disponíveis

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/health` | Health check |
| POST | `/api/users` | Criar usuário |
| GET | `/api/users` | Listar usuários |
| GET | `/api/users/:id` | Buscar usuário por ID |
| PUT | `/api/users/:id` | Atualizar usuário |
| DELETE | `/api/users/:id` | Deletar usuário |

## ✅ Testes de Validação Incluídos

O arquivo `users.http` inclui testes para:

1. ✅ Criar usuário válido
2. ✅ Listar usuários
3. ✅ Buscar usuário por ID
4. ✅ Atualizar usuário
5. ✅ Deletar usuário
6. ❌ Email inválido
7. ❌ Nome muito curto
8. ❌ Senha muito curta
9. ❌ Email duplicado
10. ❌ ID inexistente

## 🎯 Fluxo de Teste Completo

1. **Inicie o servidor:**
   ```bash
   npm run dev
   ```

2. **Execute os testes na ordem:**
   - Health Check
   - Criar Usuário (salve o ID retornado)
   - Listar Usuários
   - Buscar por ID
   - Atualizar Usuário
   - Deletar Usuário

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
