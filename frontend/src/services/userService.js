import api from './api';

export const getUsers = async () => {
    try {
        const response = await api.get('/api/users');
        return response.data;
    } catch (err) {
        console.error('Erreur lors de la récupération des utilisateurs:', err.response?.data || err.message);
        throw err;
    }
};

export const createUser = async (user) => {
    try {
        const response = await api.post('/api/users', user);
        return response.data;
    } catch (err) {
        console.error('Erreur lors de la création de l’utilisateur:', err.response?.data || err.message);
        throw err;
    }
};

export const updateUser = async (id, user) => {
    try {
        const response = await api.put(`/api/users/${id}`, user);
        return response.data;
    } catch (err) {
        console.error('Erreur lors de la mise à jour de l’utilisateur:', err.response?.data || err.message);
        throw err;
    }
};

export const deleteUser = async (id) => {
    try {
        const response = await api.delete(`/api/users/${id}`);
        return response.data;
    } catch (err) {
        console.error('Erreur lors de la suppression de l’utilisateur:', err.response?.data || err.message);
        throw err;
    }
};