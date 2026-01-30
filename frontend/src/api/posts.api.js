import axios from './axios.config';

/**
 * Get all posts
 * @returns {Promise} - { posts, cached }
 */
export const getAllPosts = async () => {
    const response = await axios.get('/api/posts');
    return response.data;
};

/**
 * Get single post by ID
 * @param {string} id - Post ID
 * @returns {Promise} - { post, cached }
 */
export const getPostById = async (id) => {
    const response = await axios.get(`/api/posts/${id}`);
    return response.data;
};

/**
 * Create new post
 * @param {Object} data - { title, content, excerpt, status }
 * @returns {Promise} - { message, post }
 */
export const createPost = async (data) => {
    const config = {};
    if (data instanceof FormData) {
        config.headers = { 'Content-Type': 'multipart/form-data' };
    }
    const response = await axios.post('/api/posts', data, config);
    return response.data;
};

/**
 * Update existing post
 * @param {string} id - Post ID
 * @param {Object} data - { title, content, excerpt, status }
 * @returns {Promise} - { message, post }
 */
export const updatePost = async (id, data) => {
    const config = {};
    if (data instanceof FormData) {
        config.headers = { 'Content-Type': 'multipart/form-data' };
    }
    const response = await axios.put(`/api/posts/${id}`, data, config);
    return response.data;
};

/**
 * Delete post
 * @param {string} id - Post ID
 * @returns {Promise} - { message }
 */
export const deletePost = async (id) => {
    const response = await axios.delete(`/api/posts/${id}`);
    return response.data;
};

/**
 * Publish a draft post
 * @param {string} id - Post ID
 * @returns {Promise} - { message, post }
 */
export const publishPost = async (id) => {
    const response = await axios.put(`/api/posts/${id}`, {
        status: 'published',
        publishedAt: new Date().toISOString(),
    });
    return response.data;
};
