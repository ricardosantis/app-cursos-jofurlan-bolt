# EduCourse Backend API

Backend API Node.js/Express para o aplicativo EduCourse.

## 🚀 Quick Start

```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Edite o .env com suas credenciais

# Rodar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Rodar produção
npm start
```

## 📦 Stack

- **Node.js** 18+
- **Express** - Framework web
- **TypeScript** - Tipagem estática
- **Neon** - PostgreSQL serverless
- **Zod** - Validação de schemas

## 📁 Estrutura

```
backend/
├── src/
│   ├── config/       # Configurações (DB, env)
│   ├── routes/       # Rotas da API
│   ├── middleware/   # Middlewares (auth, error handling)
│   ├── services/     # Lógica de negócio
│   ├── types/        # TypeScript types
│   └── server.ts     # Entry point
├── .env              # Variáveis de ambiente
└── package.json
```

## 🌐 Endpoints

### Health Check
- `GET /health` - Status da API

### API (em desenvolvimento)
- `GET /api/courses` - Lista cursos
- `GET /api/courses/:id` - Detalhes do curso
- `GET /api/lessons/:id` - Detalhes da lição
- `GET /api/progress` - Progresso do usuário
- `POST /api/progress` - Salvar progresso

## 🔧 Scripts

- `npm run dev` - Desenvolvimento com hot reload
- `npm run build` - Build TypeScript
- `npm start` - Rodar versão de produção
- `npm run type-check` - Verificar tipos

## 📝 Variáveis de Ambiente

```env
DATABASE_URL=postgresql://...
PORT=3001
NODE_ENV=development
```
