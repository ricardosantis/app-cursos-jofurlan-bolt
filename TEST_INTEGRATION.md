# Teste de Integração Local

## ✅ Backend Rodando

**Status:** ✅ ONLINE  
**URL:** http://localhost:3001  
**PID:** Verificar com `ps aux | grep "tsx src/server.ts"`

### Endpoints Testados:
- ✅ `GET /health` - OK
- ✅ `GET /api/courses` - Lista 4 cursos
- ✅ `GET /api/courses/1` - Retorna curso com módulos e lições
- ✅ `GET /api/lessons/1` - Retorna lição
- ❌ `GET /api/courses?search=cerebro` - Busca vazia (case sensitive issue)

### Logs do Backend:
```
🚀 Server running on http://localhost:3001
✅ Database connected
```

---

## 🔧 App Mobile - Preparação

### Erros de Lint Corrigidos:
- ✅ Imports faltando em `app/_layout.tsx`
- ⚠️ Warnings menores restantes (não bloqueiam)

### Próximos Passos:

1. **Iniciar Expo:**
```bash
npm run dev
```

2. **Testar Fluxo Completo:**
   - Abrir app no celular/emulador
   - Verificar se lista de cursos carrega
   - Clicar em um curso
   - Verificar se módulos e lições aparecem
   - Tentar marcar uma lição como completa

3. **Monitorar Logs:**
   - Terminal do backend (ver requisições)
   - Terminal do Expo (ver erros do app)

---

## 🐛 Issues Conhecidas

### Backend:
- ⚠️ Busca case-sensitive (procurar "cerebro" não encontra "Cérebro")
  - **Fix:** Alterar query para usar `LOWER()` ou normalizar acentos

### Mobile:
- ⚠️ Warnings de deps do useEffect (não crítico)
- ⚠️ NotificationContext pode não existir ainda

---

## 📝 Comandos Úteis

### Backend:
```bash
cd backend
npm run dev        # Iniciar
pkill -f tsx      # Parar
tail -f /tmp/backend-test.log  # Ver logs
```

### Mobile:
```bash
npm run dev       # Iniciar Expo
npm run lint      # Verificar erros
```

### Testes manuais via cURL:
```bash
# Health check
curl http://localhost:3001/health

# Lista cursos
curl http://localhost:3001/api/courses

# Curso específico
curl http://localhost:3001/api/courses/1

# Busca
curl "http://localhost:3001/api/courses?search=bem"

# Lição
curl http://localhost:3001/api/lessons/1
```

---

## ✅ Checklist de Teste

### Backend:
- [x] Servidor iniciado
- [x] Conexão com Neon OK
- [x] Endpoints respondendo
- [x] Dados corretos retornados

### Mobile (A TESTAR):
- [ ] App inicia sem erros
- [ ] Home carrega cursos featured
- [ ] Lista de cursos funciona
- [ ] Busca funciona
- [ ] Abrir curso mostra módulos
- [ ] Abrir lição mostra conteúdo
- [ ] Navegação next/previous funciona
- [ ] Marcar lição completa funciona
- [ ] Progresso é salvo e recuperado

---

**Status Geral:** Backend OK, pronto para testar Mobile
