import { createContext, useState, useEffect } from 'react';
import { getProfile } from '../api/auth.api';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('authToken');

    useEffect(() => {
        // Fetch user profile if token exists
        if (token) {
            getProfile()
                .then((data) => {
                    setUser(data.user);
                })
                .catch((error) => {
                    console.error('Failed to fetch profile:', error);
                    localStorage.removeItem('authToken');
                })
                .finally(() => {
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    }, [token]);

    const isAuthenticated = !!token && !!user;
    const isAdmin = user?.role === 'admin';

    const value = {
        user,
        setUser,
        loading,
        isAuthenticated,
        isAdmin,
        token,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}
