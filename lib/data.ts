import sql from './neon';
import { Course } from '@/types';

export async function getFeaturedCourses(): Promise<Course[]> {
  // This is a simplified query. In a real app, you'd also fetch and attach modules and lessons.
  const courses = await sql<any[]>`SELECT * FROM courses WHERE featured = true`;
  return courses as Course[];
}

export async function getInProgressCourses(): Promise<Course[]> {
  // This is a simplified query. In a real app, you'd also fetch and attach modules and lessons.
  const courses = await sql<any[]>`SELECT * FROM courses WHERE "inProgress" = true`;
  return courses as Course[];
}

export async function getAllCourses(): Promise<Course[]> {
  // In a real app, filtering and pagination should be handled on the server-side.
  const courses = await sql<any[]>`SELECT * FROM courses`;
  return courses as Course[];
}

export async function getCourseById(id: number): Promise<Course | null> {
  // NOTE: This implementation has a N+1 query problem. 
  // In a real production app, you should use a more efficient query or a different data loading strategy.
  const courseResult = await sql<any[]>`SELECT * FROM courses WHERE id = ${id}`;
  if (courseResult.length === 0) {
    return null;
  }
  const course = courseResult[0] as Course;

  const modulesResult = await sql<any[]>`
    SELECT m.*, m.order as module_order
    FROM modules m
    JOIN courses_modules cm ON m.id = cm.module_id
    WHERE cm.course_id = ${id}
    ORDER BY m."order"
  `;

  const modulesWithLessons = await Promise.all(
    modulesResult.map(async (module) => {
      const lessonsResult = await sql<any[]>`
        SELECT l.*
        FROM lessons l
        JOIN modules_lessons ml ON l.id = ml.lesson_id
        WHERE ml.module_id = ${module.id}
      `;
      return { ...module, lessons: lessonsResult };
    })
  );

  return { ...course, modules: modulesWithLessons };
}

export async function getModuleById(id: number): Promise<Module | null> {
  const moduleResult = await sql<any[]>`SELECT * FROM modules WHERE id = ${id}`;
  if (moduleResult.length === 0) {
    return null;
  }
  const module = moduleResult[0] as Module;

  const lessonsResult = await sql<any[]>`
    SELECT l.*
    FROM lessons l
    JOIN modules_lessons ml ON l.id = ml.lesson_id
    WHERE ml.module_id = ${id}
  `;

  return { ...module, lessons: lessonsResult };
}

export async function getLessonById(id: number): Promise<Lesson | null> {
  const lessonResult = await sql<any[]>`SELECT * FROM lessons WHERE id = ${id}`;
  if (lessonResult.length === 0) {
    return null;
  }
  return lessonResult[0] as Lesson;
}

export async function getNextLesson(currentLessonId: number): Promise<Lesson | null> {
  // This is a simplified implementation. A real implementation would need module context.
  const nextLessonResult = await sql<any[]>`SELECT * FROM lessons WHERE id > ${currentLessonId} ORDER BY id ASC LIMIT 1`;
  if (nextLessonResult.length === 0) {
    return null;
  }
  return nextLessonResult[0] as Lesson;
}

export async function getPreviousLesson(currentLessonId: number): Promise<Lesson | null> {
  // This is a simplified implementation. A real implementation would need module context.
  const previousLessonResult = await sql<any[]>`SELECT * FROM lessons WHERE id < ${currentLessonId} ORDER BY id DESC LIMIT 1`;
  if (previousLessonResult.length === 0) {
    return null;
  }
  return previousLessonResult[0] as Lesson;
}
