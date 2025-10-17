import { Router, Request, Response } from 'express';
import { ModuleService } from '../services/moduleService';

const router = Router();
const moduleService = new ModuleService();

/**
 * GET /api/modules/:id
 * Get module by ID with lessons
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid module ID' });
    }

    const module = await moduleService.getModuleById(id);

    if (!module) {
      return res.status(404).json({ error: 'Module not found' });
    }

    res.json(module);
  } catch (error) {
    console.error('Error fetching module:', error);
    res.status(500).json({ error: 'Failed to fetch module' });
  }
});

/**
 * GET /api/modules/course/:courseId
 * Get all modules for a course
 */
router.get('/course/:courseId', async (req: Request, res: Response) => {
  try {
    const courseId = parseInt(req.params.courseId);

    if (isNaN(courseId)) {
      return res.status(400).json({ error: 'Invalid course ID' });
    }

    const modules = await moduleService.getModulesByCourseId(courseId);

    res.json(modules);
  } catch (error) {
    console.error('Error fetching modules:', error);
    res.status(500).json({ error: 'Failed to fetch modules' });
  }
});

export default router;
