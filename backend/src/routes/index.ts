import { Router } from 'express';
import coursesRouter from './courses';
import lessonsRouter from './lessons';
import modulesRouter from './modules';
import progressRouter from './progress';

const router = Router();

// Mount routes
router.use('/courses', coursesRouter);
router.use('/lessons', lessonsRouter);
router.use('/modules', modulesRouter);
router.use('/progress', progressRouter);

export default router;
