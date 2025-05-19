import api from './api';

export const getProducts = async () => {
    const response = await api.get('/products');
    return response.data;
};

export const createProduct = async (product) => {
    const response = await api.post('/products', product, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
};

export const updateProduct = async (id, product) => {
    const response = await api.put(`/products/${id}`, product, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
};

export const deleteProduct = async (id) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
};