# Hotel DotEnv - Frontend

## 🚀 Configuração e Instalação

### 1. Instalar dependências
```bash
cd frontend
npm install
```

### 2. Configurar variáveis de ambiente
Crie um arquivo `.env` na raiz do projeto frontend:

```env
REACT_APP_API_URL=http://localhost:3001/api
```

### 3. Executar o servidor de desenvolvimento
```bash
npm start
```

O aplicativo será aberto em [http://localhost:3000](http://localhost:3000).

## 📱 Funcionalidades Implementadas

### 🔐 **Autenticação**
- **Página de Login** - Interface moderna com validação
- **Página de Cadastro** - Formulário completo com validações
- **Contexto de Autenticação** - Gerenciamento global de estado
- **Proteção de Rotas** - Rotas protegidas e públicas
- **JWT Token** - Autenticação baseada em tokens

### 🎨 **Interface do Usuário**
- **Design Responsivo** - Funciona em desktop, tablet e mobile
- **Tailwind CSS** - Estilização moderna e consistente
- **Componentes Reutilizáveis** - Header, Sidebar, Cards
- **Ícones Lucide** - Ícones modernos e consistentes
- **Notificações Toast** - Feedback visual para ações

### 📄 **Páginas Implementadas**

#### **Página Inicial (HomePage)**
- Hero section com call-to-action
- Seção de recursos/benefícios
- Footer com informações de contato
- Design atrativo e profissional

#### **Página de Login**
- Formulário com validação em tempo real
- Campos: email e senha
- Opção "Lembrar de mim"
- Link para página de cadastro
- Validação de dados com react-hook-form

#### **Página de Cadastro**
- Formulário completo com todos os campos
- Campos: nome, pronome, email, telefone, data de nascimento, CPF, senha
- Validação de confirmação de senha
- Validação de formato de telefone e CPF
- Feedback visual de erros

#### **Dashboard**
- Informações do usuário logado
- Cards com dados do perfil
- Ações rápidas
- Atividade recente
- Layout responsivo com sidebar

#### **Página de Perfil**
- Edição de informações pessoais
- Alteração de senha
- Informações da conta
- Validação de dados
- Feedback de sucesso/erro

### 🛠️ **Tecnologias Utilizadas**

- **React 18** - Biblioteca principal
- **React Router DOM** - Roteamento
- **React Hook Form** - Gerenciamento de formulários
- **Axios** - Requisições HTTP
- **React Hot Toast** - Notificações
- **Tailwind CSS** - Estilização
- **Lucide React** - Ícones
- **Context API** - Gerenciamento de estado

### 🎯 **Recursos de UX/UI**

- **Loading States** - Indicadores de carregamento
- **Error Handling** - Tratamento de erros
- **Form Validation** - Validação em tempo real
- **Responsive Design** - Adaptável a diferentes telas
- **Accessibility** - Semântica HTML adequada
- **Modern Design** - Interface limpa e moderna

### 🔧 **Estrutura do Projeto**

```
src/
├── components/          # Componentes reutilizáveis
│   ├── Header.js        # Cabeçalho da aplicação
│   ├── Sidebar.js       # Barra lateral
│   ├── ProtectedRoute.js # Rota protegida
│   └── PublicRoute.js   # Rota pública
├── contexts/            # Contextos React
│   └── AuthContext.js   # Contexto de autenticação
├── pages/               # Páginas da aplicação
│   ├── HomePage.js      # Página inicial
│   ├── LoginPage.js     # Página de login
│   ├── RegisterPage.js  # Página de cadastro
│   ├── DashboardPage.js # Dashboard do usuário
│   └── ProfilePage.js   # Página de perfil
├── App.js              # Componente principal
├── index.js            # Ponto de entrada
└── index.css           # Estilos globais
```

### 🚀 **Scripts Disponíveis**

- `npm start` - Executa o app em modo de desenvolvimento
- `npm build` - Constrói o app para produção
- `npm test` - Executa os testes
- `npm eject` - Ejecta do Create React App

### 🔗 **Integração com Backend**

O frontend está configurado para se comunicar com a API backend através de:

- **Base URL**: `http://localhost:3001/api`
- **Proxy**: Configurado no package.json
- **Axios**: Configurado com interceptors
- **JWT**: Tokens armazenados no localStorage
- **CORS**: Configurado no backend

### 📱 **Responsividade**

- **Mobile First** - Design otimizado para mobile
- **Breakpoints** - sm, md, lg, xl
- **Grid System** - Layout flexível
- **Navigation** - Menu adaptável para mobile

### 🎨 **Tema e Cores**

- **Primary**: Azul (#3B82F6)
- **Secondary**: Verde (#10B981)
- **Gray Scale**: Tons de cinza para textos e backgrounds
- **Status Colors**: Verde (sucesso), Vermelho (erro), Amarelo (aviso)

### 🔒 **Segurança**

- **JWT Tokens** - Autenticação segura
- **Protected Routes** - Rotas protegidas
- **Input Validation** - Validação de dados
- **XSS Protection** - Prevenção de ataques
- **HTTPS Ready** - Preparado para HTTPS

## 🌐 **Como Usar**

1. **Instalar dependências**: `npm install`
2. **Configurar .env**: Definir URL da API
3. **Executar**: `npm start`
4. **Acessar**: `http://localhost:3000`

O frontend está totalmente integrado com o backend e pronto para uso!
