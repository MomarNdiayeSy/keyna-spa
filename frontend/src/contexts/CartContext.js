import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartCount, setCartCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useContext(AuthContext);

    // Charger le panier initial
    const fetchCart = useCallback(async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            if (!token || !user) {
                setCartCount(0);
                return;
            }
            const response = await axios.get('http://localhost:5000/api/cart', {
                headers: { Authorization: `Bearer ${token}` },
            });
            const totalItems = response.data.reduce((sum, item) => sum + item.quantity, 0);
            setCartCount(totalItems);
            console.log('Cart count updated:', totalItems);
        } catch (error) {
            console.error('Erreur lors du chargement du panier:', error);
            if (error.response?.status === 401) {
                localStorage.removeItem('token');
                setCartCount(0);
            }
        } finally {
            setIsLoading(false);
        }
    }, [user]); // Ajouter user comme dépendance de useCallback

    // Mettre à jour le compteur
    const updateCartCount = async () => {
        await fetchCart();
    };

    // Charger le panier au démarrage ou lorsque l'utilisateur change
    useEffect(() => {
        if (user) {
            fetchCart();
        } else {
            setCartCount(0);
        }
    }, [user, fetchCart]); // Ajouter fetchCart comme dépendance

    return (
        <CartContext.Provider value={{ cartCount, updateCartCount, isLoading }}>
            {children}
        </CartContext.Provider>
    );
};