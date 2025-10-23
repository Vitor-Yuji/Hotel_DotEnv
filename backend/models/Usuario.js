const bcrypt = require('bcryptjs');
const { supabase, supabaseAdmin } = require('../config/supabase');

class Usuario {
  constructor(data) {
    this.id = data.id;
    this.nome = data.nome;
    this.pronome = data.pronome;
    this.senha = data.senha;
    this.email = data.email;
    this.telefone = data.telefone;
    this.data_nascimento = data.data_nascimento;
    this.cpf = data.cpf;
    this.timestamp = data.timestamp;
    this.active = data.active;
    this.deleted_at = data.deleted_at;
    this.deleted_by = data.deleted_by;
  }

  // Criar novo usuário
  static async criar(dadosUsuario) {
    try {
      // Hash da senha
      const saltRounds = 12;
      const senhaHash = await bcrypt.hash(dadosUsuario.senha, saltRounds);

      const usuarioData = {
        nome: dadosUsuario.nome,
        pronome: dadosUsuario.pronome || null,
        senha: senhaHash,
        email: dadosUsuario.email,
        telefone: dadosUsuario.telefone || null,
        data_nascimento: dadosUsuario.data_nascimento || null,
        cpf: dadosUsuario.cpf || null,
        active: true
      };

      const { data, error } = await supabaseAdmin
        .from('usuarios')
        .insert([usuarioData])
        .select()
        .single();

      if (error) {
        throw new Error(`Erro ao criar usuário: ${error.message}`);
      }

      // Remove a senha do retorno
      delete data.senha;
      return new Usuario(data);
    } catch (error) {
      throw error;
    }
  }

  // Buscar usuário por email
  static async buscarPorEmail(email) {
    try {
      const { data, error } = await supabaseAdmin
        .from('usuarios')
        .select('*')
        .eq('email', email)
        .eq('active', true)
        .is('deleted_at', null)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // Usuário não encontrado
        }
        throw new Error(`Erro ao buscar usuário: ${error.message}`);
      }

      return new Usuario(data);
    } catch (error) {
      throw error;
    }
  }

  // Buscar usuário por ID
  static async buscarPorId(id) {
    try {
      const { data, error } = await supabaseAdmin
        .from('usuarios')
        .select('*')
        .eq('id', id)
        .eq('active', true)
        .is('deleted_at', null)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // Usuário não encontrado
        }
        throw new Error(`Erro ao buscar usuário: ${error.message}`);
      }

      return new Usuario(data);
    } catch (error) {
      throw error;
    }
  }

  // Listar todos os usuários (com paginação)
  static async listar(pagina = 1, limite = 10) {
    try {
      const offset = (pagina - 1) * limite;

      const { data, error, count } = await supabaseAdmin
        .from('usuarios')
        .select('*', { count: 'exact' })
        .eq('active', true)
        .is('deleted_at', null)
        .order('timestamp', { ascending: false })
        .range(offset, offset + limite - 1);

      if (error) {
        throw new Error(`Erro ao listar usuários: ${error.message}`);
      }

      // Remove senhas dos dados retornados
      const usuariosSemSenha = data.map(usuario => {
        const { senha, ...usuarioSemSenha } = usuario;
        return new Usuario(usuarioSemSenha);
      });

      return {
        usuarios: usuariosSemSenha,
        total: count,
        pagina,
        limite,
        totalPaginas: Math.ceil(count / limite)
      };
    } catch (error) {
      throw error;
    }
  }

  // Atualizar usuário
  async atualizar(dadosAtualizacao) {
    try {
      const camposPermitidos = ['nome', 'pronome', 'email', 'telefone', 'data_nascimento', 'cpf'];
      const dadosParaAtualizar = {};

      // Filtra apenas campos permitidos
      camposPermitidos.forEach(campo => {
        if (dadosAtualizacao[campo] !== undefined) {
          dadosParaAtualizar[campo] = dadosAtualizacao[campo];
        }
      });

      // Se estiver atualizando a senha, fazer hash
      if (dadosAtualizacao.senha) {
        const saltRounds = 12;
        dadosParaAtualizar.senha = await bcrypt.hash(dadosAtualizacao.senha, saltRounds);
      }

      const { data, error } = await supabaseAdmin
        .from('usuarios')
        .update(dadosParaAtualizar)
        .eq('id', this.id)
        .select()
        .single();

      if (error) {
        throw new Error(`Erro ao atualizar usuário: ${error.message}`);
      }

      // Atualiza os dados da instância
      Object.assign(this, data);
      delete this.senha; // Remove senha do objeto
      return this;
    } catch (error) {
      throw error;
    }
  }

  // Soft delete do usuário
  async deletar(usuarioIdQueDeleta) {
    try {
      const { error } = await supabaseAdmin
        .from('usuarios')
        .update({
          active: false,
          deleted_at: new Date().toISOString(),
          deleted_by: usuarioIdQueDeleta
        })
        .eq('id', this.id);

      if (error) {
        throw new Error(`Erro ao deletar usuário: ${error.message}`);
      }

      this.active = false;
      this.deleted_at = new Date().toISOString();
      this.deleted_by = usuarioIdQueDeleta;
      return this;
    } catch (error) {
      throw error;
    }
  }

  // Verificar senha
  async verificarSenha(senha) {
    try {
      // Busca a senha hash do banco
      const { data, error } = await supabaseAdmin
        .from('usuarios')
        .select('senha')
        .eq('id', this.id)
        .single();

      if (error) {
        throw new Error(`Erro ao verificar senha: ${error.message}`);
      }

      return await bcrypt.compare(senha, data.senha);
    } catch (error) {
      throw error;
    }
  }

  // Converter para objeto público (sem dados sensíveis)
  toPublicObject() {
    const { senha, ...usuarioPublico } = this;
    return usuarioPublico;
  }

  // Validar dados do usuário
  static validarDados(dados) {
    const erros = [];

    if (!dados.nome || dados.nome.trim().length < 2) {
      erros.push('Nome deve ter pelo menos 2 caracteres');
    }

    if (!dados.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dados.email)) {
      erros.push('Email inválido');
    }

    if (!dados.senha || dados.senha.length < 6) {
      erros.push('Senha deve ter pelo menos 6 caracteres');
    }

    if (dados.cpf && !/^\d{11}$/.test(dados.cpf.replace(/\D/g, ''))) {
      erros.push('CPF inválido');
    }

    if (dados.telefone && !/^\(\d{2}\)\s\d{4,5}-\d{4}$/.test(dados.telefone)) {
      erros.push('Telefone deve estar no formato (XX) XXXXX-XXXX');
    }

    return erros;
  }
}

module.exports = Usuario;
