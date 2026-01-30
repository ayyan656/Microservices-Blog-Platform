import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

/**
 * Admin-only middleware
 * Requires user to be authenticated AND have admin role
 */
export const requireAdmin = (req, res, next) => {
    try {
        // 1. Check if user is authenticated (should be used after auth middleware)
        if (!req.user) {
            return res.status(401).json({
                message: 'Authentication required'
            });
        }

        // 2. Check if user has admin role
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                message: 'Admin access required'
            });
        }

        next();
    } catch (error) {
        return res.status(500).json({
            message: 'Authorization check failed'
        });
    }
};

export default requireAdmin;
