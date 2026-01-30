import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

const redisClient = createClient({
  socket: {
    host: process.env.REDIS_HOST || 'redis',
    port: Number(process.env.REDIS_PORT) || 6379,
    connectTimeout: 10000,
  },
  password: process.env.REDIS_PASSWORD || undefined,
  legacyMode: true, // Optional, allows simple get/set syntax
});

// Events
redisClient.on('connect', () => console.log('[✅] Redis socket connected'));
redisClient.on('ready', () => console.log('[🚀] Redis ready'));
redisClient.on('error', (err) => console.error('[❌] Redis error:', err.message));
redisClient.on('end', () => console.log('[⚠️] Redis connection closed'));

// Connect safely with retry
async function connectRedis(retries = 5, delay = 3000) {
  for (let i = 0; i < retries; i++) {
    try {
      if (!redisClient.isOpen) {
        await redisClient.connect();
      }
      console.log('[🎯] Redis connected successfully');
      return;
    } catch (err) {
      console.warn(`[⚠️] Redis connection attempt ${i + 1} failed: ${err.message}`);
      await new Promise((res) => setTimeout(res, delay));
    }
  }
  console.warn('[⚠️] Redis unavailable, continuing without cache');
}

export { connectRedis };
export default redisClient;
