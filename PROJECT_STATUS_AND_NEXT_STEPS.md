# Status do Projeto e Próximos Passos

Este documento resume o estado atual do projeto após a tentativa de migração para o Neon e descreve as ações necessárias para torná-lo funcional.

## Objetivo da Migração

O objetivo era migrar a aplicação de um backend Supabase para um backend Neon, utilizando o Neon DB para o banco de dados e o Neon Auth para autenticação.

## Impasse Técnico e Estado Atual

**A aplicação não está funcional no estado atual.**

O principal problema é a incompatibilidade entre as bibliotecas de cliente PostgreSQL e o ambiente do React Native / Expo, especialmente na plataforma web.

1.  **Incompatibilidade da Biblioteca:** A biblioteca `postgres` foi utilizada para tentar conectar a aplicação diretamente ao banco de dados Neon. No entanto, esta biblioteca é projetada para ambientes de servidor (Node.js) e depende de módulos nativos (como `Buffer`) que não existem no React Native. Tentativas de contornar isso com polyfills não tiveram sucesso.

2.  **Risco de Segurança:** Mais importante, conectar uma aplicação móvel diretamente a um banco de dados é uma prática de segurança **altamente não recomendada**. Isso expõe as credenciais do banco de dados no lado do cliente, criando uma vulnerabilidade de segurança grave.

3.  **Estado do Código:**
    *   **Banco de Dados:** O schema e os dados foram migrados com sucesso para o Neon DB.
    *   **Autenticação:** A autenticação foi parcialmente migrada para o `@stackframe/react`, mas a aplicação está quebrada devido ao problema de conexão com o banco de dados.
    *   **Código da Aplicação:** O código foi refatorado para usar a biblioteca `postgres`, o que está causando o erro `Buffer is not defined` e impedindo a aplicação de funcionar.

## Próximos Passos Necessários

Para que o projeto volte a ser funcional, uma das duas abordagens a seguir deve ser adotada:

### Opção 1: Construir uma API de Backend (Recomendado)

Esta é a abordagem padrão e mais segura para arquiteturas de aplicações móveis.

- **Ação:** Desenvolver uma API de backend simples (por exemplo, usando Node.js com Express, ou uma solução Serverless como Vercel Functions ou AWS Lambda).
- **Como Funciona:**
  1.  A API será responsável por se conectar de forma segura ao banco de dados Neon.
  2.  A API exporá endpoints (ex: `/api/courses`, `/api/lessons/:id`).
  3.  A aplicação React Native fará chamadas HTTP para esses endpoints para buscar e enviar dados.
- **Vantagens:** É uma arquitetura segura, escalável e padrão da indústria.

### Opção 2: Reverter a Migração e Voltar para o Supabase

Esta é a abordagem mais rápida para ter a aplicação funcionando novamente, utilizando a configuração original.

- **Ação:** Reverter todos os commits e alterações feitas durante esta sessão de migração.
- **Como Funciona:** O código voltará ao seu estado original, utilizando o Supabase como backend, que já fornece a camada de API segura e as bibliotecas de cliente compatíveis com React Native.
- **Vantagens:** Rapidez para restaurar a funcionalidade completa do projeto.
