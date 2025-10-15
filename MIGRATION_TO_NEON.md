# Migração de Supabase para Neon

Este documento descreve as alterações realizadas para migrar a aplicação de Supabase para Neon, utilizando Neon Auth (com Stack Auth) para autenticação e Neon DB para o banco de dados.

## Visão Geral das Alterações

A migração envolveu a substituição completa da infraestrutura de backend, movendo tanto a autenticação quanto o banco de dados do Supabase para o Neon.

## 1. Banco de Dados (Neon DB)

- **Projeto Neon:** Um novo projeto foi criado no Neon para hospedar o banco de dados PostgreSQL.
- **Schema do Banco de Dados:** O schema foi modelado e criado para suportar a estrutura de dados da aplicação. As seguintes tabelas foram criadas:
  - `courses`: Armazena os cursos.
  - `modules`: Armazena os módulos.
  - `lessons`: Armazena as lições.
  - `courses_modules`: Tabela de junção para a relação muitos-para-muitos entre cursos e módulos.
  - `modules_lessons`: Tabela de junção para a relação muitos-para-muitos entre módulos e lições.
  - `profiles`: Tabela para armazenar dados de perfil do usuário, ligada à tabela de autenticação.
  - `user_lesson_progress`: Armazena o progresso de conclusão das lições por usuário.
- **Migração de Dados:** Os dados que antes eram estáticos no arquivo `data/courses.ts` foram inseridos nas novas tabelas do banco de dados.

## 2. Autenticação (Neon Auth com Stack Auth)

- **Substituição do Supabase Auth:** A autenticação do Supabase foi substituída pelo Neon Auth, que é integrado com o Stack Auth (`@stackframe/react`).
- **Configuração:**
  - Um novo arquivo `.env` foi criado na raiz do projeto para armazenar as credenciais do Stack Auth.
  - O `AuthProvider` foi removido e o `StackProvider` foi configurado no layout raiz (`app/_layout.tsx`) para prover o contexto de autenticação para toda a aplicação.
- **Telas de Autenticação:**
  - As telas de `login` e `register` foram atualizadas para usar os componentes pré-construídos `<SignIn />` e `<SignUp />` do Stack Auth.
- **Remoção de Código Antigo:** Os arquivos `contexts/AuthContext.tsx` e `hooks/useAuth.ts` foram removidos.

## 3. Lógica da Aplicação

- **Conexão com o Banco de Dados:**
  - A biblioteca `postgres` foi instalada para permitir a conexão com o banco de dados Neon.
  - Um novo arquivo `lib/neon.ts` foi criado para configurar e exportar a instância de conexão com o banco de dados.
- **Busca de Dados:**
  - Um novo arquivo `lib/data.ts` foi criado para centralizar toda a lógica de busca de dados do banco de dados Neon.
  - Os componentes que antes consumiam dados estáticos (`app/(tabs)/index.tsx`, `app/(tabs)/courses.tsx`, `app/course/[id].tsx`, etc.) foram refatorados para usar as funções assíncronas de `lib/data.ts`.
- **Rastreamento de Progresso:**
  - O `ProgressContext` foi refatorado para buscar e salvar o progresso do usuário na tabela `user_lesson_progress` do banco de dados, em vez de usar o armazenamento local do dispositivo.

## 4. Ajustes Futuros e Pontos Pendentes (TODO)

- **Cálculo de Progresso:**
  - As funções de cálculo de porcentagem de progresso (`getCourseProgress`, `getOverallProgress`, etc.) no `ProgressContext.tsx` foram desativadas e estão retornando `0`.
  - **Ação Necessária:** É preciso implementar uma nova lógica que busque os dados necessários do banco de dados para calcular o progresso corretamente. Isso pode exigir consultas SQL mais complexas ou uma estratégia de cache para evitar problemas de performance.

- **Navegação entre Lições:**
  - As funções `getNextLesson` e `getPreviousLesson` em `lib/data.ts` foram implementadas de forma simplificada. Elas apenas buscam a lição com ID seguinte/anterior, sem levar em conta a ordem das lições dentro de um módulo.
  - **Ação Necessária:** A lógica precisa ser aprimorada para refletir a ordem correta das lições dentro de um módulo, possivelmente exigindo que o `module_id` seja passado como parâmetro ou que a estrutura de dados seja carregada de forma diferente.

- **Performance do Banco de Dados:**
  - A função `getCourseById` em `lib/data.ts` sofre do problema de "N+1 queries", onde múltiplas consultas são executadas em um loop, o que é ineficiente.
  - **Ação Necessária:** Para um ambiente de produção, é recomendado otimizar esta consulta, possivelmente usando `JOINs` mais complexos ou funções de agregação do PostgreSQL para buscar todos os dados necessários em uma única consulta.

- **Segurança da Conexão:**
  - Atualmente, a aplicação se conecta diretamente ao banco de dados a partir do cliente, o que expõe a string de conexão no código da aplicação. **Isso não é seguro para produção.**
  - **Ação Necessária:** É fortemente recomendado implementar uma camada de API (backend) que ficará entre a aplicação e o banco de dados. A aplicação fará chamadas para a API, e a API será responsável por se conectar de forma segura ao banco de dados.
