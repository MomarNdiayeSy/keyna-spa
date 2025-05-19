import api from './api';

const authService = {
    login: async (email, password) => {
        return api.post('/api/auth/login', { email, password });
    },
    register: async ({ name, email, password }) => {
        return api.post('/api/auth/register', { name, email, password });
    },
    logout: () => {
        localStorage.removeItem('token');
    },
};

export default authService;