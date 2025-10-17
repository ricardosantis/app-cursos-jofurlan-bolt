# Issue: Stack Auth - Invalid Token Store

## ❌ Erro Encontrado

```
Uncaught Error: Invalid token store [object Object]
```

**Localização:** `contexts/ProgressContext.tsx:28:23`  
**Causa:** O `useUser()` do Stack Auth está falhando

---

## 🔍 Diagnóstico

O erro ocorre porque:

1. **Token Store retornava `undefined`** em vez de `null`
   - Stack Auth espera `null` quando não há token
   - ✅ **CORRIGIDO** em `lib/stack.ts`

2. **Possível falta de variáveis de ambiente**
   - As variáveis do Stack Auth podem não estar configuradas
   - Verifique o arquivo `.env`

---

## ✅ Correções Aplicadas

### 1. Token Store retorna null (primeira correção)

**Problema:** Stack Auth espera `null` quando não há token, não `undefined`.

### 2. Token Store para Web (segunda correção - PRINCIPAL)

**Problema:** `expo-secure-store` NÃO funciona na web! Ele só funciona em iOS/Android.

**Solução:** Detectar plataforma e usar storage apropriado:

**Arquivo:** `lib/stack.ts`
```typescript
const tokenStore = {
  async get() {
    try {
      if (Platform.OS === 'web') {
        // Web: usa localStorage
        const token = localStorage.getItem('stack_token');
        return token || null;
      } else {
        // Mobile: usa SecureStore
        const token = await SecureStore.getItemAsync('stack_token');
        return token || null;
      }
    } catch (error) {
      return null;
    }
  },
  // ... set e delete também verificam Platform.OS
};
```

---

## 🔧 Verificar Configuração

### 1. Variáveis de Ambiente

Verifique se o arquivo `.env` na raiz do projeto contém:

```env
EXPO_PUBLIC_STACK_PROJECT_ID=seu-project-id-aqui
EXPO_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY=sua-key-aqui
STACK_SECRET_SERVER_KEY=seu-secret-aqui
```

### 2. Como obter as credenciais Stack Auth

1. Acesse https://stack-auth.com/
2. Crie um projeto ou acesse o existente
3. Copie as credenciais da dashboard
4. Cole no arquivo `.env`

### 3. Reiniciar o app

Após configurar as variáveis:

```bash
# Parar tudo
pkill -f "tsx src/server"
pkill -f "expo start"

# Reiniciar
npm run dev:all
```

---

## 🚨 Alternativa: Desabilitar Stack Auth Temporariamente

Se você não precisa de autenticação agora, pode comentar temporariamente:

### Em `app/_layout.tsx`:

**Comentar StackProvider:**
```typescript
return (
  <GestureHandlerRootView style={{ flex: 1 }}>
    {/* <StackProvider app={stackClientApp}> */}
    {/*   <StackTheme> */}
          <ProgressProvider>
            <NotificationProvider>
              <Stack screenOptions={{ headerShown: false }}>
                {/* ... */}
              </Stack>
            </NotificationProvider>
          </ProgressProvider>
    {/*   </StackTheme> */}
    {/* </StackProvider> */}
  </GestureHandlerRootView>
);
```

### Em `contexts/ProgressContext.tsx`:

**Mockear o user:**
```typescript
// const user = useUser(); // Comentar
const user = { id: 'test-user' }; // Mock temporário
```

---

## 📝 Checklist

- [x] Corrigir tokenStore em `lib/stack.ts`
- [ ] Verificar variáveis de ambiente no `.env`
- [ ] Obter credenciais do Stack Auth (se necessário)
- [ ] Reiniciar o app
- [ ] Testar login

---

## 💡 Solução Recomendada

1. **Se você tem as credenciais Stack Auth:**
   - Configure o `.env` corretamente
   - Reinicie o app

2. **Se você NÃO tem credenciais Stack Auth:**
   - Crie uma conta em https://stack-auth.com/
   - Crie um projeto
   - Configure o `.env`
   
3. **Para testar SEM autenticação:**
   - Comente o StackProvider
   - Mocke o user no ProgressContext
   - Isso permite testar o resto do app

---

**Status:** ✅ Token Store corrigido, aguardando configuração do .env
