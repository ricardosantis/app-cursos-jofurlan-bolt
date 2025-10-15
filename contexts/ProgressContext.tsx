import React, { createContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { allCourses } from '@/data/courses';

/**
 * @interface ProgressState
 * @description Defines the shape of the progress state.
 * @property {number[]} completedLessons - An array of IDs of completed lessons.
 */
interface ProgressState {
  completedLessons: number[];
}

/**
 * @interface ProgressContextType
 * @description Defines the shape of the progress context.
 * @property {(lessonId: number) => void} markLessonComplete - Function to mark a lesson as complete.
 * @property {(lessonId: number) => boolean} isLessonComplete - Function to check if a lesson is complete.
 * @property {(courseId: number) => number} getCourseProgress - Function to get the progress of a course in percentage.
 * @property {(moduleId: number) => number} getModuleProgress - Function to get the progress of a module in percentage.
 * @property {() => number} getOverallProgress - Function to get the overall progress in percentage.
 */
interface ProgressContextType {
  markLessonComplete: (lessonId: number) => void;
  isLessonComplete: (lessonId: number) => boolean;
  getCourseProgress: (courseId: number) => number;
  getModuleProgress: (moduleId: number) => number;
  getOverallProgress: () => number;
}

/**
 * @const ProgressContext
 * @description The progress context.
 */
export const ProgressContext = createContext<ProgressContextType>({
  markLessonComplete: () => {},
  isLessonComplete: () => false,
  getCourseProgress: () => 0,
  getModuleProgress: () => 0,
  getOverallProgress: () => 0,
});

/**
 * @interface ProgressProviderProps
 * @description Defines the props for the ProgressProvider component.
 * @property {React.ReactNode} children - The child components.
 */
interface ProgressProviderProps {
  children: React.ReactNode;
}

/**
 * @const storage
 * @description A helper object for handling storage across different platforms (web and native).
 */
const storage = {
  /**
   * @function getItem
   * @description Retrieves an item from storage.
   * @param {string} key - The key of the item to retrieve.
   * @returns {Promise<string | null>} The value of the item, or null if not found.
   */
  async getItem(key: string): Promise<string | null> {
    if (Platform.OS === 'web') {
      return localStorage.getItem(key);
    }
    return await SecureStore.getItemAsync(key);
  },

  /**
   * @function setItem
   * @description Stores an item in storage.
   * @param {string} key - The key of the item to store.
   * @param {string} value - The value of the item to store.
   * @returns {Promise<void>}
   */
  async setItem(key: string, value: string): Promise<void> {
    if (Platform.OS === 'web') {
      localStorage.setItem(key, value);
    } else {
      await SecureStore.setItemAsync(key, value);
    }
  }
};

/**
 * @function ProgressProvider
 * @description Provides progress state and functions to its children.
 * @param {ProgressProviderProps} props - The component props.
 * @returns {JSX.Element} The rendered component.
 */
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

  /**
   * @function loadProgress
   * @description Loads the progress from storage.
   */
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

  /**
   * @function saveProgress
   * @description Saves the progress to storage.
   */
  const saveProgress = async () => {
    try {
      await storage.setItem('progress', JSON.stringify(progressState));
    } catch (error) {
      console.error('Failed to save progress:', error);
    }
  };

  /**
   * @function markLessonComplete
   * @description Marks a lesson as complete.
   * @param {number} lessonId - The ID of the lesson to mark as complete.
   */
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

  /**
   * @function isLessonComplete
   * @description Checks if a lesson is complete.
   * @param {number} lessonId - The ID of the lesson to check.
   * @returns {boolean} True if the lesson is complete, false otherwise.
   */
  const isLessonComplete = (lessonId: number) => {
    return progressState.completedLessons.includes(lessonId);
  };

  /**
   * @function getCourseProgress
   * @description Calculates the progress of a course.
   * @param {number} courseId - The ID of the course.
   * @returns {number} The course progress in percentage.
   */
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

  /**
   * @function getModuleProgress
   * @description Calculates the progress of a module.
   * @param {number} moduleId - The ID of the module.
   * @returns {number} The module progress in percentage.
   */
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

  /**
   * @function getOverallProgress
   * @description Calculates the overall progress across all courses.
   * @returns {number} The overall progress in percentage.
   */
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