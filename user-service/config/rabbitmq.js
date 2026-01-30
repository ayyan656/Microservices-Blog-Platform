import amqp from 'amqplib';
import dotenv from 'dotenv';

dotenv.config();

let channel;

export const connectToRabbitMQ = async (retries = 5, delay = 5000) => {
  for (let i = 0; i < retries; i++) {
    try {
      const connection = await amqp.connect(
        process.env.RABBITMQ_URL || 'amqp://guest:guest@rabbitmq:5672'
      );

      console.log('[✅] User Service connected to RabbitMQ');

      channel = await connection.createChannel();

      // Declare queues (events)
      await channel.assertQueue('user_created', { durable: true });
      await channel.assertQueue('user_logged_in', { durable: true });

      connection.on('error', (err) =>
        console.error('[❌] RabbitMQ error:', err)
      );

      connection.on('close', () =>
        console.warn('[⚠️] RabbitMQ connection closed')
      );

      return channel;
    } catch (err) {
      console.error(`[❌] RabbitMQ connection failed (Attempt ${i + 1}/${retries}):`, err.message);
      if (i === retries - 1) {
        console.error('[❌] Exhausted retries. Exiting...');
        process.exit(1);
      }
      await new Promise((res) => setTimeout(res, delay));
    }
  }
};

export const getChannel = () => {
  if (!channel) {
    throw new Error('RabbitMQ channel not initialized');
  }
  return channel;
};
