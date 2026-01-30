/**
 * Editorial Utility Functions
 * Pure functions for data transformation - used by editorial.api.js
 */

// ============================================
// CONSTANTS
// ============================================

/**
 * Static categories for the editorial UI
 * (Backend doesn't have categories in schema)
 */
export const EDITORIAL_CATEGORIES = [
    'Lifestyle',
    'Interiors & Decor',
    'Travel & Leisure',
    'Career',
    'Wellness',
    'Technology',
];

/**
 * Words per minute for read time calculation
 */
const WORDS_PER_MINUTE = 200;

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Calculate reading time from content
 * @param {string} content - HTML content string
 * @returns {number} Reading time in minutes
 */
export const getReadTime = (content) => {
    if (!content) return 1;

    // Strip HTML tags
    const textContent = content.replace(/<[^>]*>/g, '');

    // Count words
    const words = textContent.split(/\s+/).filter(Boolean).length;

    // Calculate minutes (minimum 1 minute)
    return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
};

/**
 * Format date in editorial style
 * @param {string|Date} dateString - Date to format
 * @returns {string} Formatted date like "January 30, 2026"
 */
export const formatEditorialDate = (dateString) => {
    if (!dateString) return '';

    try {
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        }).format(new Date(dateString));
    } catch {
        return '';
    }
};

/**
 * Format date as short version
 * @param {string|Date} dateString - Date to format
 * @returns {string} Formatted date like "Jan 30, 2026"
 */
export const formatShortDate = (dateString) => {
    if (!dateString) return '';

    try {
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        }).format(new Date(dateString));
    } catch {
        return '';
    }
};

/**
 * Generate avatar URL using DiceBear API
 * @param {string} authorId - Author ID for seed
 * @returns {string} Avatar URL
 */
export const getAuthorAvatarUrl = (authorId) => {
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${authorId}`;
};

/**
 * Extract or assign a category from post
 * Since backend doesn't have categories, we derive one based on content keywords
 * @param {Object} post - Raw post object
 * @returns {string} Category name
 */
export const extractCategory = (post) => {
    const content = (post.title + ' ' + (post.excerpt || '')).toLowerCase();

    // Simple keyword matching (can be enhanced)
    if (content.includes('travel') || content.includes('vacation') || content.includes('trip')) {
        return 'Travel & Leisure';
    }
    if (content.includes('home') || content.includes('decor') || content.includes('interior') || content.includes('design')) {
        return 'Interiors & Decor';
    }
    if (content.includes('career') || content.includes('work') || content.includes('job') || content.includes('business')) {
        return 'Career';
    }
    if (content.includes('health') || content.includes('wellness') || content.includes('fitness')) {
        return 'Wellness';
    }
    if (content.includes('tech') || content.includes('code') || content.includes('software') || content.includes('react')) {
        return 'Technology';
    }

    // Default category
    return 'Lifestyle';
};

/**
 * Transform a single raw post to editorial format
 * @param {Object} rawPost - Raw post from API
 * @returns {Object} Transformed post with computed fields
 */
export const transformPost = (rawPost) => {
    if (!rawPost) return null;

    const authorId = String(rawPost.authorId);

    return {
        // Core fields (renamed for clarity)
        id: rawPost._id,
        title: rawPost.title,
        slug: rawPost.slug,
        imageUrl: rawPost.imageUrl || '',
        excerpt: rawPost.excerpt || '',
        content: rawPost.content,
        status: rawPost.status,
        publishedAt: rawPost.publishedAt,
        createdAt: rawPost.createdAt,

        // Computed fields (W&D workarounds)
        readTime: getReadTime(rawPost.content),
        formattedDate: formatEditorialDate(rawPost.publishedAt || rawPost.createdAt),
        shortDate: formatShortDate(rawPost.publishedAt || rawPost.createdAt),
        category: extractCategory(rawPost),

        // Author object with placeholder name and DiceBear avatar
        author: {
            id: authorId,
            name: `User #${authorId}`,
            avatarUrl: getAuthorAvatarUrl(authorId),
        },

        // Metrics (renamed from *Count for cleaner access)
        likes: rawPost.likesCount || 0,
        views: rawPost.viewsCount || 0,
        comments: rawPost.commentsCount || 0,
    };
};

/**
 * Transform an array of posts
 * @param {Array} rawPosts - Array of raw posts
 * @returns {Array} Array of transformed posts
 */
export const transformPosts = (rawPosts) => {
    if (!Array.isArray(rawPosts)) return [];
    return rawPosts.map(transformPost).filter(Boolean);
};

/**
 * Format large numbers with K/M suffix
 * @param {number} num - Number to format
 * @returns {string} Formatted number
 */
export const formatNumber = (num) => {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return String(num);
};
