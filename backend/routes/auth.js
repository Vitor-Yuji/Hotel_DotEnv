const express = require('express');
const { body, validationResult } = require('express-validator');
const Usuario = require('../models/Usuario');
const { gerarToken } = require('../middleware/auth');

const router = express.Router();

// Validações para registro
const validacoesRegistro = [
  body('nome')
    .trim()
    .isLength({ min: 2 })
    .withMessage('Nome deve ter pelo menos 2 caracteres'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Email inválido'),
  body('senha')
    .isLength({ min: 6 })
    .withMessage('Senha deve ter pelo menos 6 caracteres'),
  body('cpf')
    .optional()
    .isLength({ min: 11, max: 11 })
    .withMessage('CPF deve ter 11 dígitos'),
  body('telefone')
    .optional()
    .matches(/^\(\d{2}\)\s\d{4,5}-\d{4}$/)
    .withMessage('Telefone deve estar no formato (XX) XXXXX-XXXX')
];

// Validações para login
const validacoesLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Email inválido'),
  body('senha')
    .notEmpty()
    .withMessage('Senha é obrigatória')
];

// POST /auth/register - Registrar novo usuário
router.post('/register', validacoesRegistro, async (req, res) => {
  try {
    // Verifica erros de validação
    const erros = validationResult(req);
    if (!erros.isEmpty()) {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'Dados inválidos',
        erros: erros.array()
      });
    }

    const { nome, pronome, email, senha, telefone, data_nascimento, cpf } = req.body;

    // Verifica se o usuário já existe
    const usuarioExistente = await Usuario.buscarPorEmail(email);
    if (usuarioExistente) {
      return res.status(409).json({
        sucesso: false,
        mensagem: 'Email já está em uso'
      });
    }

    // Validações adicionais
    const errosValidacao = Usuario.validarDados(req.body);
    if (errosValidacao.length > 0) {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'Dados inválidos',
        erros: errosValidacao
      });
    }

    // Cria o usuário
    const novoUsuario = await Usuario.criar({
      nome,
      pronome,
      email,
      senha,
      telefone,
      data_nascimento,
      cpf
    });

    // Gera token JWT
    const token = gerarToken(novoUsuario);

    res.status(201).json({
      sucesso: true,
      mensagem: 'Usuário criado com sucesso',
      dados: {
        usuario: novoUsuario.toPublicObject(),
        token
      }
    });

  } catch (error) {
    console.error('Erro no registro:', error);
    
    if (error.message.includes('duplicate key')) {
      return res.status(409).json({
        sucesso: false,
        mensagem: 'Email ou CPF já está em uso'
      });
    }

    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro interno do servidor'
    });
  }
});

// POST /auth/login - Login do usuário
router.post('/login', validacoesLogin, async (req, res) => {
  try {
    // Verifica erros de validação
    const erros = validationResult(req);
    if (!erros.isEmpty()) {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'Dados inválidos',
        erros: erros.array()
      });
    }

    const { email, senha } = req.body;

    // Busca o usuário
    const usuario = await Usuario.buscarPorEmail(email);
    if (!usuario) {
      return res.status(401).json({
        sucesso: false,
        mensagem: 'Credenciais inválidas'
      });
    }

    // Verifica a senha
    const senhaValida = await usuario.verificarSenha(senha);
    if (!senhaValida) {
      return res.status(401).json({
        sucesso: false,
        mensagem: 'Credenciais inválidas'
      });
    }

    // Gera token JWT
    const token = gerarToken(usuario);

    res.json({
      sucesso: true,
      mensagem: 'Login realizado com sucesso',
      dados: {
        usuario: usuario.toPublicObject(),
        token
      }
    });

  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro interno do servidor'
    });
  }
});

// POST /auth/verify-token - Verificar se token é válido
router.post('/verify-token', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        sucesso: false,
        mensagem: 'Token não fornecido'
      });
    }

    const token = authHeader.substring(7);
    const jwt = require('jsonwebtoken');
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const usuario = await Usuario.buscarPorId(decoded.id);
      
      if (!usuario) {
        return res.status(401).json({
          sucesso: false,
          mensagem: 'Usuário não encontrado'
        });
      }

      res.json({
        sucesso: true,
        mensagem: 'Token válido',
        dados: {
          usuario: usuario.toPublicObject()
        }
      });
    } catch (jwtError) {
      return res.status(401).json({
        sucesso: false,
        mensagem: 'Token inválido'
      });
    }

  } catch (error) {
    console.error('Erro na verificação do token:', error);
    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro interno do servidor'
    });
  }
});

// POST /auth/refresh-token - Renovar token
router.post('/refresh-token', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        sucesso: false,
        mensagem: 'Token não fornecido'
      });
    }

    const token = authHeader.substring(7);
    const jwt = require('jsonwebtoken');
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const usuario = await Usuario.buscarPorId(decoded.id);
      
      if (!usuario) {
        return res.status(401).json({
          sucesso: false,
          mensagem: 'Usuário não encontrado'
        });
      }

      // Gera novo token
      const novoToken = gerarToken(usuario);

      res.json({
        sucesso: true,
        mensagem: 'Token renovado com sucesso',
        dados: {
          token: novoToken
        }
      });
    } catch (jwtError) {
      return res.status(401).json({
        sucesso: false,
        mensagem: 'Token inválido'
      });
    }

  } catch (error) {
    console.error('Erro na renovação do token:', error);
    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro interno do servidor'
    });
  }
});

module.exports = router;
