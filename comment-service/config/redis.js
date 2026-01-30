import { createClient } from 'redis';
import dotenv from 'dotenv';
dotenv.config();

const redisOptions = {
  socket: {
    host: process.env.REDIS_HOST || 'redis',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    connectTimeout: 10000,
    keepAlive: 5000,
    noDelay: true
  }
};

if (process.env.REDIS_PASSWORD) {
  redisOptions.username = process.env.REDIS_USERNAME || 'default';
  redisOptions.password = process.env.REDIS_PASSWORD;
}

export const client = createClient(redisOptions);

// REQUIRED listeners
client.on('connect', () => {
  console.log('[✅] Redis socket connected');
});

client.on('ready', () => {
  console.log('[🚀] Redis ready to use');
});

client.on('error', (err) => {
  console.error('[❌] Redis error:', err.message);
});

export async function connectRedis() {
  try {
    await client.connect();
    console.log('[🎯] Redis connected successfully');
  } catch (err) {
    console.warn('[⚠️] Redis unavailable, continuing without cache');
  }
}


