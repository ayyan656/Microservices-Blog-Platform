import axios from './axios.config';

/**
 * User signup
 * @param {Object} data - { name, email, password }
 * @returns {Promise} - { user, token }
 */
export const signup = async (data) => {
    const response = await axios.post('/api/auth/signup', data);
    if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
    }
    return response.data;
};

/**
 * User login
 * @param {Object} data - { email, password }
 * @returns {Promise} - { user, token }
 */
export const login = async (data) => {
    const response = await axios.post('/api/auth/login', data);
    if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
    }
    return response.data;
};

/**
 * Get user profile
 * @returns {Promise} - { user }
 */
export const getProfile = async () => {
    const response = await axios.get('/api/auth/profile');
    return response.data;
};

/**
 * Logout user
 */
export const logout = () => {
    localStorage.removeItem('authToken');
    window.location.href = '/login';
};
