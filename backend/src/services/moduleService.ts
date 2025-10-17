import { sql } from '../config/database';
import { Module } from '../types';

export class ModuleService {
  /**
   * Get module by ID with lessons
   */
  async getModuleById(id: number): Promise<Module | null> {
    const moduleResult = await sql`SELECT * FROM modules WHERE id = ${id}`;
    
    if (moduleResult.length === 0) {
      return null;
    }

    const module = moduleResult[0] as Module;

    // Get lessons for this module
    const lessonsResult = await sql`
      SELECT l.*
      FROM lessons l
      JOIN modules_lessons ml ON l.id = ml.lesson_id
      WHERE ml.module_id = ${id}
      ORDER BY l.id
    `;

    return { ...module, lessons: lessonsResult };
  }

  /**
   * Get all modules for a course
   */
  async getModulesByCourseId(courseId: number): Promise<Module[]> {
    const modulesResult = await sql`
      SELECT m.*
      FROM modules m
      JOIN courses_modules cm ON m.id = cm.module_id
      WHERE cm.course_id = ${courseId}
      ORDER BY m."order"
    `;

    // Get lessons for each module
    const modulesWithLessons = await Promise.all(
      modulesResult.map(async (module) => {
        const lessonsResult = await sql`
          SELECT l.*
          FROM lessons l
          JOIN modules_lessons ml ON l.id = ml.lesson_id
          WHERE ml.module_id = ${module.id}
          ORDER BY l.id
        `;
        return { ...module, lessons: lessonsResult };
      })
    );

    return modulesWithLessons as Module[];
  }
}
