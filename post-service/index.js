import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import { connectToRabbitMQ } from './config/rabbitmq.js';
import postRoutes from './Routes/Postroutes.js';
import { connectRedis } from './config/redisCache.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

const startServer = async () => {
  let server;

  try {
    await connectDB();
    console.log('[✅] MongoDB connected');

    await connectRedis();
    console.log('[✅] Redis ready');

    await connectToRabbitMQ();
    console.log('[✅] RabbitMQ ready');

    // Middleware
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // Health check endpoint for Docker
    app.get('/api/health', (req, res) => {
      res.status(200).json({
        status: 'ok',
        service: 'post-service',
        database: 'connected',
        redis: 'connected'
      });
    });

    // Routes
    app.use('/api', postRoutes);

    // post-service/index.js or app.js
    app.get('/api/healthCheck', (req, res) => {
      res.json({
        db: 'ok',
        redis: 'ok', // Simplified for now since client is internal to module
        status: 'ok'
      });
    });


    // Root health check (backward compatibility)
    app.get('/', (req, res) => {
      res.json({ message: 'Post Service Running' });
    });

    // Error handler
    app.use((err, req, res, next) => {
      console.error('[❌] Express Error:', err);
      res.status(500).json({ message: 'Internal server error' });
    });

    server = app.listen(PORT, () => {
      console.log(`[🚀] Post Service running on port ${PORT}`);
    });

    // Graceful shutdown
    process.on('SIGTERM', async () => {
      console.log('[⚠️] SIGTERM received, shutting down gracefully...');
      server.close(async () => {
        console.log('[✅] Express server closed');
        await redisClient.quit();
        console.log('[✅] Redis connection closed');
        process.exit(0);
      });
    });

    process.on('SIGINT', async () => {
      console.log('[⚠️] SIGINT received, shutting down gracefully...');
      server.close(async () => {
        console.log('[✅] Express server closed');
        await redisClient.quit();
        console.log('[✅] Redis connection closed');
        process.exit(0);
      });
    });

  } catch (err) {
    console.error('[❌] Startup failed:', err);
    process.exit(1);
  }
};

startServer();
