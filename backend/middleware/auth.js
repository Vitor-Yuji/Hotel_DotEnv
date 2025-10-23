const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

// Middleware para verificar JWT
const verificarToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        sucesso: false,
        mensagem: 'Token de acesso não fornecido'
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' do início

    // Verifica o token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Busca o usuário no banco
    const usuario = await Usuario.buscarPorId(decoded.id);
    
    if (!usuario) {
      return res.status(401).json({
        sucesso: false,
        mensagem: 'Usuário não encontrado'
      });
    }

    // Adiciona o usuário ao request
    req.usuario = usuario;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        sucesso: false,
        mensagem: 'Token inválido'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        sucesso: false,
        mensagem: 'Token expirado'
      });
    }

    console.error('Erro na verificação do token:', error);
    return res.status(500).json({
      sucesso: false,
      mensagem: 'Erro interno do servidor'
    });
  }
};

// Middleware para verificar se o usuário é admin
const verificarAdmin = (req, res, next) => {
  if (!req.usuario) {
    return res.status(401).json({
      sucesso: false,
      mensagem: 'Usuário não autenticado'
    });
  }

  // Aqui você pode implementar lógica para verificar se é admin
  // Por enquanto, vamos assumir que todos os usuários autenticados podem acessar
  // Você pode adicionar um campo 'role' ou 'tipo_usuario' na tabela
  
  next();
};

// Middleware para verificar se o usuário pode acessar seus próprios dados
const verificarProprioUsuario = (req, res, next) => {
  const usuarioId = req.params.id || req.body.id;
  
  if (!req.usuario) {
    return res.status(401).json({
      sucesso: false,
      mensagem: 'Usuário não autenticado'
    });
  }

  // Verifica se está tentando acessar seus próprios dados
  if (req.usuario.id !== usuarioId) {
    return res.status(403).json({
      sucesso: false,
      mensagem: 'Acesso negado: você só pode acessar seus próprios dados'
    });
  }

  next();
};

// Função para gerar token JWT
const gerarToken = (usuario) => {
  const payload = {
    id: usuario.id,
    email: usuario.email,
    nome: usuario.nome
  };

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '24h'
  });
};

// Middleware para log de requisições
const logRequisicoes = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const metodo = req.method;
  const url = req.url;
  const ip = req.ip || req.connection.remoteAddress;
  
  console.log(`[${timestamp}] ${metodo} ${url} - IP: ${ip}`);
  
  next();
};

// Middleware para tratamento de erros
const tratamentoErros = (error, req, res, next) => {
  console.error('Erro capturado:', error);

  // Erro de validação
  if (error.name === 'ValidationError') {
    return res.status(400).json({
      sucesso: false,
      mensagem: 'Dados inválidos',
      erros: error.errors
    });
  }

  // Erro de banco de dados
  if (error.code && error.code.startsWith('23')) {
    return res.status(409).json({
      sucesso: false,
      mensagem: 'Conflito: dados já existem no sistema'
    });
  }

  // Erro padrão
  res.status(500).json({
    sucesso: false,
    mensagem: 'Erro interno do servidor',
    ...(process.env.NODE_ENV === 'development' && { detalhes: error.message })
  });
};

module.exports = {
  verificarToken,
  verificarAdmin,
  verificarProprioUsuario,
  gerarToken,
  logRequisicoes,
  tratamentoErros
};
