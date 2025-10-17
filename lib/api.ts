import { Course, Lesson, Module } from '@/types';

// Backend API URL
const API_URL = __DEV__
  ? 'http://localhost:3001/api'
  : 'https://your-backend-production-url.com/api';

/**
 * Generic fetch helper with error handling
 */
async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error);
    throw error;
  }
}

export const api = {
  /**
   * Courses API
   */
  courses: {
    getAll: () => fetchAPI<Course[]>('/courses'),
    
    getFeatured: () => fetchAPI<Course[]>('/courses?featured=true'),
    
    getInProgress: () => fetchAPI<Course[]>('/courses?inProgress=true'),
    
    getById: (id: number) => fetchAPI<Course>(`/courses/${id}`),
    
    search: (query: string) => fetchAPI<Course[]>(`/courses?search=${encodeURIComponent(query)}`),
    
    getByCategory: (category: string) => fetchAPI<Course[]>(`/courses?category=${encodeURIComponent(category)}`),
  },

  /**
   * Lessons API
   */
  lessons: {
    getById: (id: number) => fetchAPI<Lesson>(`/lessons/${id}`),
    
    getNext: (id: number, moduleId?: number) => {
      const url = moduleId 
        ? `/lessons/${id}/next?moduleId=${moduleId}`
        : `/lessons/${id}/next`;
      return fetchAPI<Lesson>(url);
    },
    
    getPrevious: (id: number, moduleId?: number) => {
      const url = moduleId 
        ? `/lessons/${id}/previous?moduleId=${moduleId}`
        : `/lessons/${id}/previous`;
      return fetchAPI<Lesson>(url);
    },
  },

  /**
   * Modules API
   */
  modules: {
    getById: (id: number) => fetchAPI<Module>(`/modules/${id}`),
    
    getByCourseId: (courseId: number) => fetchAPI<Module[]>(`/modules/course/${courseId}`),
  },

  /**
   * Progress API
   */
  progress: {
    getUserProgress: (userId: string) => 
      fetchAPI<{ progress: any[]; completedLessons: number[] }>(`/progress/${userId}`),
    
    markLessonComplete: (userId: string, lessonId: number, completed: boolean = true) =>
      fetchAPI<{ success: boolean; message: string }>(
        `/progress/${userId}/lesson/${lessonId}`,
        {
          method: 'POST',
          body: JSON.stringify({ completed }),
        }
      ),
    
    getCourseProgress: (userId: string, courseId: number) =>
      fetchAPI<{ percentage: number; completedLessons: number; totalLessons: number }>(
        `/progress/${userId}/course/${courseId}`
      ),
    
    getModuleProgress: (userId: string, moduleId: number) =>
      fetchAPI<{ percentage: number; completedLessons: number; totalLessons: number }>(
        `/progress/${userId}/module/${moduleId}`
      ),
    
    getOverallProgress: (userId: string) =>
      fetchAPI<{ percentage: number; completedLessons: number; totalLessons: number }>(
        `/progress/${userId}/overall`
      ),
  },

  /**
   * Health check
   */
  health: () => fetchAPI<{ status: string; timestamp: string }>('/health'),
};

// Export API URL for debugging
export { API_URL };
