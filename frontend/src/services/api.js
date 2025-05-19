import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000',
    headers: { 'Content-Type': 'application/json' },
});

// Intercepteur pour ajouter le token (optionnel, vérifiez si présent)
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token && !config.url.includes('/auth')) { // Ne pas ajouter pour /auth/register ou /auth/login
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;