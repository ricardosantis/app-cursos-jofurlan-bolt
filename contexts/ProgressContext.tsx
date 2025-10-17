import React, { createContext, useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { useUser } from '@stackframe/react';

interface ProgressContextType {
  markLessonComplete: (lessonId: number) => Promise<void>;
  isLessonComplete: (lessonId: number) => boolean;
  getCourseProgress: (courseId: number) => Promise<number>;
  getModuleProgress: (moduleId: number) => Promise<number>;
  getOverallProgress: () => Promise<number>;
  completedLessons: number[];
  isLoading: boolean;
}

export const ProgressContext = createContext<ProgressContextType>({
  markLessonComplete: async () => {},
  isLessonComplete: () => false,
  getCourseProgress: async () => 0,
  getModuleProgress: async () => 0,
  getOverallProgress: async () => 0,
  completedLessons: [],
  isLoading: true,
});

interface ProgressProviderProps {
  children: React.ReactNode;
}

export const ProgressProvider = ({ children }: ProgressProviderProps) => {
  const user = useUser();
  
  const [completedLessons, setCompletedLessons] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProgress = async () => {
      // Proteção: aguarda o Stack Auth estar pronto
      if (!user || user === undefined) {
        setIsLoading(false);
        return;
      }
      
      if (user?.id) {
        try {
          const data = await api.progress.getUserProgress(user.id);
          setCompletedLessons(data.completedLessons);
        } catch (error) {
          console.error('Failed to load progress:', error);
          setCompletedLessons([]);
        }
      }
      
      setIsLoading(false);
    };

    loadProgress();
  }, [user]);

  const markLessonComplete = async (lessonId: number) => {
    if (!user?.id) return;
    
    if (!completedLessons.includes(lessonId)) {
      try {
        await api.progress.markLessonComplete(user.id, lessonId, true);
        setCompletedLessons(prev => [...prev, lessonId]);
      } catch (error) {
        console.error('Failed to save progress:', error);
      }
    }
  };

  const isLessonComplete = (lessonId: number) => {
    return completedLessons.includes(lessonId);
  };

  const getCourseProgress = async (courseId: number): Promise<number> => {
    if (!user?.id) return 0;
    
    try {
      const data = await api.progress.getCourseProgress(user.id, courseId);
      return data.percentage;
    } catch (error) {
      console.error('Failed to get course progress:', error);
      return 0;
    }
  };

  const getModuleProgress = async (moduleId: number): Promise<number> => {
    if (!user?.id) return 0;
    
    try {
      const data = await api.progress.getModuleProgress(user.id, moduleId);
      return data.percentage;
    } catch (error) {
      console.error('Failed to get module progress:', error);
      return 0;
    }
  };

  const getOverallProgress = async (): Promise<number> => {
    if (!user?.id) return 0;
    
    try {
      const data = await api.progress.getOverallProgress(user.id);
      return data.percentage;
    } catch (error) {
      console.error('Failed to get overall progress:', error);
      return 0;
    }
  };

  return (
    <ProgressContext.Provider
      value={{
        markLessonComplete,
        isLessonComplete,
        getCourseProgress,
        getModuleProgress,
        getOverallProgress,
        completedLessons,
        isLoading,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
};
