const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Usuario = require('../models/Usuario');
const { verificarToken, verificarProprioUsuario } = require('../middleware/auth');

const router = express.Router();

// Validações para atualização de usuário
const validacoesAtualizacao = [
  body('nome')
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage('Nome deve ter pelo menos 2 caracteres'),
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Email inválido'),
  body('senha')
    .optional()
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

// Validações para query parameters
const validacoesQuery = [
  query('pagina')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Página deve ser um número inteiro maior que 0'),
  query('limite')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limite deve ser um número entre 1 e 100')
];

// GET /usuarios - Listar usuários (com paginação)
router.get('/', verificarToken, validacoesQuery, async (req, res) => {
  try {
    // Verifica erros de validação
    const erros = validationResult(req);
    if (!erros.isEmpty()) {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'Parâmetros inválidos',
        erros: erros.array()
      });
    }

    const pagina = parseInt(req.query.pagina) || 1;
    const limite = parseInt(req.query.limite) || 10;

    const resultado = await Usuario.listar(pagina, limite);

    res.json({
      sucesso: true,
      mensagem: 'Usuários listados com sucesso',
      dados: resultado
    });

  } catch (error) {
    console.error('Erro ao listar usuários:', error);
    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro interno do servidor'
    });
  }
});

// GET /usuarios/:id - Buscar usuário por ID
router.get('/:id', verificarToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Verifica se está tentando acessar seus próprios dados ou se é admin
    if (req.usuario.id !== id) {
      // Aqui você pode implementar verificação de admin
      // Por enquanto, vamos permitir que qualquer usuário autenticado veja outros usuários
    }

    const usuario = await Usuario.buscarPorId(id);
    
    if (!usuario) {
      return res.status(404).json({
        sucesso: false,
        mensagem: 'Usuário não encontrado'
      });
    }

    res.json({
      sucesso: true,
      mensagem: 'Usuário encontrado',
      dados: {
        usuario: usuario.toPublicObject()
      }
    });

  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro interno do servidor'
    });
  }
});

// PUT /usuarios/:id - Atualizar usuário
router.put('/:id', verificarToken, verificarProprioUsuario, validacoesAtualizacao, async (req, res) => {
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

    const { id } = req.params;
    const dadosAtualizacao = req.body;

    // Remove campos que não devem ser atualizados diretamente
    delete dadosAtualizacao.id;
    delete dadosAtualizacao.timestamp;
    delete dadosAtualizacao.active;
    delete dadosAtualizacao.deleted_at;
    delete dadosAtualizacao.deleted_by;

    // Se estiver atualizando email, verifica se já existe
    if (dadosAtualizacao.email) {
      const usuarioExistente = await Usuario.buscarPorEmail(dadosAtualizacao.email);
      if (usuarioExistente && usuarioExistente.id !== id) {
        return res.status(409).json({
          sucesso: false,
          mensagem: 'Email já está em uso por outro usuário'
        });
      }
    }

    // Busca o usuário atual
    const usuario = await Usuario.buscarPorId(id);
    if (!usuario) {
      return res.status(404).json({
        sucesso: false,
        mensagem: 'Usuário não encontrado'
      });
    }

    // Atualiza o usuário
    const usuarioAtualizado = await usuario.atualizar(dadosAtualizacao);

    res.json({
      sucesso: true,
      mensagem: 'Usuário atualizado com sucesso',
      dados: {
        usuario: usuarioAtualizado.toPublicObject()
      }
    });

  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    
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

// DELETE /usuarios/:id - Deletar usuário (soft delete)
router.delete('/:id', verificarToken, verificarProprioUsuario, async (req, res) => {
  try {
    const { id } = req.params;

    const usuario = await Usuario.buscarPorId(id);
    if (!usuario) {
      return res.status(404).json({
        sucesso: false,
        mensagem: 'Usuário não encontrado'
      });
    }

    // Realiza soft delete
    await usuario.deletar(req.usuario.id);

    res.json({
      sucesso: true,
      mensagem: 'Usuário deletado com sucesso'
    });

  } catch (error) {
    console.error('Erro ao deletar usuário:', error);
    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro interno do servidor'
    });
  }
});

// GET /usuarios/profile/me - Buscar perfil do usuário logado
router.get('/profile/me', verificarToken, async (req, res) => {
  try {
    res.json({
      sucesso: true,
      mensagem: 'Perfil do usuário',
      dados: {
        usuario: req.usuario.toPublicObject()
      }
    });
  } catch (error) {
    console.error('Erro ao buscar perfil:', error);
    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro interno do servidor'
    });
  }
});

// PUT /usuarios/profile/me - Atualizar perfil do usuário logado
router.put('/profile/me', verificarToken, validacoesAtualizacao, async (req, res) => {
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

    const dadosAtualizacao = req.body;

    // Remove campos que não devem ser atualizados diretamente
    delete dadosAtualizacao.id;
    delete dadosAtualizacao.timestamp;
    delete dadosAtualizacao.active;
    delete dadosAtualizacao.deleted_at;
    delete dadosAtualizacao.deleted_by;

    // Se estiver atualizando email, verifica se já existe
    if (dadosAtualizacao.email) {
      const usuarioExistente = await Usuario.buscarPorEmail(dadosAtualizacao.email);
      if (usuarioExistente && usuarioExistente.id !== req.usuario.id) {
        return res.status(409).json({
          sucesso: false,
          mensagem: 'Email já está em uso por outro usuário'
        });
      }
    }

    // Atualiza o usuário
    const usuarioAtualizado = await req.usuario.atualizar(dadosAtualizacao);

    res.json({
      sucesso: true,
      mensagem: 'Perfil atualizado com sucesso',
      dados: {
        usuario: usuarioAtualizado.toPublicObject()
      }
    });

  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    
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

module.exports = router;
