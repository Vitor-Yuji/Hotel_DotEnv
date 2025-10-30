# Deploy no Render: Backend + Frontend

Este projeto já inclui um `render.yaml` para deploy com 1 Web Service (backend) e 1 Static Site (frontend).

## 1) Pré-requisitos
- Conta no Render: https://render.com
- Repositório no GitHub com este projeto

## 2) Variáveis de Ambiente
Configure no serviço do backend (Render > Service > Settings > Environment):
- SUPABASE_URL
- SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY
- JWT_SECRET
- JWT_EXPIRES_IN (ex.: `24h`)
- CORS_ORIGIN (URL do frontend no Render, ex.: `https://hotel-frontend.onrender.com`)
- NODE_ENV=`production`

Configure no static site (frontend):
- REACT_APP_API_URL (ex.: `https://hotel-backend.onrender.com/api`)

## 3) Deploy via Blueprint
1. No Render, vá em Blueprints > New Blueprint
2. Aponte para o repositório GitHub
3. Confirme para criar os dois serviços definidos em `render.yaml`

O arquivo `render.yaml` faz:
- Backend (Node/Express): build com `npm ci` e start com `node server.js`, health check em `/health`.
- Frontend (Static): build com `npm ci && npm run build`, publica `frontend/build` e inclui rewrites SPA.

## 4) Ajuste de CORS
No backend, defina `CORS_ORIGIN` para a URL do frontend (Render) para liberar o acesso do browser.

## 5) Rotas SPA
O `render.yaml` já inclui:
- Rewrite `/* -> /index.html` (SPA)
- Proxy opcional de `/api/*` do frontend para o backend; ajuste o domínio se desejar.

## 6) Testes pós-deploy
- Backend: acesse `https://SEU_BACKEND.onrender.com/health`
- Frontend: acesse `https://SEU_FRONTEND.onrender.com`
- Verifique login/cadastro com `REACT_APP_API_URL` apontando pro backend.

## 7) Dicas
- Se usar domínios customizados, atualize `CORS_ORIGIN` e `REACT_APP_API_URL`.
- Logs: Render > Service > Logs
- Redeploy: Render > Manual Deploy > Clear build cache & Deploy
