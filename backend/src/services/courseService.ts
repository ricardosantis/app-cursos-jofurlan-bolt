import { sql } from '../config/database';
import { Course, Module, Lesson } from '../types';

export class CourseService {
  /**
   * Helper to get modules for a list of courses
   */
  private async getModulesForCourses(courses: Course[]): Promise<Course[]> {
    const courseIds = courses.map(c => c.id);
    if (courseIds.length === 0) {
      return courses;
    }

    const modulesResult = await sql`
      SELECT m.*, cm.course_id
      FROM modules m
      JOIN courses_modules cm ON m.id = cm.module_id
      WHERE cm.course_id = ANY(${courseIds})
      ORDER BY m."order"
    `;
    const modules = modulesResult as (Module & { course_id: number })[];

    return courses.map(course => ({
      ...course,
      modules: modules.filter(m => m.course_id === course.id),
    }));
  }

  /**
   * Get all courses
   */
  async getAllCourses(): Promise<Course[]> {
    const courses = await sql`SELECT * FROM courses ORDER BY id`;
    return this.getModulesForCourses(courses as Course[]);
  }

  /**
   * Get featured courses
   */
  async getFeaturedCourses(): Promise<Course[]> {
    const courses = await sql`
      SELECT * FROM courses 
      WHERE featured = true 
      ORDER BY id
    `;
    return this.getModulesForCourses(courses as Course[]);
  }

  /**
   * Get in progress courses
   */
  async getInProgressCourses(): Promise<Course[]> {
    const courses = await sql`
      SELECT * FROM courses 
      WHERE inprogress = true 
      ORDER BY id
    `;
    return this.getModulesForCourses(courses as Course[]);
  }

  /**
   * Get course by ID with modules and lessons
   * NOTE: This still has N+1 query issue - can be optimized with complex JOIN
   */
  async getCourseById(id: number): Promise<Course | null> {
    const courseResult = await sql`SELECT * FROM courses WHERE id = ${id}`;
    
    if (courseResult.length === 0) {
      return null;
    }

    const course = courseResult[0] as Course;

    // Get modules for this course
    const modulesResult = await sql`
      SELECT m.*, m."order" as module_order
      FROM modules m
      JOIN courses_modules cm ON m.id = cm.module_id
      WHERE cm.course_id = ${id}
      ORDER BY m."order"
    `;

    // Get lessons for each module
    const modulesWithLessons = await Promise.all(
      (modulesResult as Module[]).map(async (module) => {
        const lessonsResult = await sql`
          SELECT l.*
          FROM lessons l
          JOIN modules_lessons ml ON l.id = ml.lesson_id
          WHERE ml.module_id = ${module.id}
          ORDER BY l.id
        `;
        return { ...module, lessons: lessonsResult as Lesson[] };
      })
    );

    return { ...course, modules: modulesWithLessons };
  }

  /**
   * Search courses by title or description
   */
  async searchCourses(query: string): Promise<Course[]> {
    const courses = await sql`
      SELECT * FROM courses 
      WHERE title ILIKE ${'%' + query + '%'} 
         OR description ILIKE ${'%' + query + '%'}
      ORDER BY id
    `;
    return courses as Course[];
  }

  /**
   * Get courses by category
   */
  async getCoursesByCategory(category: string): Promise<Course[]> {
    const courses = await sql`
      SELECT * FROM courses 
      WHERE category = ${category}
      ORDER BY id
    `;
    return courses as Course[];
  }
}
