import api from './api';

export const getBookings = async () => {
    const response = await api.get('/bookings');
    return response.data;
};

export const createBooking = async (booking) => {
    const response = await api.post('/bookings', booking);
    return response.data;
};

export const updateBooking = async (id, booking) => {
    const response = await api.put(`/bookings/${id}`, booking);
    return response.data;
};

export const deleteBooking = async (id) => {
    const response = await api.delete(`/bookings/${id}`);
    return response.data;
};