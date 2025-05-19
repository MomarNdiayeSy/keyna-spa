import api from './api';

export const getVipOffers = async () => {
    try {
        const response = await api.get('/api/vip');
        console.log('Réponse offres VIP:', response.data);
        return response.data;
    } catch (err) {
        console.error('Erreur chargement offres VIP:', err.response?.data);
        throw err;
    }
};

export const createVipOffer = async (offer) => {
    try {
        const response = await api.post('/api/vip', offer, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        console.log('Réponse création offre VIP:', response.data);
        return response.data;
    } catch (err) {
        console.error('Erreur création offre VIP:', err.response?.data);
        throw err;
    }
};

export const updateVipOffer = async (id, offer) => {
    try {
        const response = await api.put(`/api/vip/${id}`, offer, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        console.log('Réponse mise à jour offre VIP:', response.data);
        return response.data;
    } catch (err) {
        console.error('Erreur mise à jour offre VIP:', err.response?.data);
        throw err;
    }
};

export const deleteVipOffer = async (id) => {
    try {
        const response = await api.delete(`/api/vip/${id}`);
        console.log('Réponse suppression offre VIP:', response.data);
        return response.data;
    } catch (err) {
        console.error('Erreur suppression offre VIP:', err.response?.data);
        throw err;
    }
};