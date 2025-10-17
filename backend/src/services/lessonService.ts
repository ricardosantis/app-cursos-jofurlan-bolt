import { sql } from '../config/database';
import { Lesson } from '../types';

export class LessonService {
  /**
   * Get lesson by ID
   */
  async getLessonById(id: number): Promise<Lesson | null> {
    const lessonResult = await sql`SELECT * FROM lessons WHERE id = ${id}`;
    
    if (lessonResult.length === 0) {
      return null;
    }
    
    return lessonResult[0] as Lesson;
  }

  /**
   * Get next lesson (simplified - uses ID ordering)
   * TODO: Improve to use proper module context and lesson_order
   */
  async getNextLesson(currentLessonId: number): Promise<Lesson | null> {
    const nextLessonResult = await sql`
      SELECT * FROM lessons 
      WHERE id > ${currentLessonId} 
      ORDER BY id ASC 
      LIMIT 1
    `;
    
    if (nextLessonResult.length === 0) {
      return null;
    }
    
    return nextLessonResult[0] as Lesson;
  }

  /**
   * Get previous lesson (simplified - uses ID ordering)
   * TODO: Improve to use proper module context and lesson_order
   */
  async getPreviousLesson(currentLessonId: number): Promise<Lesson | null> {
    const previousLessonResult = await sql`
      SELECT * FROM lessons 
      WHERE id < ${currentLessonId} 
      ORDER BY id DESC 
      LIMIT 1
    `;
    
    if (previousLessonResult.length === 0) {
      return null;
    }
    
    return previousLessonResult[0] as Lesson;
  }

  /**
   * Get next lesson within a specific module
   */
  async getNextLessonInModule(currentLessonId: number, moduleId: number): Promise<Lesson | null> {
    const result = await sql`
      SELECT l.*
      FROM lessons l
      JOIN modules_lessons ml ON l.id = ml.lesson_id
      WHERE ml.module_id = ${moduleId}
        AND l.id > ${currentLessonId}
      ORDER BY l.id ASC
      LIMIT 1
    `;
    
    if (result.length === 0) {
      return null;
    }
    
    return result[0] as Lesson;
  }

  /**
   * Get previous lesson within a specific module
   */
  async getPreviousLessonInModule(currentLessonId: number, moduleId: number): Promise<Lesson | null> {
    const result = await sql`
      SELECT l.*
      FROM lessons l
      JOIN modules_lessons ml ON l.id = ml.lesson_id
      WHERE ml.module_id = ${moduleId}
        AND l.id < ${currentLessonId}
      ORDER BY l.id DESC
      LIMIT 1
    `;
    
    if (result.length === 0) {
      return null;
    }
    
    return result[0] as Lesson;
  }
}
