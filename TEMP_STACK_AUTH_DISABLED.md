# ⚠️ TEMPORÁRIO: Stack Auth Desabilitado

## 🐛 Problema

Stack Auth continua com erro "Invalid token store" na web, mesmo após múltiplas tentativas de correção.

## 🔧 Solução Temporária

**Para permitir testes do resto do app**, desabilitei temporariamente o Stack Auth:

### Arquivo: `contexts/ProgressContext.tsx`

```typescript
// TEMPORÁRIO: Mock user para testes
// const user = useUser(); // ← Comentado
const user = { id: 'test-user-123' }; // ← Mock
```

## ✅ O que funciona agora

Com o mock:
- ✅ App abre sem erros
- ✅ Backend API funciona
- ✅ Telas carregam dados
- ✅ Navegação funciona
- ❌ Autenticação real (mas não precisa para testar)

## 🔄 Para reativar Stack Auth depois

1. **Descomente em `contexts/ProgressContext.tsx`:**
```typescript
const user = useUser(); // ← Descomentar
// const user = { id: 'test-user-123' }; // ← Comentar ou remover
```

2. **Ou teste em mobile (iOS/Android):**
   - Stack Auth funciona melhor em mobile
   - SecureStore funciona corretamente lá

## 📝 Próximos passos

1. **Agora:** Teste o app sem autenticação
   - Navegue pelos cursos
   - Teste o backend
   - Veja se tudo carrega

2. **Depois:** Resolva Stack Auth
   - Considere usar outro provider de auth (Firebase, Supabase)
   - Ou teste Stack Auth em mobile nativo
   - Ou atualize versão do Stack Auth

## 🚀 Como testar agora

```bash
# Recarregue a página
Ctrl+Shift+R

# Deve abrir sem erros!
```

---

**Status:** App funcionando em modo de teste (sem autenticação real)
