import Post from '../Models/Postmodel.js';
import slugify from 'slugify';
import { getCache, setCache, delCache } from '../config/redisCache.js';
import { getChannel } from '../config/rabbitmq.js'; // Assuming this exists for publishing

export const createPost = async (req, res) => {
  try {
    const { title, content, excerpt, status, publishedAt, imageUrl } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    const slug = slugify(title, { lower: true, strict: true });

    const existingPost = await Post.findOne({ slug });
    if (existingPost) {
      return res.status(400).json({ message: 'Post with this title already exists' });
    }

    const newPost = await Post.create({
      authorId: String(req.user.id),
      title,
      slug,
      content,
      imageUrl: imageUrl || '',
      excerpt: excerpt || content.substring(0, 150),
      status: status || 'draft',
      publishedAt: publishedAt || (status === 'published' ? new Date() : null),
    });

    // Publish message to RabbitMQ with error handling
    try {
      const channel = getChannel();
      const queue = 'post_created';
      const message = {
        id: newPost._id,
        title: newPost.title,
        authorId: newPost.authorId,
        status: newPost.status,
        publishedAt: newPost.publishedAt,
      };
      channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), { persistent: true });
      console.log('[✅📤] Post created event successfully sent to RabbitMQ:', message);
    } catch (mqErr) {
      console.error('[⚠️] RabbitMQ publish error (post will still be created):', mqErr.message);
    }

    // Invalidate cache
    await delCache('posts:all');

    res.status(201).json({ message: 'Post created successfully', post: newPost });
  } catch (error) {
    console.error('Create Post Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getAllPosts = async (req, res) => {
  const cacheKey = 'posts:all';
  try {
    const cached = await getCache(cacheKey);
    if (cached) return res.status(200).json({ posts: cached, cached: true });

    const posts = await Post.find({ isDeleted: false })
      .sort({ createdAt: -1 });

    await setCache(cacheKey, posts, 120); // cache for 2 minutes
    res.status(200).json({ posts, cached: false });
  } catch (error) {
    console.error('Get All Posts Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getPostById = async (req, res) => {
  const cacheKey = `post:${req.params.id}`;
  try {
    const cached = await getCache(cacheKey);
    if (cached) return res.status(200).json({ post: cached, cached: true });

    const post = await Post.findOne({ _id: req.params.id, isDeleted: false });

    if (!post) return res.status(404).json({ message: 'Post not found' });

    await setCache(cacheKey, post, 120);
    res.status(200).json({ post, cached: false });
  } catch (error) {
    console.error('Get Post By ID Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updatePost = async (req, res) => {
  try {
    const { title, content, excerpt, status, publishedAt, imageUrl } = req.body;
    const post = await Post.findOne({ _id: req.params.id, isDeleted: false });

    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (post.authorId.toString() !== String(req.user.id)) return res.status(403).json({ message: 'Unauthorized' });

    if (title) {
      post.title = title;
      post.slug = slugify(title, { lower: true, strict: true });
    }
    if (content) post.content = content;
    if (excerpt) post.excerpt = excerpt;
    if (status) post.status = status;
    if (publishedAt) post.publishedAt = publishedAt;
    if (imageUrl) post.imageUrl = imageUrl;

    await post.save();

    // Invalidate cache
    await delCache('posts:all');
    await delCache(`post:${post._id}`);

    res.status(200).json({ message: 'Post updated successfully', post });
  } catch (error) {
    console.error('Update Post Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deletePost = async (req, res) => {
  try {
    const post = await Post.findOne({ _id: req.params.id, isDeleted: false });
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (post.authorId.toString() !== String(req.user.id)) return res.status(403).json({ message: 'Unauthorized' });

    post.isDeleted = true;
    await post.save();

    // Invalidate cache
    await delCache('posts:all');
    await delCache(`post:${post._id}`);

    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Delete Post Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
