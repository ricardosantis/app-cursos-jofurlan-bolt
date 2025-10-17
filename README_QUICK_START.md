# 🚀 Quick Start - EduCourse

## ⚡ Um comando para rodar tudo:

```bash
npm run dev:all
```

Isso inicia:
- ✅ **Backend API** (localhost:3001)
- ✅ **Expo Dev Server** (localhost:8081)

---

## 📺 O que você verá:

```
[BACKEND] 🚀 Server running on http://localhost:3001
[BACKEND] ✅ Database connected
[MOBILE]  › Metro waiting on http://localhost:8081
[MOBILE]  › Scan the QR code above
```

- **Azul** = Backend logs
- **Verde** = Mobile logs

---

## 📱 Abrir o App:

### Opção 1: Celular (Expo Go)
1. Instale o **Expo Go** no celular
2. Escaneie o QR code

### Opção 2: Emulador
- **Android**: Pressione `a` no terminal
- **iOS**: Pressione `i` no terminal

### Opção 3: Web Browser
- Pressione `w` no terminal
- Ou acesse: http://localhost:8081

---

## 🛑 Parar tudo:

Pressione **Ctrl+C** no terminal (uma vez para parar ambos)

---

## 📝 Outros comandos:

```bash
# Apenas mobile
npm run dev
# ou
npm run dev:mobile

# Apenas backend
npm run dev:backend

# Build web
npm run build:web

# Lint
npm run lint
```

---

## 🔍 Verificar se está funcionando:

```bash
# Backend
curl http://localhost:3001/health

# Expo
curl http://localhost:8081/status
```

---

## 📚 Documentação completa:

- [START_PROJECT.md](./START_PROJECT.md) - Guia detalhado
- [AGENTS.md](./AGENTS.md) - Comandos e convenções
- [MIGRATION_COMPLETE.md](./MIGRATION_COMPLETE.md) - Detalhes técnicos

---

**Pronto para usar!** 🎉
