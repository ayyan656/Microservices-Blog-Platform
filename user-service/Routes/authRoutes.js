import express from 'express';
import { signup, login, getProfile } from '../Controllers/userController.js';
import { auth } from '../Middleware/auth.middleware.js';
import { rateLimiter } from '../Middleware/rateLimiter.js';

const router = express.Router();

// Limit to 5 requests per minute per IP
router.post('/signup', rateLimiter(5, 60), signup);
router.post('/login', rateLimiter(5, 60), login);

// Protected route
router.get('/profile', auth, getProfile);

export default router;
