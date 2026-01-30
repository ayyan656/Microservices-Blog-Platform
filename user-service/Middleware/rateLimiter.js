import redisClient from '../config/redis.js';

/**
 * Redis-based rate limiter
 * @param {number} limit - max requests allowed
 * @param {number} windowSeconds - time window in seconds
 */
export const rateLimiter = (limit = 5, windowSeconds = 60) => {
  return async (req, res, next) => {
    try {
      const ip =
        req.ip ||
        req.headers['x-forwarded-for'] ||
        req.connection?.remoteAddress ||
        'unknown';

      const key = `rate:${ip}:${req.originalUrl}`;

      const current = await redisClient.incr(key);

      if (current === 1) {
        await redisClient.expire(key, windowSeconds);
      }

      res.setHeader('X-RateLimit-Limit', limit);
      res.setHeader('X-RateLimit-Remaining', Math.max(0, limit - current));
      res.setHeader(
        'X-RateLimit-Reset',
        Math.floor(Date.now() / 1000) + windowSeconds
      );

      if (current > limit) {
        return res.status(429).json({
          message: 'Too many requests. Please try again later.',
          retryAfter: windowSeconds
        });
      }

      next();
    } catch (err) {
      console.warn('[⚠️] Rate limiter Redis error (fail-open):', err.message);
      next(); // allow request if Redis fails
    }
  };
};

export default rateLimiter;
