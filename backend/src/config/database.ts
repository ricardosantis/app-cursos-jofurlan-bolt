import { neon } from '@neondatabase/serverless';
import { env } from './env';

export const sql = neon(env.DATABASE_URL);

export async function testConnection() {
  try {
    const result = await sql`SELECT NOW() as now`;
    console.log('✅ Database connected:', result[0].now);
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
}
