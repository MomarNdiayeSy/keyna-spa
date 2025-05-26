import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const History = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/login');
                    return;
                }
                const response = await axios.get('http://localhost:5000/api/orders', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setOrders(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Erreur lors de la récupération des commandes:', error);
                setError('Impossible de charger l’historique des commandes.');
                setLoading(false);
            }
        };
        fetchOrders();
    }, [navigate]);

    if (loading) {
        return (
            <section className="min-h-screen bg-gray-50 py-12">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">Historique des Commandes</h2>
                    <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                    </div>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="min-h-screen bg-gray-50 py-12">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">Historique des Commandes</h2>
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
                        {error}
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Historique des Commandes</h2>
                <p className="text-gray-600 mb-8">Consultez vos commandes passées.</p>

                {orders.length === 0 ? (
                    <div className="bg-white p-8 rounded-lg shadow-md text-center">
                        <p className="text-gray-600 text-lg">Vous n’avez aucune commande pour le moment.</p>
                        <button
                            onClick={() => navigate('/shop')}
                            className="mt-4 inline-block bg-primary text-white px-6 py-2 rounded-full hover:bg-primary-dark transition"
                        >
                            Découvrir nos produits
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <div key={order.id} className="bg-white p-6 rounded-lg shadow-md">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-xl font-semibold text-gray-800">
                                        Commande #{order.id}
                                    </h3>
                                    <span
                                        className={`text-sm font-medium ${
                                            order.status === 'paid' ? 'text-green-600' : 'text-yellow-600'
                                        }`}
                                    >
                                        {order.status === 'paid' ? 'Payée' : 'En attente'}
                                    </span>
                                </div>
                                <p className="text-gray-600 mb-2">
                                    Date : {new Date(order.created_at).toLocaleDateString()}
                                </p>
                                <div className="mb-4">
                                    <h4 className="text-gray-800 font-medium">Articles :</h4>
                                    <ul className="list-disc pl-5 text-gray-600">
                                        {order.items.map((item) => (
                                            <li key={item.id}>
                                                {item.name} x {item.quantity} -{' '}
                                                {(parseFloat(item.price) * item.quantity).toFixed(2)} €
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="flex justify-between mb-2">
                                    <span className="text-gray-600">Total des articles</span>
                                    <span className="text-gray-800">
                                        {(parseFloat(order.total_amount) + parseFloat(order.discount_amount || 0)).toFixed(2)} €
                                    </span>
                                </div>
                                {order.discount_code && (
                                    <div className="flex justify-between mb-2">
                                        <span className="text-gray-600">Réduction ({order.discount_code})</span>
                                        <span className="text-green-600">
                                            -{parseFloat(order.discount_amount).toFixed(2)} €
                                        </span>
                                    </div>
                                )}
                                <div className="flex justify-between font-semibold text-gray-800">
                                    <span>Total final</span>
                                    <span>{parseFloat(order.total_amount).toFixed(2)} €</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default History;