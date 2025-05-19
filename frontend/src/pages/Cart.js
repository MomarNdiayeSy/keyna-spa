import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../contexts/CartContext';

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { updateCartCount } = useContext(CartContext);

    // Récupérer le panier
    useEffect(() => {
        const fetchCart = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/login');
                    return;
                }
                const response = await axios.get('http://localhost:5000/api/cart', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setCartItems(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Erreur lors de la récupération du panier:', error);
                if (error.response?.status === 401) {
                    localStorage.removeItem('token');
                    navigate('/login');
                } else {
                    setError('Impossible de charger le panier.');
                    setLoading(false);
                }
            }
        };
        fetchCart();
    }, [navigate]);

    // Supprimer un article du panier
    const handleRemove = async (itemId) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }
            await axios.delete(`http://localhost:5000/api/cart/${itemId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setCartItems(cartItems.filter((item) => item.id !== itemId));
            await updateCartCount();
        } catch (error) {
            console.error('Erreur lors de la suppression:', error);
            if (error.response?.status === 401) {
                localStorage.removeItem('token');
                navigate('/login');
            } else {
                setError('Échec de la suppression de l’article.');
            }
        }
    };

    if (loading) {
        return (
            <section className="section bg-white">
                <div className="container">
                    <h2 className="section-title">Votre Panier</h2>
                    <p className="text-center text-gray-600">Chargement...</p>
                </div>
            </section>
        );
    }

    return (
        <section className="section bg-white">
            <div className="container">
                <h2 className="section-title">Votre Panier</h2>
                <p className="section-subtitle">Gérez vos produits avant de passer commande.</p>

                {error && <p className="text-center text-red-600 mb-6">{error}</p>}
                {cartItems.length === 0 ? (
                    <p className="text-center text-gray-600">Votre panier est vide.</p>
                ) : (
                    <div className="space-y-6">
                        {cartItems.map((item) => (
                            <div key={item.id} className="card flex justify-between items-center p-4">
                                <div>
                                    <h3 className="text-lg font-semibold">{item.name}</h3>
                                    <p className="text-gray-600">{item.description}</p>
                                    <p className="text-primary font-semibold">
                                        {parseFloat(item.price).toFixed(2)} € x {item.quantity} ={' '}
                                        {(parseFloat(item.price) * item.quantity).toFixed(2)} €
                                    </p>
                                </div>
                                <button
                                    onClick={() => handleRemove(item.id)}
                                    className="btn btn-primary bg-red-600 hover:bg-red-700"
                                >
                                    Supprimer
                                </button>
                            </div>
                        ))}
                        <div className="text-right">
                            <p className="text-xl font-semibold">
                                Total :{' '}
                                {cartItems
                                    .reduce((total, item) => total + parseFloat(item.price) * item.quantity, 0)
                                    .toFixed(2)}{' '}
                                €
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default Cart;