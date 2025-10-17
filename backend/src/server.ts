import express from 'express';
import cors from 'cors';
import { env } from './config/env';
import { testConnection } from './config/database';
import apiRoutes from './routes';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    environment: env.NODE_ENV 
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'EduCourse API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      courses: '/api/courses',
      lessons: '/api/lessons',
      modules: '/api/modules',
      progress: '/api/progress'
    }
  });
});

// API Routes
app.use('/api', apiRoutes);

// Start server
const PORT = parseInt(env.PORT);

app.listen(PORT, async () => {
  console.log('');
  console.log('🚀 ════════════════════════════════════════');
  console.log(`   Server running on http://localhost:${PORT}`);
  console.log('🚀 ════════════════════════════════════════');
  console.log('');
  await testConnection();
  console.log('');
  console.log('📍 Endpoints:');
  console.log(`   GET  http://localhost:${PORT}/`);
  console.log(`   GET  http://localhost:${PORT}/health`);
  console.log('');
  console.log('📚 API Routes:');
  console.log(`   GET  http://localhost:${PORT}/api/courses`);
  console.log(`   GET  http://localhost:${PORT}/api/courses/:id`);
  console.log(`   GET  http://localhost:${PORT}/api/lessons/:id`);
  console.log(`   GET  http://localhost:${PORT}/api/modules/:id`);
  console.log(`   GET  http://localhost:${PORT}/api/progress/:userId`);
  console.log('');
});
