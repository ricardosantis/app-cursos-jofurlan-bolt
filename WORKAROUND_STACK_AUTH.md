# Workaround: Stack Auth na Web

## 🐛 Problema

Stack Auth tem issues com tokenStore customizado na web quando usa `expo-secure-store`.

## ✅ Solução Aplicada

### 1. Remover tokenStore na web

Stack Auth tem seu próprio tokenStore padrão para web que usa `localStorage` internamente.

**Arquivo:** `lib/stack.ts`

```typescript
export const stackClientApp = new StackClientApp({
  projectId: process.env.EXPO_PUBLIC_STACK_PROJECT_ID!,
  publishableClientKey: process.env.EXPO_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY!,
  ...(Platform.OS === 'web' ? {} : { tokenStore }), // Só mobile usa tokenStore customizado
  redirectMethod: (path) => {
    router.replace(path);
  },
});
```

### 2. Comportamento

- **Web:** Usa o tokenStore padrão do Stack Auth (localStorage interno)
- **Mobile:** Usa SecureStore para segurança extra

## 🔄 Como Testar

1. **Limpar cache:**
```bash
rm -rf .expo node_modules/.cache
```

2. **Reiniciar:**
```bash
npm run dev:all
```

3. **Hard refresh no browser:**
- Ctrl+Shift+R (Linux/Windows)
- Cmd+Shift+R (Mac)

## 📝 Notas

- Stack Auth gerencia tokens automaticamente na web
- Não precisa de tokenStore customizado para web
- Mobile continua usando SecureStore para maior segurança
