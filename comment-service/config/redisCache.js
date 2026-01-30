import { client as redisClient } from './redis.js';

/**
 * Get cached data by key
 */
export async function getCache(key) {
    try {
        if (!redisClient.isOpen) {
            console.warn('[⚠️] Redis not connected, skipping cache get');
            return null;
        }
        const data = await redisClient.get(key);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('[❌] Redis getCache error:', error.message);
        return null;
    }
}

/**
 * Set cache with TTL (in seconds)
 */
export async function setCache(key, value, ttl = 300) {
    try {
        if (!redisClient.isOpen) {
            console.warn('[⚠️] Redis not connected, skipping cache set');
            return false;
        }
        await redisClient.setEx(key, ttl, JSON.stringify(value));
        return true;
    } catch (error) {
        console.error('[❌] Redis setCache error:', error.message);
        return false;
    }
}

/**
 * Delete cached data by key
 */
export async function delCache(key) {
    try {
        if (!redisClient.isOpen) {
            console.warn('[⚠️] Redis not connected, skipping cache delete');
            return false;
        }
        await redisClient.del(key);
        return true;
    } catch (error) {
        console.error('[❌] Redis delCache error:', error.message);
        return false;
    }
}
