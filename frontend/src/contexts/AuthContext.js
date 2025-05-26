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
        // Vérifier si le token est expiré
        if (decoded.exp * 1000 > Date.now()) {
          setUser({
            userId: decoded.userId,
            email: decoded.email,
            name: decoded.name,
            phone_number: decoded.phone_number,
            role: decoded.role,
          });
        } else {
          localStorage.removeItem('token');
          setUser(null);
        }
      } catch (err) {
        console.error('Erreur de décodage du token:', err);
        localStorage.removeItem('token');
        setUser(null);
      }
    }
  }, []);

  const login = async (email, password) => {
    try {
      const response = await authService.login(email, password);
      const { token, user: userData } = response.data;
      localStorage.setItem('token', token);
      const decoded = jwtDecode(token);
      setUser({
        userId: decoded.userId,
        email: decoded.email,
        name: decoded.name || userData.name,
        phone_number: decoded.phone_number || userData.phone_number,
        role: decoded.role,
      });
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