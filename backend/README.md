# Hotel DotEnv - Backend API

## 🚀 Configuração e Instalação

### 1. Instalar dependências
```bash
cd backend
npm install
```

### 2. Configurar variáveis de ambiente
Copie o arquivo `env.example` para `.env` e configure suas variáveis:

```bash
cp env.example .env
```

Configure as seguintes variáveis no arquivo `.env`:

```env
# Supabase Configuration
SUPABASE_URL=sua_url_do_supabase
SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
SUPABASE_SERVICE_ROLE_KEY=sua_chave_service_role_do_supabase

# JWT Configuration
JWT_SECRET=sua_chave_secreta_jwt_muito_segura
JWT_EXPIRES_IN=24h

# Server Configuration
PORT=3001
NODE_ENV=development

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
```

### 3. Executar o servidor

**Desenvolvimento (com nodemon):**
```bash
npm run dev
```

**Produção:**
```bash
npm start
```

## 📚 Documentação da API

### Base URL
```
http://localhost:3001/api
```

### Autenticação
Todas as rotas protegidas requerem um token JWT no header:
```
Authorization: Bearer seu_token_jwt_aqui
```

## 🔐 Rotas de Autenticação

### POST /auth/register
Registrar novo usuário

**Body:**
```json
{
  "nome": "João",
  "pronome": "ele/dele",
  "email": "joao@email.com",
  "senha": "123456",
  "telefone": "(11) 99999-9999",
  "data_nascimento": "1990-01-01",
  "cpf": "12345678901"
}
```

**Response:**
```json
{
  "sucesso": true,
  "mensagem": "Usuário criado com sucesso",
  "dados": {
    "usuario": {
      "id": "uuid",
      "nome": "João",
      "email": "joao@email.com",
      "active": true,
      "timestamp": "2024-01-01T00:00:00Z"
    },
    "token": "jwt_token"
  }
}
```

### POST /auth/login
Login do usuário

**Body:**
```json
{
  "email": "joao@email.com",
  "senha": "123456"
}
```

**Response:**
```json
{
  "sucesso": true,
  "mensagem": "Login realizado com sucesso",
  "dados": {
    "usuario": {
      "id": "uuid",
      "nome": "João",
      "email": "joao@email.com"
    },
    "token": "jwt_token"
  }
}
```

### POST /auth/verify-token
Verificar se token é válido

**Headers:**
```
Authorization: Bearer seu_token_jwt_aqui
```

### POST /auth/refresh-token
Renovar token JWT

**Headers:**
```
Authorization: Bearer seu_token_jwt_aqui
```

## 👥 Rotas de Usuários

### GET /usuarios
Listar usuários (com paginação)

**Query Parameters:**
- `pagina` (opcional): Número da página (padrão: 1)
- `limite` (opcional): Itens por página (padrão: 10, máximo: 100)

**Headers:**
```
Authorization: Bearer seu_token_jwt_aqui
```

**Response:**
```json
{
  "sucesso": true,
  "mensagem": "Usuários listados com sucesso",
  "dados": {
    "usuarios": [...],
    "total": 100,
    "pagina": 1,
    "limite": 10,
    "totalPaginas": 10
  }
}
```

### GET /usuarios/:id
Buscar usuário por ID

**Headers:**
```
Authorization: Bearer seu_token_jwt_aqui
```

### PUT /usuarios/:id
Atualizar usuário

**Headers:**
```
Authorization: Bearer seu_token_jwt_aqui
```

**Body:**
```json
{
  "nome": "João Silva",
  "telefone": "(11) 88888-8888"
}
```

### DELETE /usuarios/:id
Deletar usuário (soft delete)

**Headers:**
```
Authorization: Bearer seu_token_jwt_aqui
```

### GET /usuarios/profile/me
Buscar perfil do usuário logado

**Headers:**
```
Authorization: Bearer seu_token_jwt_aqui
```

### PUT /usuarios/profile/me
Atualizar perfil do usuário logado

**Headers:**
```
Authorization: Bearer seu_token_jwt_aqui
```

## 🛡️ Segurança

- **Rate Limiting**: Máximo 100 requests por IP a cada 15 minutos
- **Auth Rate Limiting**: Máximo 5 tentativas de login por IP a cada 15 minutos
- **Helmet**: Headers de segurança
- **CORS**: Configuração de origem permitida
- **JWT**: Autenticação baseada em tokens
- **Bcrypt**: Hash de senhas com salt rounds 12
- **Validação**: Validação de dados com express-validator

## 📊 Estrutura do Banco de Dados

A API está configurada para trabalhar com a seguinte estrutura de tabela `usuarios`:

```sql
CREATE TABLE public.usuarios (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nome TEXT NOT NULL,
    pronome TEXT,
    senha TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    telefone VARCHAR(20),
    data_nascimento DATE,
    cpf CHAR(11) UNIQUE,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    active BOOLEAN DEFAULT TRUE,
    deleted_at TIMESTAMP WITH TIME ZONE,
    deleted_by UUID
);
```

## 🔧 Scripts Disponíveis

- `npm start`: Executa o servidor em produção
- `npm run dev`: Executa o servidor em desenvolvimento com nodemon
- `npm test`: Executa os testes (ainda não implementado)

## 📝 Logs

O servidor registra automaticamente:
- Todas as requisições HTTP
- Erros de validação
- Erros de autenticação
- Erros internos do servidor

## 🌐 Endpoints Úteis

- **Health Check**: `GET /health`
- **Documentação**: `GET /api`
- **API Base**: `http://localhost:3001/api`
