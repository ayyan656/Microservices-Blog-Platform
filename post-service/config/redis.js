import { createClient } from 'redis';

export const client = createClient({
  socket: {
    host: process.env.REDIS_HOST, 
    port: process.env.REDIS_PORT,
    connectTimeout: 10000,
    keepAlive: 5000,
    noDelay: true
  },
  username: 'default',
  password: process.env.REDIS_PASSWORD
});

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

