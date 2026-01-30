import CommentModel from '../Models/Commentmodel.js';
import { getCache, setCache, delCache } from '../config/redisCache.js';

class CommentController {
  static async createComment(req, res) {
    try {
      const { postId, content, parentCommentId, authorName } = req.body;
      const userId = req.user?.id || null;
      const finalAuthorName = userId ? null : (authorName || 'Anonymous');

      if (!postId || !content) return res.status(400).json({ success: false, message: 'postId and content required' });

      const commentId = await CommentModel.create({ postId, userId, content, parentCommentId, authorName: finalAuthorName });

      // Invalidate cache for post comments
      await delCache(`comments:post:${postId}`);

      return res.status(201).json({ success: true, data: { commentId } });
    } catch (error) {
      console.error('Create Comment Error:', error);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  static async getCommentsByPost(req, res) {
    const cacheKey = `comments:post:${req.params.postId}`;
    try {
      const cached = await getCache(cacheKey);
      if (cached) return res.status(200).json({ data: cached, cached: true });

      const comments = await CommentModel.findByPost(req.params.postId);
      await setCache(cacheKey, comments, 120); // cache for 2 minutes

      return res.status(200).json({ data: comments, cached: false });
    } catch (error) {
      console.error('Get Comments Error:', error);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  static async updateComment(req, res) {
    try {
      const { id } = req.params;
      const { content } = req.body;
      const userId = req.user.id;

      if (!content) return res.status(400).json({ success: false, message: 'Content is required' });

      const comment = await CommentModel.findById(id);
      if (!comment || comment.status !== 'active') return res.status(404).json({ success: false, message: 'Comment not found' });
      if (comment.user_id !== userId) return res.status(403).json({ success: false, message: 'Unauthorized' });

      await CommentModel.update(id, content);

      // Invalidate cache for post comments
      await delCache(`comments:post:${comment.postId}`);

      return res.status(200).json({ success: true, message: 'Comment updated' });
    } catch (error) {
      console.error('Update Comment Error:', error);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }

  static async deleteComment(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const comment = await CommentModel.findById(id);
      if (!comment || comment.status !== 'active') return res.status(404).json({ success: false, message: 'Comment not found' });
      if (comment.user_id !== userId) return res.status(403).json({ success: false, message: 'Unauthorized' });

      await CommentModel.delete(id);

      // Invalidate cache for post comments
      await delCache(`comments:post:${comment.postId}`);

      return res.status(200).json({ success: true, message: 'Comment deleted' });
    } catch (error) {
      console.error('Delete Comment Error:', error);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }
}

export default CommentController;
