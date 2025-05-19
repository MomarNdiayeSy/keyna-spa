import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import authService from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setUser({ email: decoded.email, role: decoded.role });
            } catch (err) {
                console.error('Erreur de décodage du token:', err);
                localStorage.removeItem('token');
            }
        }
    }, []);

    const login = async (email, password) => {
        try {
            const response = await authService.login(email, password);
            const token = response.data.token;
            localStorage.setItem('token', token);
            const decoded = jwtDecode(token);
            setUser({ email: decoded.email, role: decoded.role });
            return decoded.role; // Retourner le rôle pour la redirection
        } catch (err) {
            throw new Error(err.response?.data?.error || 'Erreur de connexion');
        }
    };

    const logout = () => {
        authService.logout();
        setUser(null);
        localStorage.removeItem('token');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};