import React, { createContext, useState, useEffect } from 'react';
import { useUser } from '@stackframe/react';
import sql from '@/lib/neon';

interface ProgressState {
  completedLessons: number[];
}

interface ProgressContextType {
  markLessonComplete: (lessonId: number) => void;
  isLessonComplete: (lessonId: number) => boolean;
  getCourseProgress: (courseId: number) => number;
  getModuleProgress: (moduleId: number) => number;
  getOverallProgress: () => number;
}

export const ProgressContext = createContext<ProgressContextType>({
  markLessonComplete: () => {},
  isLessonComplete: () => false,
  getCourseProgress: () => 0,
  getModuleProgress: () => 0,
  getOverallProgress: () => 0,
});

interface ProgressProviderProps {
  children: React.ReactNode;
}

export const ProgressProvider = ({ children }: ProgressProviderProps) => {
  const user = useUser();
  const [completedLessons, setCompletedLessons] = useState<number[]>([]);

  useEffect(() => {
    const loadProgress = async () => {
      if (user) {
        try {
          const progress = await sql<any[]>`
            SELECT lesson_id FROM user_lesson_progress WHERE user_id = ${user.id}
          `;
          setCompletedLessons(progress.map(p => p.lesson_id));
        } catch (error) {
          console.error('Failed to load progress:', error);
        }
      }
    };

    loadProgress();
  }, [user]);

  const markLessonComplete = async (lessonId: number) => {
    if (user && !completedLessons.includes(lessonId)) {
      try {
        await sql`
          INSERT INTO user_lesson_progress (user_id, lesson_id) VALUES (${user.id}, ${lessonId})
        `;
        setCompletedLessons(prev => [...prev, lessonId]);
      } catch (error) {
        console.error('Failed to save progress:', error);
      }
    }
  };

  const isLessonComplete = (lessonId: number) => {
    return completedLessons.includes(lessonId);
  };

  // NOTE: The progress calculation functions below are not yet refactored
  // and will not work correctly as they depend on the old static data structure.
  const getCourseProgress = (courseId: number) => {
    return 0;
  };

  const getModuleProgress = (moduleId: number) => {
    return 0;
  };

  const getOverallProgress = () => {
    return 0;
  };

  return (
    <ProgressContext.Provider value={{
      markLessonComplete,
      isLessonComplete,
      getCourseProgress,
      getModuleProgress,
      getOverallProgress,
    }}>
      {children}
    </ProgressContext.Provider>
  );
};
