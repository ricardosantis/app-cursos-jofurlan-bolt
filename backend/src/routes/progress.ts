import { Router, Request, Response } from 'express';
import { ProgressService } from '../services/progressService';

const router = Router();
const progressService = new ProgressService();

/**
 * GET /api/progress/:userId
 * Get all progress for a user
 */
router.get('/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const progress = await progressService.getUserProgress(userId);
    const completedLessons = await progressService.getCompletedLessons(userId);

    res.json({
      progress,
      completedLessons,
    });
  } catch (error) {
    console.error('Error fetching progress:', error);
    res.status(500).json({ error: 'Failed to fetch progress' });
  }
});

/**
 * POST /api/progress/:userId/lesson/:lessonId
 * Mark lesson as complete/incomplete
 * Body: { completed: boolean }
 */
router.post('/:userId/lesson/:lessonId', async (req: Request, res: Response) => {
  try {
    const { userId, lessonId } = req.params;
    const { completed = true } = req.body;

    if (!userId || !lessonId) {
      return res.status(400).json({ error: 'User ID and Lesson ID are required' });
    }

    const lessonIdNum = parseInt(lessonId);
    if (isNaN(lessonIdNum)) {
      return res.status(400).json({ error: 'Invalid lesson ID' });
    }

    const success = await progressService.markLessonComplete(userId, lessonIdNum, completed);

    if (!success) {
      return res.status(500).json({ error: 'Failed to update progress' });
    }

    res.json({ success: true, message: 'Progress updated' });
  } catch (error) {
    console.error('Error updating progress:', error);
    res.status(500).json({ error: 'Failed to update progress' });
  }
});

/**
 * GET /api/progress/:userId/course/:courseId
 * Get progress for a specific course
 */
router.get('/:userId/course/:courseId', async (req: Request, res: Response) => {
  try {
    const { userId, courseId } = req.params;

    if (!userId || !courseId) {
      return res.status(400).json({ error: 'User ID and Course ID are required' });
    }

    const courseIdNum = parseInt(courseId);
    if (isNaN(courseIdNum)) {
      return res.status(400).json({ error: 'Invalid course ID' });
    }

    const progress = await progressService.getCourseProgress(userId, courseIdNum);

    res.json(progress);
  } catch (error) {
    console.error('Error fetching course progress:', error);
    res.status(500).json({ error: 'Failed to fetch course progress' });
  }
});

/**
 * GET /api/progress/:userId/module/:moduleId
 * Get progress for a specific module
 */
router.get('/:userId/module/:moduleId', async (req: Request, res: Response) => {
  try {
    const { userId, moduleId } = req.params;

    if (!userId || !moduleId) {
      return res.status(400).json({ error: 'User ID and Module ID are required' });
    }

    const moduleIdNum = parseInt(moduleId);
    if (isNaN(moduleIdNum)) {
      return res.status(400).json({ error: 'Invalid module ID' });
    }

    const progress = await progressService.getModuleProgress(userId, moduleIdNum);

    res.json(progress);
  } catch (error) {
    console.error('Error fetching module progress:', error);
    res.status(500).json({ error: 'Failed to fetch module progress' });
  }
});

/**
 * GET /api/progress/:userId/overall
 * Get overall progress across all courses
 */
router.get('/:userId/overall', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const progress = await progressService.getOverallProgress(userId);

    res.json(progress);
  } catch (error) {
    console.error('Error fetching overall progress:', error);
    res.status(500).json({ error: 'Failed to fetch overall progress' });
  }
});

export default router;
