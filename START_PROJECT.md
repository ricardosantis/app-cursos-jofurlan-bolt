# 🚀 Como Rodar o Projeto EduCourse

## ⚡ Start Rápido (Tudo de uma vez)

```bash
npm run dev:all
```

Esse comando inicia:
- ✅ Backend API na porta 3001
- ✅ Expo Dev Server na porta 8081

---

## 📦 Comandos Disponíveis

### Desenvolvimento:
```bash
# Rodar backend + mobile juntos (RECOMENDADO)
npm run dev:all

# Rodar apenas o mobile (Expo)
npm run dev
# ou
npm run dev:mobile

# Rodar apenas o backend
npm run dev:backend
```

### Build:
```bash
# Build web
npm run build:web

# Build backend
cd backend && npm run build
```

### Lint:
```bash
npm run lint
```

---

## 🔧 Setup Inicial (Primeira vez)

### 1. Instalar dependências:
```bash
# Raiz do projeto
npm install

# Backend
cd backend
npm install
cd ..
```

### 2. Configurar variáveis de ambiente:

**Backend** (`backend/.env`):
```env
DATABASE_URL=sua-connection-string-neon
PORT=3001
NODE_ENV=development
```

**Mobile** (`.env` na raiz):
```env
EXPO_PUBLIC_STACK_PROJECT_ID=seu-stack-project-id
EXPO_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY=sua-stack-key
STACK_SECRET_SERVER_KEY=seu-secret-key
```

### 3. Iniciar o projeto:
```bash
npm run dev:all
```

---

## 📱 Acessar o App

Após rodar `npm run dev:all`, você verá 2 logs:

### Backend (Azul):
```
🚀 Server running on http://localhost:3001
✅ Database connected
```

### Mobile (Verde):
```
› Metro waiting on http://localhost:8081
› Scan the QR code above with Expo Go (Android) or the Camera app (iOS)
```

### Opções para acessar:

1. **Expo Go (Celular):**
   - Instale o app Expo Go
   - Escaneie o QR code

2. **Emulador Android:**
   - Pressione `a` no terminal

3. **Emulador iOS:**
   - Pressione `i` no terminal

4. **Web Browser:**
   - Pressione `w` no terminal
   - Ou acesse: http://localhost:8081

---

## 🛑 Parar o Projeto

Como ambos processos rodam juntos, basta pressionar **Ctrl+C** no terminal e ambos param.

Ou manualmente:
```bash
# Parar processos
pkill -f "tsx src/server.ts"  # Backend
pkill -f "expo start"         # Expo
```

---

## 📊 Verificar Status

### Backend:
```bash
curl http://localhost:3001/health
# Deve retornar: {"status":"ok","timestamp":"..."}
```

### Expo:
```bash
curl http://localhost:8081/status
# Deve retornar: packager-status:running
```

### Processos rodando:
```bash
ps aux | grep -E "tsx|expo" | grep -v grep
```

---

## 🐛 Troubleshooting

### "Porta 3001 já está em uso"
```bash
pkill -f "tsx src/server.ts"
# Ou
lsof -ti:3001 | xargs kill -9
```

### "Porta 8081 já está em uso"
```bash
pkill -f "expo start"
# Ou
lsof -ti:8081 | xargs kill -9
```

### "Backend não conecta ao Neon"
- Verificar se DATABASE_URL está correto em `backend/.env`
- Testar conexão: `cd backend && node -e "require('dotenv').config(); console.log(process.env.DATABASE_URL)"`

### "App não faz requisições ao backend"
- Verificar se backend está rodando: `curl http://localhost:3001/health`
- Verificar URL da API em `lib/api.ts` (deve ser `http://localhost:3001/api` em dev)

---

## 📝 Estrutura de Logs

Ao rodar `npm run dev:all`, você verá logs coloridos:

```
[BACKEND] 🚀 Server running on http://localhost:3001
[BACKEND] ✅ Database connected
[MOBILE]  › Metro waiting on http://localhost:8081
[MOBILE]  › Scan the QR code above
```

- **Azul** = Backend
- **Verde** = Mobile

---

## 🎯 Próximos Passos

Após iniciar com sucesso:

1. ✅ Verificar que backend responde em http://localhost:3001/health
2. ✅ Abrir app no celular/emulador
3. ✅ Fazer login
4. ✅ Testar navegação pelos cursos
5. ✅ Verificar se progresso é salvo

---

## 📚 Documentação

- [AGENTS.md](./AGENTS.md) - Comandos e convenções
- [BACKEND_IMPLEMENTATION_PLAN.md](./BACKEND_IMPLEMENTATION_PLAN.md) - Arquitetura do backend
- [MIGRATION_COMPLETE.md](./MIGRATION_COMPLETE.md) - Detalhes da migração
- [backend/README.md](./backend/README.md) - Docs específicos do backend

---

**Dúvidas?** Consulte os arquivos de documentação ou os logs dos processos.
