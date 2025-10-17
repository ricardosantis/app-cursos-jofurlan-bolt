import { sql } from '../config/database';
import { UserProgress } from '../types';

export class ProgressService {
  /**
   * Get all progress for a user
   */
  async getUserProgress(userId: string): Promise<UserProgress[]> {
    const progress = await sql`
      SELECT * FROM user_lesson_progress 
      WHERE user_id = ${userId}
    `;
    return progress as UserProgress[];
  }

  /**
   * Get completed lessons for a user
   */
  async getCompletedLessons(userId: string): Promise<number[]> {
    const progress = await sql`
      SELECT lesson_id FROM user_lesson_progress 
      WHERE user_id = ${userId} AND completed_at IS NOT NULL
    `;
    return progress.map((p: any) => p.lesson_id);
  }

  /**
   * Mark a lesson as complete/incomplete
   */
  async markLessonComplete(userId: string, lessonId: number, completed: boolean = true): Promise<boolean> {
    try {
      // Check if progress record exists
      const existing = await sql`
        SELECT * FROM user_lesson_progress 
        WHERE user_id = ${userId} AND lesson_id = ${lessonId}
      `;

      if (existing.length > 0) {
        // Update existing record
        await sql`
          UPDATE user_lesson_progress 
          SET completed_at = ${completed ? sql`NOW()` : null}
          WHERE user_id = ${userId} AND lesson_id = ${lessonId}
        `;
      } else {
        // Insert new record
        await sql`
          INSERT INTO user_lesson_progress (user_id, lesson_id, completed_at)
          VALUES (${userId}, ${lessonId}, ${completed ? sql`NOW()` : null})
        `;
      }

      return true;
    } catch (error) {
      console.error('Error marking lesson complete:', error);
      return false;
    }
  }

  /**
   * Get course progress percentage for a user
   */
  async getCourseProgress(userId: string, courseId: number): Promise<{ percentage: number; completedLessons: number; totalLessons: number }> {
    try {
      // Get total lessons in course
      const totalResult = await sql`
        SELECT COUNT(DISTINCT l.id) as total
        FROM lessons l
        JOIN modules_lessons ml ON l.id = ml.lesson_id
        JOIN modules m ON ml.module_id = m.id
        JOIN courses_modules cm ON m.id = cm.module_id
        WHERE cm.course_id = ${courseId}
      `;

      const totalLessons = parseInt(totalResult[0]?.total || '0');

      if (totalLessons === 0) {
        return { percentage: 0, completedLessons: 0, totalLessons: 0 };
      }

      // Get completed lessons in course
      const completedResult = await sql`
        SELECT COUNT(DISTINCT ulp.lesson_id) as completed
        FROM user_lesson_progress ulp
        JOIN modules_lessons ml ON ulp.lesson_id = ml.lesson_id
        JOIN modules m ON ml.module_id = m.id
        JOIN courses_modules cm ON m.id = cm.module_id
        WHERE cm.course_id = ${courseId}
          AND ulp.user_id = ${userId}
          AND ulp.completed_at IS NOT NULL
      `;

      const completedLessons = parseInt(completedResult[0]?.completed || '0');
      const percentage = Math.round((completedLessons / totalLessons) * 100);

      return { percentage, completedLessons, totalLessons };
    } catch (error) {
      console.error('Error calculating course progress:', error);
      return { percentage: 0, completedLessons: 0, totalLessons: 0 };
    }
  }

  /**
   * Get module progress percentage for a user
   */
  async getModuleProgress(userId: string, moduleId: number): Promise<{ percentage: number; completedLessons: number; totalLessons: number }> {
    try {
      // Get total lessons in module
      const totalResult = await sql`
        SELECT COUNT(*) as total
        FROM modules_lessons
        WHERE module_id = ${moduleId}
      `;

      const totalLessons = parseInt(totalResult[0]?.total || '0');

      if (totalLessons === 0) {
        return { percentage: 0, completedLessons: 0, totalLessons: 0 };
      }

      // Get completed lessons in module
      const completedResult = await sql`
        SELECT COUNT(*) as completed
        FROM user_lesson_progress ulp
        JOIN modules_lessons ml ON ulp.lesson_id = ml.lesson_id
        WHERE ml.module_id = ${moduleId}
          AND ulp.user_id = ${userId}
          AND ulp.completed_at IS NOT NULL
      `;

      const completedLessons = parseInt(completedResult[0]?.completed || '0');
      const percentage = Math.round((completedLessons / totalLessons) * 100);

      return { percentage, completedLessons, totalLessons };
    } catch (error) {
      console.error('Error calculating module progress:', error);
      return { percentage: 0, completedLessons: 0, totalLessons: 0 };
    }
  }

  /**
   * Get overall progress across all courses
   */
  async getOverallProgress(userId: string): Promise<{ percentage: number; completedLessons: number; totalLessons: number }> {
    try {
      // Get total lessons
      const totalResult = await sql`SELECT COUNT(*) as total FROM lessons`;
      const totalLessons = parseInt(totalResult[0]?.total || '0');

      if (totalLessons === 0) {
        return { percentage: 0, completedLessons: 0, totalLessons: 0 };
      }

      // Get completed lessons
      const completedResult = await sql`
        SELECT COUNT(*) as completed
        FROM user_lesson_progress
        WHERE user_id = ${userId} AND completed_at IS NOT NULL
      `;

      const completedLessons = parseInt(completedResult[0]?.completed || '0');
      const percentage = Math.round((completedLessons / totalLessons) * 100);

      return { percentage, completedLessons, totalLessons };
    } catch (error) {
      console.error('Error calculating overall progress:', error);
      return { percentage: 0, completedLessons: 0, totalLessons: 0 };
    }
  }
}
