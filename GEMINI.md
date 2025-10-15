
# Project Overview

This is a mobile application built with React Native and Expo. It's an online course platform that allows users to browse and watch courses. The app uses Supabase for authentication and data storage.

## Key Technologies

*   **Frontend:** React Native, Expo
*   **Navigation:** Expo Router
*   **Backend:** Supabase
*   **Styling:** Custom styles with some usage of `lucide-react-native` for icons.
*   **Fonts:** Inter and Poppins, loaded with `@expo-google-fonts`.
*   **State Management:** React Context API for authentication, progress and notifications.

## Project Structure

*   `app/`: Contains the different screens of the application, organized by routes using Expo Router.
    *   `(auth)/`: Authentication-related screens (login).
    *   `(tabs)/`: The main tab navigation of the app (Home, Courses, Community, Profile).
    *   `course/[id].tsx`: Screen to display a specific course.
    *   `lesson/[id].tsx`: Screen to display a specific lesson.
    *   `module/[id].tsx`: Screen to display a specific module.
*   `assets/`: Static assets like images and fonts.
*   `components/`: Reusable components.
*   `constants/`: Theme-related constants like colors and fonts.
*   `contexts/`: React Context providers for managing global state.
*   `data/`: Sample data for the application.
*   `hooks/`: Custom React hooks.
*   `lib/`: Supabase client configuration.
*   `supabase/`: Supabase database migrations.
*   `types/`: TypeScript type definitions.

# Building and Running

## Prerequisites

*   Node.js and npm (or yarn)
*   Expo CLI

## Development

To run the app in development mode, use the following command:

```bash
npm run dev
```

This will start the Expo development server and you can run the app on a physical device using the Expo Go app or on an emulator.

## Web Build

To create a production build for the web, use the following command:

```bash
npm run build:web
```

# Development Conventions

*   **Linting:** The project uses `expo lint` for linting. Run `npm run lint` to check for linting errors.
*   **Styling:** The project uses a custom theme defined in `constants/theme.ts`.
*   **Data:** The app currently uses static sample data from `data/courses.ts`. In a production environment, this would be replaced with API calls to a backend.
*   **Authentication:** Authentication is handled via Supabase. The Supabase client is configured in `lib/supabase.ts` and the authentication logic is in `contexts/AuthContext.tsx` and `hooks/useAuth.ts`.
*   **Environment Variables:** The Supabase URL and anon key are loaded from environment variables. You will need to create a `.env` file in the root of the project with the following variables:
    ```
    EXPO_PUBLIC_SUPABASE_URL=your-supabase-url
    EXPO_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
    ```
