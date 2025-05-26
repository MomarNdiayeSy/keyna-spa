import axios from 'axios';

export const pricingService = {
    getPricing: async () => {
        const response = await axios.get('http://localhost:5000/api/pricing');
        return response.data;
    },
    createPricing: async (pricing) => {
        const token = localStorage.getItem('token');
        const response = await axios.post('http://localhost:5000/api/pricing', pricing, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    },
    updatePricing: async (id, pricing) => {
        const token = localStorage.getItem('token');
        const response = await axios.put(`http://localhost:5000/api/pricing/${id}`, pricing, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    },
    deletePricing: async (id) => {
        const token = localStorage.getItem('token');
        const response = await axios.delete(`http://localhost:5000/api/pricing/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    },
};