import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { connectToRabbitMQ } from './config/rabbitmq.js';
import { listenToPostCreated } from './consumers/postConsumer.js';
import { connectRedis, client as redisClient } from './config/redis.js';
import commentRoutes from './Routes/Commentroute.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5002;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check Route for Docker
app.get('/api/comments/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'comment-service',
    database: 'connected',
    redis: 'connected'
  });
});

// Root health check (backward compatibility)
app.get('/', (req, res) => {
  res.json({ message: 'Comment Service Running' });
});

// API Routes
app.use('/api/comments', commentRoutes);

// Error handler
app.use((err, req, res, next) => {
  console.error('[❌] Express Error:', err);
  res.status(500).json({ message: 'Internal server error' });
});

// Start Server Function
const startServer = async () => {
  let server;

  try {
    // 1️⃣ Connect to Database with retry
    await connectDB();
    console.log('[✅] Database connected');

    // 2️⃣ Connect to Redis (graceful degradation)
    try {
      await connectRedis();
      console.log('[✅] Redis ready');
    } catch (err) {
      console.warn('[⚠️] Redis unavailable, continuing without cache');
    }

    // 3️⃣ Connect to RabbitMQ
    try {
      await connectToRabbitMQ();
      console.log('[✅] RabbitMQ connected');

      // 4️⃣ Start RabbitMQ Consumer
      await listenToPostCreated();
      console.log('[✅] RabbitMQ consumer initialized for post_created events');
    } catch (err) {
      console.warn('[⚠️] RabbitMQ unavailable, message queue features will not work');
    }

    // 5️⃣ Start Express server
    server = app.listen(PORT, () => {
      console.log(`[🚀] Comment Service running on port ${PORT}`);
    });

    // Graceful shutdown on SIGTERM
    process.on('SIGTERM', async () => {
      console.log('[⚠️] SIGTERM received, shutting down gracefully...');
      server.close(async () => {
        console.log('[✅] Express server closed');
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
          await redisClient.quit();
          console.log('[✅] Redis connection closed');
        } catch (e) {
          console.warn('[⚠️] Error closing Redis:', e.message);
        }
        process.exit(0);
      });
    });

  } catch (error) {
    console.error('[❌] Failed to start Comment Service:', error);
    process.exit(1);
  }
};

startServer();
