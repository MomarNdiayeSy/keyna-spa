import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_51RQa7nDh63C78x3FaEXMpzBzeMTTd9INqMRMWrplyl9TE0hIf0KSXx63PSVqmHXZR9WqCgC48SMQUBGWjvuZI1fU00yUp8iXAa');

const getPaymentMethods = async () => {
    try {
        const response = await axios.get('http://localhost:5000/api/payments/methods');
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la récupération des méthodes de paiement:', error);
        throw error;
    }
};

const createCheckoutSession = async ({ discountCode }) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('Utilisateur non authentifié');
        }
        const response = await axios.post(
            'http://localhost:5000/api/payments/create-checkout-session',
            { discountCode },
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la création de la session de paiement:', error);
        throw error;
    }
};

const confirmPayment = async (orderId) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('Utilisateur non authentifié');
        }
        const response = await axios.post(
            'http://localhost:5000/api/payments/confirm',
            { orderId },
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la confirmation du paiement:', error);
        throw error;
    }
};

export { stripePromise, getPaymentMethods, createCheckoutSession, confirmPayment };