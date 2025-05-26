import axios from 'axios';

export const discountService = {
    validateDiscount: async (code) => {
        const token = localStorage.getItem('token');
        const response = await axios.post(
            'http://localhost:5000/api/discounts/validate',
            { code },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return response.data;
    },
    applyDiscount: async (code) => {
        const token = localStorage.getItem('token');
        const response = await axios.post(
            'http://localhost:5000/api/discounts/apply',
            { code },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return response.data;
    },
};