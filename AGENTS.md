# Agent Instructions for EduCourse

## Commands
- **Dev Full Stack**: `npm run dev:all` - Start both backend API + Expo (RECOMENDADO)
- **Dev Mobile Only**: `npm run dev` or `npm run dev:mobile` - Start Expo only
- **Dev Backend Only**: `npm run dev:backend` - Start backend API only
- **Build Web**: `npm run build:web` - Export web production build
- **Lint**: `npm run lint` - Run ESLint via Expo
- **No test runner configured** - No test scripts available

## Architecture
- **React Native + Expo** mobile app with Expo Router for file-based navigation
- **Supabase** for authentication and database (config in `lib/`)
- **Neon** database integration via `lib/neon.ts`
- **Stack Auth** integration via `lib/stack.ts`
- Contexts in `contexts/`: AuthContext, ProgressContext, NotificationContext
- Static course data in `data/courses.ts`
- Database migrations in `supabase/`

## Code Style
- **TypeScript strict mode** enabled
- **Prettier** config: 2 spaces, single quotes, no tabs
- **Path alias**: `@/*` maps to project root
- **Imports**: React Native components, Expo Router, Lucide icons, custom theme from `constants/theme.ts`
- **Types**: Define in `types/` directory (e.g., Course, Module, Lesson)
- **Components**: Use functional components with TypeScript interfaces, JSDoc comments for complex props
- **Styling**: Use StyleSheet from React Native with theme constants (COLORS, FONTS, SIZES)
- **Navigation**: Use `router` from `expo-router` for navigation
- **State**: React Context API for global state (auth, progress, notifications)
