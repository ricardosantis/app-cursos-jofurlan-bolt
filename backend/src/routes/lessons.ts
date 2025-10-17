import { Router, Request, Response } from 'express';
import { LessonService } from '../services/lessonService';

const router = Router();
const lessonService = new LessonService();

/**
 * GET /api/lessons/:id
 * Get lesson by ID
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid lesson ID' });
    }

    const lesson = await lessonService.getLessonById(id);

    if (!lesson) {
      return res.status(404).json({ error: 'Lesson not found' });
    }

    res.json(lesson);
  } catch (error) {
    console.error('Error fetching lesson:', error);
    res.status(500).json({ error: 'Failed to fetch lesson' });
  }
});

/**
 * GET /api/lessons/:id/next
 * Get next lesson
 * Query param: moduleId (optional)
 */
router.get('/:id/next', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const moduleId = req.query.moduleId ? parseInt(req.query.moduleId as string) : null;

    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid lesson ID' });
    }

    let nextLesson;

    if (moduleId && !isNaN(moduleId)) {
      nextLesson = await lessonService.getNextLessonInModule(id, moduleId);
    } else {
      nextLesson = await lessonService.getNextLesson(id);
    }

    if (!nextLesson) {
      return res.status(404).json({ error: 'No next lesson found' });
    }

    res.json(nextLesson);
  } catch (error) {
    console.error('Error fetching next lesson:', error);
    res.status(500).json({ error: 'Failed to fetch next lesson' });
  }
});

/**
 * GET /api/lessons/:id/previous
 * Get previous lesson
 * Query param: moduleId (optional)
 */
router.get('/:id/previous', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const moduleId = req.query.moduleId ? parseInt(req.query.moduleId as string) : null;

    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid lesson ID' });
    }

    let previousLesson;

    if (moduleId && !isNaN(moduleId)) {
      previousLesson = await lessonService.getPreviousLessonInModule(id, moduleId);
    } else {
      previousLesson = await lessonService.getPreviousLesson(id);
    }

    if (!previousLesson) {
      return res.status(404).json({ error: 'No previous lesson found' });
    }

    res.json(previousLesson);
  } catch (error) {
    console.error('Error fetching previous lesson:', error);
    res.status(500).json({ error: 'Failed to fetch previous lesson' });
  }
});

export default router;
