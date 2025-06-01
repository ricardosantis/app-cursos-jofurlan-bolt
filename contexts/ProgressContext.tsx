import React, { createContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { allCourses } from '@/data/courses';

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

// Helper functions for storage operations
const storage = {
  async getItem(key: string): Promise<string | null> {
    if (Platform.OS === 'web') {
      return localStorage.getItem(key);
    }
    return await SecureStore.getItemAsync(key);
  },

  async setItem(key: string, value: string): Promise<void> {
    if (Platform.OS === 'web') {
      localStorage.setItem(key, value);
    } else {
      await SecureStore.setItemAsync(key, value);
    }
  }
};

export const ProgressProvider = ({ children }: ProgressProviderProps) => {
  const [progressState, setProgressState] = useState<ProgressState>({
    completedLessons: [],
  });

  useEffect(() => {
    // Load progress from storage on mount
    loadProgress();
  }, []);

  useEffect(() => {
    // Save progress to storage whenever it changes
    saveProgress();
  }, [progressState]);

  const loadProgress = async () => {
    try {
      const progressJSON = await storage.getItem('progress');
      if (progressJSON) {
        setProgressState(JSON.parse(progressJSON));
      }
    } catch (error) {
      console.error('Failed to load progress:', error);
    }
  };

  const saveProgress = async () => {
    try {
      await storage.setItem('progress', JSON.stringify(progressState));
    } catch (error) {
      console.error('Failed to save progress:', error);
    }
  };

  const markLessonComplete = (lessonId: number) => {
    setProgressState(prev => {
      if (prev.completedLessons.includes(lessonId)) {
        return prev;
      }
      return {
        ...prev,
        completedLessons: [...prev.completedLessons, lessonId],
      };
    });
  };

  const isLessonComplete = (lessonId: number) => {
    return progressState.completedLessons.includes(lessonId);
  };

  const getCourseProgress = (courseId: number) => {
    const course = allCourses.find(c => c.id === courseId);
    if (!course) return 0;

    const totalLessons = course.modules.reduce(
      (acc, module) => acc + module.lessons.length,
      0
    );
    
    if (totalLessons === 0) return 0;

    const completedLessonsInCourse = course.modules.reduce((acc, module) => {
      const completedInModule = module.lessons.filter(lesson => 
        progressState.completedLessons.includes(lesson.id)
      ).length;
      return acc + completedInModule;
    }, 0);

    return Math.round((completedLessonsInCourse / totalLessons) * 100);
  };

  const getModuleProgress = (moduleId: number) => {
    // Find the module across all courses
    let targetModule = null;
    
    for (const course of allCourses) {
      const module = course.modules.find(m => m.id === moduleId);
      if (module) {
        targetModule = module;
        break;
      }
    }
    
    if (!targetModule || targetModule.lessons.length === 0) return 0;

    const completedLessonsInModule = targetModule.lessons.filter(lesson => 
      progressState.completedLessons.includes(lesson.id)
    ).length;

    return Math.round((completedLessonsInModule / targetModule.lessons.length) * 100);
  };

  const getOverallProgress = () => {
    const totalLessons = allCourses.reduce((acc, course) => {
      return acc + course.modules.reduce(
        (moduleAcc, module) => moduleAcc + module.lessons.length,
        0
      );
    }, 0);
    
    if (totalLessons === 0) return 0;

    return Math.round((progressState.completedLessons.length / totalLessons) * 100);
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