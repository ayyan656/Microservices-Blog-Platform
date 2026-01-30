/**
 * Editorial API Layer
 * Fetches data from existing APIs and transforms for W&D UI
 * 
 * This layer centralizes all data transformation so UI components
 * receive clean, pre-processed data ready for rendering.
 */

import { getAllPosts, getPostById } from './posts.api';
import {
    transformPost,
    transformPosts,
    EDITORIAL_CATEGORIES
} from '../utils/editorial.utils';

// ============================================
// EDITORIAL API FUNCTIONS
// ============================================

/**
 * Get all posts transformed for editorial display
 * Filters to only published posts by default
 * @param {Object} options - Filtering options
 * @param {boolean} options.includeAll - Include drafts (for admin view)
 * @param {string} options.category - Filter by category
 * @returns {Promise<{posts: TransformedPost[], categories: string[]}>}
 */
export const getEditorialPosts = async (options = {}) => {
    const { includeAll = false, category = null } = options;

    try {
        const response = await getAllPosts();
        const rawPosts = response.posts || [];

        // Transform all posts
        let posts = transformPosts(rawPosts);

        // Filter to published only (unless viewing drafts)
        if (!includeAll) {
            posts = posts.filter(post => post.status === 'published');
        }

        // Filter by category if specified
        if (category && category !== 'All') {
            posts = posts.filter(post => post.category === category);
        }

        return {
            posts,
            categories: EDITORIAL_CATEGORIES,
            cached: response.cached || false,
        };
    } catch (error) {
        console.error('getEditorialPosts error:', error);
        throw error;
    }
};

/**
 * Get single post with full transformation
 * @param {string} id - Post ID
 * @returns {Promise<{post: TransformedPost}>}
 */
export const getEditorialPost = async (id) => {
    try {
        const response = await getPostById(id);
        const post = transformPost(response.post);

        return {
            post,
            cached: response.cached || false,
        };
    } catch (error) {
        console.error('getEditorialPost error:', error);
        throw error;
    }
};

/**
 * Get homepage data structured for editorial layout
 * Returns hero post, grid posts, and latest posts sections
 * @returns {Promise<{heroPost, gridPosts, latestPosts, categories}>}
 */
export const getHomePageData = async () => {
    try {
        const { posts, categories } = await getEditorialPosts();

        // No posts available
        if (posts.length === 0) {
            return {
                heroPost: null,
                gridPosts: [],
                latestPosts: [],
                categories,
            };
        }

        // First post is the hero (featured)
        const heroPost = posts[0];

        // Next 3 posts for the editorial grid
        const gridPosts = posts.slice(1, 4);

        // Remaining posts for "Latest" section
        const latestPosts = posts.slice(4);

        return {
            heroPost,
            gridPosts,
            latestPosts,
            categories,
        };
    } catch (error) {
        console.error('getHomePageData error:', error);
        throw error;
    }
};

/**
 * Get related posts based on category matching
 * @param {string} currentPostId - Current post ID to exclude
 * @param {string} category - Category to match
 * @param {number} limit - Max posts to return
 * @returns {Promise<{posts: TransformedPost[]}>}
 */
export const getRelatedPosts = async (currentPostId, category, limit = 3) => {
    try {
        const { posts } = await getEditorialPosts({ category });

        // Exclude current post and limit results
        const relatedPosts = posts
            .filter(post => post.id !== currentPostId)
            .slice(0, limit);

        return { posts: relatedPosts };
    } catch (error) {
        console.error('getRelatedPosts error:', error);
        throw error;
    }
};

/**
 * Get posts by author
 * @param {string} authorId - Author ID
 * @returns {Promise<{posts: TransformedPost[]}>}
 */
export const getPostsByAuthor = async (authorId) => {
    try {
        const { posts } = await getEditorialPosts();

        const authorPosts = posts.filter(
            post => post.author.id === String(authorId)
        );

        return { posts: authorPosts };
    } catch (error) {
        console.error('getPostsByAuthor error:', error);
        throw error;
    }
};

// Re-export categories for easy access
export { EDITORIAL_CATEGORIES };
