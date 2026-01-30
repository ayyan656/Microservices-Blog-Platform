import { getChannel } from '../config/rabbitmq.js';
import Comment from '../Models/Commentmodel.js'; // Your Comment model

export const listenToPostCreated = async () => {
  const channel = getChannel();
  const queue = 'post_created';

  await channel.assertQueue(queue, { durable: true });

  channel.consume(queue, async (msg) => {
    if (msg !== null) {
      const post = JSON.parse(msg.content.toString());
      console.log('[📥] Received post_created event in Comment Service:', post);

      try {
        // Example: Create a default comment
        // Optional: you can skip this if you don't want default comments
        await Comment.create({
          postId: post.id,
          authorName: 'System',
          content: 'Welcome! Be the first to comment on this post.'
        });

        console.log('[✅] Default comment created for post:', post.id);
      } catch (err) {
        console.error('[❌] Failed to process post_created event:', err.message);
      }

      channel.ack(msg);
    }
  }, { noAck: false });
};
