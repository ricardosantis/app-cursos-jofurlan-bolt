import { Router, Request, Response } from 'express';
import { CourseService } from '../services/courseService';

const router = Router();
const courseService = new CourseService();

/**
 * GET /api/courses
 * Query params:
 *  - featured: boolean
 *  - inProgress: boolean
 *  - search: string
 *  - category: string
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const { featured, inProgress, search, category } = req.query;

    let courses;

    if (featured === 'true') {
      courses = await courseService.getFeaturedCourses();
    } else if (inProgress === 'true') {
      courses = await courseService.getInProgressCourses();
    } else if (search && typeof search === 'string') {
      courses = await courseService.searchCourses(search);
    } else if (category && typeof category === 'string') {
      courses = await courseService.getCoursesByCategory(category);
    } else {
      courses = await courseService.getAllCourses();
    }

    res.json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
});

/**
 * GET /api/courses/:id
 * Get course by ID with modules and lessons
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid course ID' });
    }

    const course = await courseService.getCourseById(id);

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    res.json(course);
  } catch (error) {
    console.error('Error fetching course:', error);
    res.status(500).json({ error: 'Failed to fetch course' });
  }
});

export default router;
