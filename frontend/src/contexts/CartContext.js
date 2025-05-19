import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartCount, setCartCount] = useState(0);

    // Charger le panier initial
    const fetchCart = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;
            const response = await axios.get('http://localhost:5000/api/cart', {
                headers: { Authorization: `Bearer ${token}` },
            });
            const totalItems = response.data.reduce((sum, item) => sum + item.quantity, 0);
            setCartCount(totalItems);
        } catch (error) {
            console.error('Erreur lors du chargement du panier:', error);
        }
    };

    // Mettre à jour le compteur
    const updateCartCount = async () => {
        await fetchCart();
    };

    // Charger le panier au démarrage
    useEffect(() => {
        fetchCart();
    }, []);

    return (
        <CartContext.Provider value={{ cartCount, updateCartCount }}>
            {children}
        </CartContext.Provider>
    );
};