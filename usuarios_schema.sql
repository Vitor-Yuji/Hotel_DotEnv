-- Schema da tabela usuários para Supabase
-- Sistema de Hotel DotEnv

-- Criar a tabela de usuários
CREATE TABLE usuarios (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    nome VARCHAR(100) NOT NULL,
    sobrenome VARCHAR(100) NOT NULL,
    telefone VARCHAR(20),
    cpf VARCHAR(14) UNIQUE,
    data_nascimento DATE,
    tipo_usuario VARCHAR(20) DEFAULT 'cliente' CHECK (tipo_usuario IN ('cliente', 'funcionario', 'admin')),
    status_usuario VARCHAR(20) DEFAULT 'ativo' CHECK (status_usuario IN ('ativo', 'inativo', 'suspenso')),
    endereco JSONB, -- Para armazenar dados de endereço de forma flexível
    preferencias JSONB, -- Para armazenar preferências do usuário
    avatar_url TEXT,
    email_verificado BOOLEAN DEFAULT FALSE,
    telefone_verificado BOOLEAN DEFAULT FALSE,
    ultimo_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índices para melhor performance
CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_usuarios_cpf ON usuarios(cpf);
CREATE INDEX idx_usuarios_tipo ON usuarios(tipo_usuario);
CREATE INDEX idx_usuarios_status ON usuarios(status_usuario);
CREATE INDEX idx_usuarios_created_at ON usuarios(created_at);

-- Criar função para atualizar o campo updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Criar trigger para atualizar updated_at automaticamente
CREATE TRIGGER update_usuarios_updated_at 
    BEFORE UPDATE ON usuarios 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Inserir usuário administrador padrão (opcional)
-- Senha: admin123 (hash SHA-256)
INSERT INTO usuarios (
    email, 
    senha, 
    nome, 
    sobrenome, 
    tipo_usuario, 
    email_verificado,
    status_usuario
) VALUES (
    'admin@hotel.com',
    'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f', -- SHA-256 de 'admin123'
    'Administrador',
    'Sistema',
    'admin',
    TRUE,
    'ativo'
);

-- Comentários sobre os campos:
-- id: UUID único gerado automaticamente
-- email: Email único para login
-- senha: Hash da senha (recomendo usar bcrypt no backend)
-- nome/sobrenome: Nome completo do usuário
-- telefone: Telefone de contato
-- cpf: CPF único para identificação
-- data_nascimento: Data de nascimento
-- tipo_usuario: cliente, funcionario ou admin
-- status_usuario: ativo, inativo ou suspenso
-- endereco: JSON com dados de endereço (rua, cidade, estado, cep)
-- preferencias: JSON com preferências do usuário
-- avatar_url: URL da foto de perfil
-- email_verificado: Se o email foi verificado
-- telefone_verificado: Se o telefone foi verificado
-- ultimo_login: Timestamp do último login
-- created_at/updated_at: Timestamps de criação e atualização

-- Exemplo de estrutura do campo endereco:
-- {
--   "rua": "Rua das Flores, 123",
--   "cidade": "São Paulo",
--   "estado": "SP",
--   "cep": "01234-567",
--   "pais": "Brasil"
-- }

-- Exemplo de estrutura do campo preferencias:
-- {
--   "idioma": "pt-BR",
--   "notificacoes_email": true,
--   "notificacoes_sms": false,
--   "tipo_quarto_preferido": "suite",
--   "andar_preferido": "alto"
-- }
