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
      console.log('[✅] Connected to RabbitMQ');

      channel = await connection.createChannel();
      await channel.assertQueue('post_created', { durable: true });

      connection.on('error', (err) => console.error('[❌] RabbitMQ Connection Error:', err));
      connection.on('close', () => console.log('[⚠️] RabbitMQ Connection Closed.'));

      return channel;
    } catch (error) {
      console.error(`[❌] RabbitMQ Connection Failed (Attempt ${i + 1}/${retries}):`, error.message);
      if (i === retries - 1) {
        console.error('[❌] Exhausted retries. Exiting...');
        process.exit(1);
      }
      await new Promise((res) => setTimeout(res, delay));
    }
  }
};

export const getChannel = () => {
  if (!channel) throw new Error('RabbitMQ channel is not initialized');
  return channel;
};
