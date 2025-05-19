import api from './api';

export const getServices = async () => {
    try {
        const response = await api.get('/api/services');
        return response.data;
    } catch (err) {
        console.error('Erreur lors de la récupération des services:', err.response?.data || err.message);
        throw err;
    }
};

export const createService = async (service) => {
    try {
        const response = await api.post('/api/services', service, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    } catch (err) {
        console.error('Erreur lors de la création du service:', err.response?.data || err.message);
        throw err;
    }
};

export const updateService = async (id, service) => {
    try {
        const response = await api.put(`/api/services/${id}`, service, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    } catch (err) {
        console.error('Erreur lors de la mise à jour du service:', err.response?.data || err.message);
        throw err;
    }
};

export const deleteService = async (id) => {
    try {
        const response = await api.delete(`/api/services/${id}`);
        return response.data;
    } catch (err) {
        console.error('Erreur lors de la suppression du service:', err.response?.data || err.message);
        throw err;
    }
};