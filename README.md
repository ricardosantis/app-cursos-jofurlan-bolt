# EduCourse - Online Learning Platform

EduCourse is a mobile application built with React Native and Expo that provides an online learning platform. Users can browse courses, watch lessons, track their progress, and interact with a community of learners.

## 🚀 Quick Start

```bash
npm run dev:all
```

This single command starts both the backend API and the mobile app!

See [README_QUICK_START.md](./README_QUICK_START.md) for more details.

## Features

- **User Authentication:** Secure sign-up and sign-in functionality using Supabase for authentication.
- **Course Catalog:** Browse a variety of courses with detailed descriptions, instructor information, and module breakdowns.
- **Lesson Player:** Watch video lessons or read text-based content within the app.
- **Progress Tracking:** Keep track of completed lessons and view overall course and module progress.
- **Search and Filter:** Easily find courses using a search bar and category filters.
- **Push Notifications:** Receive reminders for scheduled courses.
- **Offline Access:** (Simulated) Download course content for offline viewing.

## Tech Stack

- **Frontend:** React Native with Expo
- **Navigation:** Expo Router
- **Backend:** Supabase (Authentication and Database)
- **Styling:** Custom StyleSheet with a defined theme
- **Animations:** React Native Reanimated
- **Icons:** Lucide React Native

## Project Structure

```
.
├── app/                  # Expo Router routes
│   ├── (auth)/           # Authentication screens (login, register)
│   ├── (tabs)/           # Main app screens (home, courses, etc.)
│   ├── course/           # Course detail screen
│   ├── lesson/           # Lesson screen
│   └── module/           # Module detail screen
├── assets/               # Static assets (images, fonts)
├── components/           # Reusable components
│   └── courses/          # Course and module cards
├── constants/            # Theme and constant values
├── contexts/             # React contexts (Auth, Progress, Notification)
├── data/                 # Static data (course information)
├── hooks/                # Custom React hooks
├── lib/                  # Library configurations (Supabase)
├── supabase/             # Supabase migrations
└── types/                # TypeScript type definitions
```

## Setup and Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd app-cursos-jofurlan-bolt
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the root of the project and add your Supabase credentials:
   ```
   EXPO_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
   EXPO_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
   ```

4. **Run the application:**
   ```bash
   npx expo start
   ```
   This will start the Metro bundler. You can then run the app on a physical device using the Expo Go app or in an emulator/simulator.

## Usage

- **Sign up or log in:** Create a new account or log in with existing credentials.
- **Browse courses:** Explore the available courses on the Home and Courses screens.
- **Start a course:** Tap on a course to view its details and begin the lessons.
- **Navigate lessons:** Use the "Continue" and "Previous/Next" buttons to move through the course content.
- **Track progress:** Your progress is automatically saved as you complete lessons. View your overall progress on the home screen and for each course/module.