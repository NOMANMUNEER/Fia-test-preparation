import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

const API_URL = import.meta.env.VITE_API_URL || 'https://project-production-7d46.up.railway.app/api';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    // On mount, if token exists, fetch user profile
    useEffect(() => {
        const loadUser = async () => {
            if (token) {
                try {
                    const res = await axios.get(`${API_URL}/auth/me`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setUser(res.data.data);
                } catch (err) {
                    // Token invalid or expired
                    localStorage.removeItem('token');
                    setToken(null);
                    setUser(null);
                }
            }
            setLoading(false);
        };
        loadUser();
    }, [token]);

    const login = async (email, password) => {
        const res = await axios.post(`${API_URL}/auth/login`, { email, password });
        const { token: newToken, data } = res.data;
        localStorage.setItem('token', newToken);
        setToken(newToken);
        setUser(data);
        return data;
    };

    const signup = async (name, email, password) => {
        const res = await axios.post(`${API_URL}/auth/signup`, { name, email, password });
        const { token: newToken, data } = res.data;
        localStorage.setItem('token', newToken);
        setToken(newToken);
        setUser(data);
        return data;
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    const isAuthenticated = !!user;
    const isPremium = user?.role === 'premium' || user?.role === 'admin';

    return (
        <AuthContext.Provider value={{
            user, token, loading,
            login, signup, logout,
            isAuthenticated, isPremium
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
};

export default AuthContext;
