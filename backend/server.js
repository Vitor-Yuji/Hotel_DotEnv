const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Importar rotas
const authRoutes = require('./routes/auth');
const usuariosRoutes = require('./routes/usuarios');

// Importar middleware
const { logRequisicoes, tratamentoErros } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 3001;

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requests por IP a cada 15 minutos
  message: {
    sucesso: false,
    mensagem: 'Muitas tentativas. Tente novamente em 15 minutos.'
  }
});

// Rate limiting específico para autenticação
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // máximo 5 tentativas de login por IP a cada 15 minutos
  message: {
    sucesso: false,
    mensagem: 'Muitas tentativas de login. Tente novamente em 15 minutos.'
  }
});

// Middleware de segurança
app.use(helmet());

// CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));

// Rate limiting geral
app.use(limiter);

// Rate limiting para rotas de autenticação
app.use('/api/auth', authLimiter);

// Middleware para parsing de JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Middleware de log
app.use(logRequisicoes);

// Rota de health check
app.get('/health', (req, res) => {
  res.json({
    sucesso: true,
    mensagem: 'API Hotel DotEnv está funcionando',
    timestamp: new Date().toISOString(),
    versao: '1.0.0'
  });
});

// Rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuariosRoutes);

// Rota para documentação da API
app.get('/api', (req, res) => {
  res.json({
    sucesso: true,
    mensagem: 'API Hotel DotEnv',
    versao: '1.0.0',
    endpoints: {
      auth: {
        'POST /api/auth/register': 'Registrar novo usuário',
        'POST /api/auth/login': 'Login do usuário',
        'POST /api/auth/verify-token': 'Verificar token JWT',
        'POST /api/auth/refresh-token': 'Renovar token JWT'
      },
      usuarios: {
        'GET /api/usuarios': 'Listar usuários (com paginação)',
        'GET /api/usuarios/:id': 'Buscar usuário por ID',
        'PUT /api/usuarios/:id': 'Atualizar usuário',
        'DELETE /api/usuarios/:id': 'Deletar usuário (soft delete)',
        'GET /api/usuarios/profile/me': 'Buscar perfil do usuário logado',
        'PUT /api/usuarios/profile/me': 'Atualizar perfil do usuário logado'
      }
    },
    autenticacao: 'Bearer Token JWT',
    exemplo_headers: {
      'Authorization': 'Bearer seu_token_jwt_aqui',
      'Content-Type': 'application/json'
    }
  });
});

// Middleware para rotas não encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    sucesso: false,
    mensagem: 'Rota não encontrada',
    rota: req.originalUrl,
    metodo: req.method
  });
});

// Middleware de tratamento de erros
app.use(tratamentoErros);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📚 Documentação da API: http://localhost:${PORT}/api`);
  console.log(`🏥 Health Check: http://localhost:${PORT}/health`);
  console.log(`🌍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
});

// Tratamento de erros não capturados
process.on('uncaughtException', (error) => {
  console.error('Erro não capturado:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Promise rejeitada não tratada:', reason);
  process.exit(1);
});

module.exports = app;
