/**
 * Handle API errors and return user-friendly messages
 */
export const handleApiError = (error) => {
    if (error.response) {
        const { status, data } = error.response;

        switch (status) {
            case 400:
                return data.message || 'Invalid request. Please check your input.';
            case 401:
                return 'Please login to continue.';
            case 403:
                return 'You do not have permission for this action.';
            case 404:
                return 'Resource not found.';
            case 409:
                return data.message || 'This resource already exists.';
            case 429:
                return `Too many requests. Try again in ${data.retryAfter || 60} seconds.`;
            case 500:
                return 'Server error. Please try again later.';
            default:
                return data.message || 'An error occurred. Please try again.';
        }
    }

    if (error.request) {
        return 'Network error. Please check your internet connection.';
    }

    return error.message || 'An unexpected error occurred.';
};

/**
 * Format date for display
 */
export const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};

/**
 * Format relative time (e.g., "2 hours ago")
 */
export const formatRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;

    return formatDate(dateString);
};
