import { createPost, getAllPosts, getPostById, updatePost, deletePost } from '../Controllers/Postcontroller.js';
import express from 'express';
import Auth from '../Middleware/auth.middleware.js';
import { uploadImage } from '../Middleware/upload.middleware.js';
const router = express.Router();

// Public Routes
router.get('/posts', getAllPosts);
router.get('/posts/:id', getPostById);

// Protected Routes
router.use(Auth);
router.post('/posts', uploadImage, createPost);
router.put('/posts/:id', uploadImage, updatePost);
router.delete('/posts/:id', deletePost);

export default router;