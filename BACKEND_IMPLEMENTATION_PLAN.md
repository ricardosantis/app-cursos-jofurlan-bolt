# Plano de Implementação: Backend API para EduCourse

**Data de Criação:** 15 de Outubro de 2025  
**Status:** Planejamento  
**Objetivo:** Criar uma API backend segura para conectar o app React Native/Expo ao banco de dados Neon PostgreSQL

---

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Arquitetura](#arquitetura)
3. [Estrutura de Pastas](#estrutura-de-pastas)
4. [Stack Técnica](#stack-técnica)
5. [Endpoints da API](#endpoints-da-api)
6. [Planejamento Detalhado](#planejamento-detalhado)
7. [Como Rodar](#como-rodar)
8. [Checklist de Progresso](#checklist-de-progresso)

---

## 🎯 Visão Geral

### Problema Atual
- A biblioteca `postgres` não funciona em React Native (depende de módulos Node.js nativos)
- Conexão direta do app mobile ao banco de dados é insegura (expõe credenciais)
- App está quebrado devido a erro `Buffer is not defined`

### Solução Proposta
Criar uma camada de API REST entre o app mobile e o banco de dados Neon:
- **Frontend:** React Native/Expo (porta 8081) - mantém UI e lógica de apresentação
- **Backend:** Node.js/Express API (porta 3001) - gerencia conexão com DB e lógica de negócios
- **Database:** Neon PostgreSQL (cloud) - armazena dados da aplicação

### Benefícios
✅ **Segurança:** Credenciais do DB ficam no servidor  
✅ **Compatibilidade:** Usa HTTP (funciona em qualquer plataforma)  
✅ **Escalabilidade:** Backend pode ser escalado independentemente  
✅ **Manutenibilidade:** Separação de responsabilidades clara  
✅ **Performance:** Cache e otimização de queries no backend  

---

## 🏗️ Arquitetura

```
┌─────────────────────────────────────────────────────────────────┐
│                        MOBILE APP                                │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  React Native + Expo (TypeScript)                        │  │
│  │  - UI Components                                         │  │
│  │  - Navigation (Expo Router)                              │  │
│  │  - State Management (React Context)                      │  │
│  │  - HTTP Client (lib/api.ts)                              │  │
│  └──────────────────────────────────────────────────────────┘  │
│                            │                                     │
│                            │ HTTP/REST                           │
│                            │ (JSON)                              │
└────────────────────────────┼─────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                       BACKEND API                                │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Node.js + Express (TypeScript)                          │  │
│  │  - REST API Routes                                       │  │
│  │  - Authentication Middleware                             │  │
│  │  - Data Validation (Zod)                                 │  │
│  │  - Database Connection (@neondatabase/serverless)        │  │
│  └──────────────────────────────────────────────────────────┘  │
│                            │                                     │
│                            │ SQL Queries                         │
│                            │ (PostgreSQL Protocol)               │
└────────────────────────────┼─────────────────────────────────────┘
                             │
                             ▼
                   ┌──────────────────────┐
                   │   Neon PostgreSQL    │
                   │   (Cloud Database)   │
                   │                      │
                   │  Tables:             │
                   │  - courses           │
                   │  - modules           │
                   │  - lessons           │
                   │  - profiles          │
                   │  - user_progress     │
                   └──────────────────────┘
```

---

## 📁 Estrutura de Pastas

```
app-cursos-jofurlan-bolt/
│
├── app/                          # React Native App (existente)
├── components/
├── contexts/
├── lib/
│   ├── api.ts                    # ✨ NOVO: Cliente HTTP para Backend
│   ├── neon.ts                   # ❌ REMOVER: Não usa mais no mobile
│   └── data.ts                   # ❌ REMOVER: Lógica vai para backend
│
├── backend/                      # ✨ NOVO: Backend API
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.ts       # Configuração Neon DB
│   │   │   └── env.ts            # Validação de env vars
│   │   │
│   │   ├── routes/
│   │   │   ├── index.ts          # Agregador de rotas
│   │   │   ├── courses.ts        # GET /api/courses
│   │   │   ├── lessons.ts        # GET /api/lessons/:id
│   │   │   ├── modules.ts        # GET /api/modules/:id
│   │   │   ├── auth.ts           # POST /api/auth/verify
│   │   │   └── progress.ts       # GET/POST /api/progress
│   │   │
│   │   ├── middleware/
│   │   │   ├── auth.ts           # Validação de JWT
│   │   │   ├── errorHandler.ts  # Error handling global
│   │   │   └── validate.ts       # Validação de request body
│   │   │
│   │   ├── services/
│   │   │   ├── courseService.ts  # Lógica de negócio - cursos
│   │   │   ├── lessonService.ts  # Lógica de negócio - lições
│   │   │   └── progressService.ts # Lógica de negócio - progresso
│   │   │
│   │   ├── types/
│   │   │   └── index.ts          # TypeScript types compartilhados
│   │   │
│   │   └── server.ts             # ⚡ Entry point do servidor
│   │
│   ├── .env                      # Variáveis de ambiente (não commitar)
│   ├── .env.example              # Exemplo de .env
│   ├── .gitignore
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md
│
├── BACKEND_IMPLEMENTATION_PLAN.md  # Este arquivo
└── package.json
```

---

## 🛠️ Stack Técnica

### Backend
| Tecnologia | Versão | Propósito |
|------------|--------|-----------|
| **Node.js** | 18+ | Runtime JavaScript |
| **Express** | ^4.18 | Framework web |
| **TypeScript** | ^5.3 | Tipagem estática |
| **@neondatabase/serverless** | ^0.9 | Cliente Neon DB |
| **Zod** | ^3.22 | Validação de schemas |
| **cors** | ^2.8 | CORS middleware |
| **dotenv** | ^16.4 | Env vars management |
| **tsx** | ^4.7 | TypeScript execution |
| **nodemon** | ^3.0 | Hot reload em dev |

### Frontend (mantém)
- React Native 0.79
- Expo ~53.0
- TypeScript ~5.8
- Expo Router ~3.5

---

## 🌐 Endpoints da API

### Autenticação
```
POST   /api/auth/verify
Body: { token: string }
Response: { valid: boolean, userId: string }
```

### Cursos
```
GET    /api/courses
Query: ?featured=true&inProgress=true&search=keyword
Response: Course[]

GET    /api/courses/:id
Params: id (number)
Response: Course (com modules e lessons)
```

### Módulos
```
GET    /api/modules/:id
Params: id (number)
Response: Module (com lessons)
```

### Lições
```
GET    /api/lessons/:id
Params: id (number)
Response: Lesson

GET    /api/lessons/:id/next
Response: Lesson | null

GET    /api/lessons/:id/previous
Response: Lesson | null
```

### Progresso
```
GET    /api/progress
Headers: Authorization: Bearer <token>
Response: { completedLessons: number[], courseProgress: {...} }

POST   /api/progress
Headers: Authorization: Bearer <token>
Body: { lessonId: number, completed: boolean }
Response: { success: boolean }

GET    /api/progress/course/:courseId
Response: { percentage: number, completedLessons: number }
```

### Busca
```
GET    /api/search?q=javascript
Response: Course[]
```

---

## 📝 Planejamento Detalhado

### **FASE 1: Setup do Backend** ⏱️ 2-3 horas

#### Tarefa 1.1: Criar Estrutura Base
- [ ] Criar pasta `backend/` na raiz do projeto
- [ ] Inicializar projeto Node.js: `npm init -y`
- [ ] Criar estrutura de pastas (src, config, routes, middleware, services, types)
- [ ] Criar `.gitignore` para backend

**Comandos:**
```bash
mkdir backend
cd backend
npm init -y
mkdir -p src/{config,routes,middleware,services,types}
```

---

#### Tarefa 1.2: Instalar Dependências
- [ ] Instalar dependências de produção
- [ ] Instalar dependências de desenvolvimento
- [ ] Verificar instalação com `npm list`

**Comandos:**
```bash
# Produção
npm install express @neondatabase/serverless cors dotenv zod

# Desenvolvimento
npm install -D typescript @types/express @types/cors @types/node tsx nodemon

# Inicializar TypeScript
npx tsc --init
```

---

#### Tarefa 1.3: Configurar TypeScript
- [ ] Criar `tsconfig.json` otimizado
- [ ] Configurar paths para imports absolutos
- [ ] Configurar output para `dist/`

**Arquivo:** `backend/tsconfig.json`
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "moduleResolution": "node",
    "baseUrl": "./src",
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

---

#### Tarefa 1.4: Configurar Scripts NPM
- [ ] Adicionar scripts de dev, build, start
- [ ] Testar hot reload com nodemon

**Arquivo:** `backend/package.json` (scripts)
```json
{
  "scripts": {
    "dev": "nodemon --exec tsx src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "type-check": "tsc --noEmit"
  }
}
```

---

#### Tarefa 1.5: Configurar Variáveis de Ambiente
- [ ] Criar `.env.example` com template
- [ ] Criar `.env` com credenciais reais
- [ ] Criar `src/config/env.ts` para validação

**Arquivo:** `backend/.env.example`
```env
# Database
DATABASE_URL=postgresql://user:pass@host/db

# Server
PORT=3001
NODE_ENV=development

# Stack Auth (se necessário)
STACK_AUTH_PROJECT_ID=
STACK_AUTH_SECRET_KEY=
```

**Arquivo:** `backend/src/config/env.ts`
```typescript
import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  PORT: z.string().default('3001'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

export const env = envSchema.parse(process.env);
```

---

#### Tarefa 1.6: Configurar Conexão com Neon
- [ ] Criar `src/config/database.ts`
- [ ] Mover lógica de `lib/neon.ts` para backend
- [ ] Testar conexão com query simples

**Arquivo:** `backend/src/config/database.ts`
```typescript
import { neon } from '@neondatabase/serverless';
import { env } from './env';

export const sql = neon(env.DATABASE_URL);

// Test connection
export async function testConnection() {
  try {
    const result = await sql`SELECT NOW()`;
    console.log('✅ Database connected:', result[0].now);
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
}
```

---

#### Tarefa 1.7: Criar Servidor Express Base
- [ ] Criar `src/server.ts` com setup básico
- [ ] Configurar CORS
- [ ] Adicionar middleware de parsing JSON
- [ ] Criar rota de health check
- [ ] Testar servidor rodando

**Arquivo:** `backend/src/server.ts`
```typescript
import express from 'express';
import cors from 'cors';
import { env } from '@/config/env';
import { testConnection } from '@/config/database';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
const PORT = parseInt(env.PORT);

app.listen(PORT, async () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  await testConnection();
});
```

**Teste:**
```bash
cd backend
npm run dev
# Acessar: http://localhost:3001/health
```

---

### **FASE 2: Migrar Lógica de Dados** ⏱️ 3-4 horas

#### Tarefa 2.1: Criar Services Layer
- [ ] Criar `src/services/courseService.ts`
- [ ] Migrar funções de `lib/data.ts` para courseService
- [ ] Otimizar queries N+1 com JOINs eficientes
- [ ] Adicionar tratamento de erros

**Arquivo:** `backend/src/services/courseService.ts`
```typescript
import { sql } from '@/config/database';
import { Course } from '@/types';

export class CourseService {
  async getAllCourses(): Promise<Course[]> {
    const courses = await sql`SELECT * FROM courses ORDER BY id`;
    return courses as Course[];
  }

  async getFeaturedCourses(): Promise<Course[]> {
    const courses = await sql`
      SELECT * FROM courses 
      WHERE featured = true 
      ORDER BY id
    `;
    return courses as Course[];
  }

  async getCourseById(id: number): Promise<Course | null> {
    // TODO: Implementar com JOIN otimizado (sem N+1)
  }

  async searchCourses(query: string): Promise<Course[]> {
    const courses = await sql`
      SELECT * FROM courses 
      WHERE title ILIKE ${'%' + query + '%'} 
         OR description ILIKE ${'%' + query + '%'}
    `;
    return courses as Course[];
  }
}
```

---

#### Tarefa 2.2: Criar Lesson Service
- [ ] Criar `src/services/lessonService.ts`
- [ ] Implementar getLesson, getNextLesson, getPreviousLesson
- [ ] Corrigir lógica de navegação entre lições

**Arquivo:** `backend/src/services/lessonService.ts`
```typescript
import { sql } from '@/config/database';

export class LessonService {
  async getLessonById(id: number) {
    const lessons = await sql`SELECT * FROM lessons WHERE id = ${id}`;
    return lessons[0] || null;
  }

  async getNextLesson(currentLessonId: number, moduleId: number) {
    // TODO: Implementar com ORDER correto
  }

  async getPreviousLesson(currentLessonId: number, moduleId: number) {
    // TODO: Implementar com ORDER correto
  }
}
```

---

#### Tarefa 2.3: Criar Progress Service
- [ ] Criar `src/services/progressService.ts`
- [ ] Implementar funções de progresso do usuário
- [ ] Calcular porcentagens de conclusão

**Arquivo:** `backend/src/services/progressService.ts`
```typescript
export class ProgressService {
  async getUserProgress(userId: string) {
    // Buscar progresso do usuário
  }

  async markLessonComplete(userId: string, lessonId: number) {
    // Marcar lição como completa
  }

  async getCourseProgress(userId: string, courseId: number) {
    // Calcular % de progresso do curso
  }
}
```

---

#### Tarefa 2.4: Criar Types Compartilhados
- [ ] Copiar types de `/types` para `backend/src/types`
- [ ] Adicionar types específicos da API (Request/Response)

---

### **FASE 3: Criar Rotas da API** ⏱️ 2-3 horas

#### Tarefa 3.1: Criar Rota de Cursos
- [ ] Criar `src/routes/courses.ts`
- [ ] Implementar GET /api/courses
- [ ] Implementar GET /api/courses/:id
- [ ] Adicionar validação de params

**Arquivo:** `backend/src/routes/courses.ts`
```typescript
import { Router } from 'express';
import { CourseService } from '@/services/courseService';

const router = Router();
const courseService = new CourseService();

router.get('/', async (req, res) => {
  try {
    const { featured, search } = req.query;
    
    let courses;
    if (featured === 'true') {
      courses = await courseService.getFeaturedCourses();
    } else if (search) {
      courses = await courseService.searchCourses(search as string);
    } else {
      courses = await courseService.getAllCourses();
    }
    
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const course = await courseService.getCourseById(id);
    
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    
    res.json(course);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch course' });
  }
});

export default router;
```

---

#### Tarefa 3.2: Criar Rotas de Lessons e Modules
- [ ] Criar `src/routes/lessons.ts`
- [ ] Criar `src/routes/modules.ts`
- [ ] Implementar endpoints

---

#### Tarefa 3.3: Criar Rota de Progress
- [ ] Criar `src/routes/progress.ts`
- [ ] Adicionar middleware de autenticação
- [ ] Implementar GET e POST para progresso

---

#### Tarefa 3.4: Integrar Rotas no Server
- [ ] Criar `src/routes/index.ts` para agregar rotas
- [ ] Montar rotas no server.ts com prefixo `/api`

**Arquivo:** `backend/src/routes/index.ts`
```typescript
import { Router } from 'express';
import coursesRouter from './courses';
import lessonsRouter from './lessons';
import modulesRouter from './modules';
import progressRouter from './progress';

const router = Router();

router.use('/courses', coursesRouter);
router.use('/lessons', lessonsRouter);
router.use('/modules', modulesRouter);
router.use('/progress', progressRouter);

export default router;
```

**Atualizar:** `backend/src/server.ts`
```typescript
import apiRoutes from '@/routes';
app.use('/api', apiRoutes);
```

---

### **FASE 4: Middleware e Segurança** ⏱️ 1-2 horas

#### Tarefa 4.1: Criar Middleware de Autenticação
- [ ] Criar `src/middleware/auth.ts`
- [ ] Validar tokens Stack Auth
- [ ] Adicionar userId ao request

---

#### Tarefa 4.2: Criar Error Handler Global
- [ ] Criar `src/middleware/errorHandler.ts`
- [ ] Capturar erros não tratados
- [ ] Retornar respostas padronizadas

---

#### Tarefa 4.3: Adicionar Validação de Schemas
- [ ] Criar `src/middleware/validate.ts`
- [ ] Usar Zod para validar request bodies

---

### **FASE 5: Refatorar App Mobile** ⏱️ 2-3 horas

#### Tarefa 5.1: Criar Cliente HTTP
- [ ] Criar `lib/api.ts` no app mobile
- [ ] Configurar base URL da API
- [ ] Criar funções de fetch para cada endpoint

**Arquivo:** `lib/api.ts`
```typescript
const API_URL = __DEV__ 
  ? 'http://localhost:3001/api' 
  : 'https://seu-backend.vercel.app/api';

export const api = {
  courses: {
    getAll: async () => {
      const res = await fetch(`${API_URL}/courses`);
      return res.json();
    },
    getById: async (id: number) => {
      const res = await fetch(`${API_URL}/courses/${id}`);
      return res.json();
    },
  },
  lessons: {
    getById: async (id: number) => {
      const res = await fetch(`${API_URL}/lessons/${id}`);
      return res.json();
    },
  },
  progress: {
    get: async (token: string) => {
      const res = await fetch(`${API_URL}/progress`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.json();
    },
    markComplete: async (token: string, lessonId: number) => {
      const res = await fetch(`${API_URL}/progress`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ lessonId, completed: true }),
      });
      return res.json();
    },
  },
};
```

---

#### Tarefa 5.2: Remover Código Antigo
- [ ] Deletar `lib/neon.ts`
- [ ] Deletar `lib/data.ts`
- [ ] Remover imports de `postgres` do package.json mobile

---

#### Tarefa 5.3: Atualizar Contexts
- [ ] Refatorar `ProgressContext` para usar API
- [ ] Atualizar chamadas de funções

---

#### Tarefa 5.4: Atualizar Screens
- [ ] Atualizar `app/(tabs)/index.tsx` para usar api
- [ ] Atualizar `app/(tabs)/courses.tsx`
- [ ] Atualizar `app/course/[id].tsx`
- [ ] Atualizar `app/lesson/[id].tsx`

---

### **FASE 6: Testes e Debugging** ⏱️ 1-2 horas

#### Tarefa 6.1: Testar Endpoints
- [ ] Instalar Insomnia/Postman
- [ ] Criar collection de requests
- [ ] Testar todos os endpoints
- [ ] Documentar responses

---

#### Tarefa 6.2: Testar Integração Mobile
- [ ] Rodar backend e app simultaneamente
- [ ] Testar fluxo completo de navegação
- [ ] Verificar tratamento de erros
- [ ] Testar em diferentes estados (sem conexão, etc)

---

#### Tarefa 6.3: Debugging
- [ ] Adicionar logs úteis no backend
- [ ] Configurar error reporting
- [ ] Testar edge cases

---

### **FASE 7: Deploy** ⏱️ 1 hora

#### Tarefa 7.1: Preparar Backend para Deploy
- [ ] Criar `backend/README.md` com instruções
- [ ] Verificar variáveis de ambiente
- [ ] Testar build: `npm run build`

---

#### Tarefa 7.2: Deploy no Vercel (ou Railway)
- [ ] Criar conta Vercel/Railway
- [ ] Conectar repositório
- [ ] Configurar variáveis de ambiente
- [ ] Deploy

**Vercel:**
```bash
npm i -g vercel
cd backend
vercel
```

---

#### Tarefa 7.3: Atualizar App para Produção
- [ ] Atualizar API_URL em `lib/api.ts`
- [ ] Testar app com backend em produção

---

## 🚀 Como Rodar

### Desenvolvimento Local

#### 1. Backend
```bash
cd backend
npm install
cp .env.example .env
# Editar .env com credenciais Neon
npm run dev
# Backend rodando em http://localhost:3001
```

#### 2. App Mobile
```bash
# Na raiz do projeto
npm install
npm run dev
# Expo rodando em http://localhost:8081
```

#### 3. Testar
- Abrir app no celular/emulador
- Backend deve estar rodando simultaneamente
- Verificar logs de ambos os terminais

---

## ✅ Checklist de Progresso

### Fase 1: Setup do Backend
- [ ] 1.1 Criar estrutura base
- [ ] 1.2 Instalar dependências
- [ ] 1.3 Configurar TypeScript
- [ ] 1.4 Configurar scripts NPM
- [ ] 1.5 Configurar variáveis de ambiente
- [ ] 1.6 Configurar conexão Neon
- [ ] 1.7 Criar servidor Express base

### Fase 2: Migrar Lógica
- [ ] 2.1 Criar CourseService
- [ ] 2.2 Criar LessonService
- [ ] 2.3 Criar ProgressService
- [ ] 2.4 Criar types compartilhados

### Fase 3: Criar Rotas
- [ ] 3.1 Rota de cursos
- [ ] 3.2 Rotas de lessons e modules
- [ ] 3.3 Rota de progress
- [ ] 3.4 Integrar rotas no server

### Fase 4: Middleware
- [ ] 4.1 Middleware de autenticação
- [ ] 4.2 Error handler global
- [ ] 4.3 Validação de schemas

### Fase 5: Refatorar Mobile
- [ ] 5.1 Criar cliente HTTP
- [ ] 5.2 Remover código antigo
- [ ] 5.3 Atualizar contexts
- [ ] 5.4 Atualizar screens

### Fase 6: Testes
- [ ] 6.1 Testar endpoints
- [ ] 6.2 Testar integração mobile
- [ ] 6.3 Debugging

### Fase 7: Deploy
- [ ] 7.1 Preparar backend
- [ ] 7.2 Deploy (Vercel/Railway)
- [ ] 7.3 Atualizar app para produção

---

## 📊 Estimativa de Tempo Total

| Fase | Tempo Estimado |
|------|----------------|
| Fase 1: Setup Backend | 2-3 horas |
| Fase 2: Migrar Lógica | 3-4 horas |
| Fase 3: Criar Rotas | 2-3 horas |
| Fase 4: Middleware | 1-2 horas |
| Fase 5: Refatorar Mobile | 2-3 horas |
| Fase 6: Testes | 1-2 horas |
| Fase 7: Deploy | 1 hora |
| **TOTAL** | **12-18 horas** |

---

## 📝 Notas Importantes

### Decisões de Arquitetura
- Usar `@neondatabase/serverless` ao invés de `postgres` (compatível com edge)
- Services layer para separar lógica de negócio das rotas
- Middleware de autenticação centralizado
- Error handling consistente em toda API

### Segurança
- ✅ Credenciais do DB apenas no backend
- ✅ Validação de entrada com Zod
- ✅ CORS configurado corretamente
- ✅ Autenticação em rotas protegidas

### Performance
- Otimizar queries N+1 com JOINs
- Considerar cache para dados estáticos (cursos)
- Pagination para listas grandes

### Próximos Passos (Pós-MVP)
- [ ] Adicionar testes automatizados (Jest)
- [ ] Implementar rate limiting
- [ ] Adicionar logging estruturado (Pino/Winston)
- [ ] Monitoramento (Sentry, New Relic)
- [ ] CI/CD pipeline
- [ ] Documentação OpenAPI/Swagger

---

**Última Atualização:** 15/10/2025  
**Status:** Pronto para implementação 🚀
