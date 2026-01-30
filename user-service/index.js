import express from 'express';
import dotenv from 'dotenv';
import pool from './config/db.js';
import authRoutes from './Routes/authRoutes.js';
import { connectToRabbitMQ } from './config/rabbitmq.js';
import redisClient, { connectRedis } from './config/redis.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logger
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);

// Dedicated health check route for Docker
app.get('/api/auth/health', async (req, res) => {
  try {
    // Check DB
    const dbCheck = await pool.query('SELECT NOW()');

    // Check Redis
    await redisClient.set('healthcheck', 'ok', { EX: 10 });
    const redisStatus = await redisClient.get('healthcheck');

    res.status(200).json({
      status: 'ok',
      service: 'user-service',
      database: 'connected',
      redis: redisStatus === 'ok' ? 'connected' : 'disconnected'
    });
  } catch (err) {
    console.error('[❌] Health check failed:', err);
    res.status(503).json({
      status: 'error',
      service: 'user-service',
      error: err.message
    });
  }
});

// Root health check (backward compatibility)
app.get('/', async (req, res) => {
  try {
    const dbCheck = await pool.query('SELECT NOW()');
    await redisClient.set('healthcheck', 'ok', { EX: 10 });
    const redisStatus = await redisClient.get('healthcheck');

    res.status(200).json({
      message: 'User Service Running',
      database: dbCheck.rows[0].now,
      redis: redisStatus === 'ok' ? 'connected' : 'disconnected'
    });
  } catch (err) {
    console.error('[❌] Health check failed:', err);
    res.status(500).json({ message: 'Service unhealthy', error: err.message });
  }
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('[❌] Express Error:', err);
  res.status(500).json({ message: 'Internal server error' });
});

// Start server with graceful shutdown
const startServer = async () => {
  let server;

  try {
    // Test DB connection with retry
    let dbConnected = false;
    for (let i = 0; i < 5; i++) {
      try {
        await pool.query('SELECT 1');
        console.log('[✅] Database connected');
        dbConnected = true;
        break;
      } catch (err) {
        if (i < 4) {
          console.warn(`[⚠️] DB connection attempt ${i + 1} failed, retrying...`);
          await new Promise(resolve => setTimeout(resolve, 2000));
        } else {
          console.error('[❌] Database connection failed:', err.message);
        }
      }
    }

    // Connect to Redis (graceful degradation if fails)
    try {
      await connectRedis();
      console.log('[✅] Redis ready');
    } catch (err) {
      console.warn('[⚠️] Redis unavailable, continuing without cache');
    }

    // Connect to RabbitMQ with retry
    try {
      await connectToRabbitMQ();
      console.log('[✅] RabbitMQ ready');
    } catch (err) {
      console.error('[❌] RabbitMQ connection failed:', err.message);
      process.exit(1);
    }

    // Test Redis connection
    try {
      await redisClient.set('startup_check', 'ok', { EX: 10 });
      const value = await redisClient.get('startup_check');
      console.log(`[✅] Redis test key: ${value}`);
    } catch (err) {
      console.warn(`[⚠️] Redis test failed: ${err.message}`);
    }

    // Start Express server
    server = app.listen(PORT, () => {
      console.log(`[🚀] User Service running on port ${PORT}`);
    });

    // Graceful shutdown on SIGTERM
    process.on('SIGTERM', async () => {
      console.log('[⚠️] SIGTERM received, shutting down gracefully...');
      server.close(async () => {
        console.log('[✅] Express server closed');
        try {
          await pool.end();
          console.log('[✅] Database pool closed');
        } catch (e) {
          console.warn('[⚠️] Error closing pool:', e.message);
        }
        try {
          await redisClient.quit();
          console.log('[✅] Redis connection closed');
        } catch (e) {
          console.warn('[⚠️] Error closing Redis:', e.message);
        }
        process.exit(0);
      });
    });

    // Graceful shutdown on SIGINT
    process.on('SIGINT', async () => {
      console.log('[⚠️] SIGINT received, shutting down gracefully...');
      server.close(async () => {
        console.log('[✅] Express server closed');
        try {
          await pool.end();
          console.log('[✅] Database pool closed');
        } catch (e) {
          console.warn('[⚠️] Error closing pool:', e.message);
        }
        try {
          await redisClient.quit();
          console.log('[✅] Redis connection closed');
        } catch (e) {
          console.warn('[⚠️] Error closing Redis:', e.message);
        }
        process.exit(0);
      });
    });

  } catch (err) {
    console.error('[❌] Startup failed:', err);
    process.exit(1);
  }
};

startServer();
