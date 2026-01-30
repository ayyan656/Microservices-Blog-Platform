import express from 'express';
import CommentController from '../Controllers/Commentcontroller.js';
import authenticate from '../Middleware/auth.middleware.js';

const router = express.Router();

// Public Routes
router.get('/post/:postId', CommentController.getCommentsByPost);
router.post('/', CommentController.createComment);

/**
 * Protected Routes
 */
router.use(authenticate);

router.put('/:id', CommentController.updateComment);
router.delete('/:id', CommentController.deleteComment);

export default router;
