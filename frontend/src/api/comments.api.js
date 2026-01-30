import axios from './axios.config';

/**
 * Get comments for a post
 * @param {string} postId - Post ID
 * @returns {Promise} - { data, cached }
 */
export const getCommentsByPost = async (postId) => {
    const response = await axios.get(`/api/comments/post/${postId}`);
    return response.data;
};

/**
 * Create new comment
 * @param {Object} data - { postId, content, parentCommentId }
 * @returns {Promise} - { success, data }
 */
export const createComment = async (data) => {
    const response = await axios.post('/api/comments', data);
    return response.data;
};

/**
 * Update comment
 * @param {number} id - Comment ID
 * @param {Object} data - { content }
 * @returns {Promise} - { success, data }
 */
export const updateComment = async (id, data) => {
    const response = await axios.put(`/api/comments/${id}`, data);
    return response.data;
};

/**
 * Delete comment
 * @param {number} id - Comment ID
 * @returns {Promise} - { success }
 */
export const deleteComment = async (id) => {
    const response = await axios.delete(`/api/comments/${id}`);
    return response.data;
};
