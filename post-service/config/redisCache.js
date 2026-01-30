import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Redis client for Docker environment
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

const redisClient = createClient(redisOptions);

// Redis event handlers
redisClient.on('connect', () => console.log('[✅] Redis client connected'));
redisClient.on('ready', () => console.log('[🚀] Redis client ready'));
redisClient.on('error', (err) => console.error('[❌] Redis error:', err));

/**
 * Connect to Redis
 */
export const connectRedis = async () => {
  try {
    await redisClient.connect();
    console.log('[✅] Redis connected successfully');
  } catch (err) {
    console.warn('[⚠️] Redis connection failed:', err.message);
    // Don't throw - allow graceful degradation
  }
};

/**
 * Set a value in Redis with optional TTL (seconds)
 */
export const setCache = async (key, value, ttl = 120) => {
  try {
    const data = typeof value === 'string' ? value : JSON.stringify(value);
    await redisClient.set(key, data, { EX: ttl });
  } catch (err) {
    console.warn('[⚠️] Redis setCache error:', err.message);
  }
};

/**
 * Get a value from Redis
 */
export const getCache = async (key) => {
  try {
    const data = await redisClient.get(key);
    if (!data) return null;
    try {
      return JSON.parse(data);
    } catch {
      return data;
    }
  } catch (err) {
    console.warn('[⚠️] Redis getCache error:', err.message);
    return null;
  }
};

/**
 * Delete a key from Redis
 */
export const delCache = async (key) => {
  try {
    await redisClient.del(key);
  } catch (err) {
    console.warn('[⚠️] Redis delCache error:', err.message);
  }
};

export default redisClient;
