import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../contexts/CartContext';
import { discountService } from '../services/discountService';
import { stripePromise, getPaymentMethods, createCheckoutSession, confirmPayment } from '../services/paymentService';
import { TrashIcon, PlusIcon, MinusIcon, XMarkIcon, CreditCardIcon } from '@heroicons/react/24/outline';

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('stripe');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [discountCode, setDiscountCode] = useState('');
    const [discount, setDiscount] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    const { updateCartCount } = useContext(CartContext);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/login');
                    return;
                }
                const cartResponse = await axios.get('http://localhost:5000/api/cart', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setCartItems(cartResponse.data);

                const methods = await getPaymentMethods();
                setPaymentMethods(methods);
                setSelectedPaymentMethod('stripe');

                setLoading(false);
            } catch (error) {
                console.error('Erreur lors de la récupération des données:', error);
                if (error.response?.status === 401) {
                    localStorage.removeItem('token');
                    navigate('/login');
                } else {
                    setError('Impossible de charger le panier ou les méthodes de paiement.');
                    setLoading(false);
                }
            }
        };
        fetchData();
    }, [navigate]);

    useEffect(() => {
        const query = new URLSearchParams(location.search);
        const orderId = query.get('order_id');
        if (orderId) {
            confirmPayment(orderId)
                .then(async () => {
                    // Appliquer le code promo après un paiement réussi
                    if (discount?.code) {
                        try {
                            await discountService.applyDiscount(discount.code);
                        } catch (error) {
                            console.error('Erreur lors de l’application du code promo:', error);
                            setError('Code promo non enregistré, mais paiement validé.');
                        }
                    }
                    setCartItems([]);
                    setDiscount(null);
                    setDiscountCode('');
                    updateCartCount();
                    navigate('/cart', { replace: true });
                    alert('Paiement réussi ! Votre commande est validée.');
                })
                .catch((error) => {
                    setError('Erreur lors de la confirmation du paiement.');
                    console.error(error);
                });
        }
    }, [location, navigate, updateCartCount, discount]);

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

    const handleUpdateQuantity = async (itemId, newQuantity) => {
        if (newQuantity < 1) return;
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }
            const response = await axios.put(
                `http://localhost:5000/api/cart/${itemId}`,
                { quantity: newQuantity },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setCartItems(
                cartItems.map((item) =>
                    item.id === itemId ? { ...item, quantity: response.data.quantity } : item
                )
            );
            await updateCartCount();
        } catch (error) {
            console.error('Erreur lors de la mise à jour de la quantité:', error);
            setError(`Échec de la mise à jour de la quantité: ${error.response?.data?.error || error.message}`);
        }
    };

    const handleApplyDiscount = async () => {
        if (!discountCode) {
            setError('Veuillez entrer un code promo.');
            return;
        }
        try {
            const discountData = await discountService.validateDiscount(discountCode);
            setDiscount(discountData);
            setDiscountCode('');
            setError(null);
        } catch (error) {
            setError(error.response?.data?.error || 'Code promo invalide ou expiré.');
            console.error(error);
        }
    };

    const handleOpenModal = () => {
        if (!selectedPaymentMethod || selectedPaymentMethod !== 'stripe') {
            setError('Seule la carte bancaire (Stripe) est disponible pour le moment.');
            return;
        }
        if (cartItems.length === 0) {
            setError('Le panier est vide.');
            return;
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleCheckout = async () => {
        try {
            const sessionData = await createCheckoutSession({ discountCode: discount?.code });
            const stripe = await stripePromise;
            await stripe.redirectToCheckout({ sessionId: sessionData.sessionId });
        } catch (error) {
            setError('Erreur lors de l’initialisation du paiement.');
            console.error(error);
            setIsModalOpen(false);
        }
    };

    const total = cartItems.reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0);
    const discountAmount =
        discount?.type === 'fixed'
            ? parseFloat(discount.amount)
            : total * (parseFloat(discount?.amount) / 100);
    const finalTotal = Math.max(0, total - (discountAmount || 0)).toFixed(2);

    if (loading) {
        return (
            <section className="min-h-screen bg-neutral py-12">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-serif font-bold text-neutral-dark mb-4">Votre Panier</h2>
                    <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-accent"></div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="min-h-screen bg-neutral py-12">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-serif font-bold text-neutral-dark mb-2">Votre Panier</h2>
                <p className="text-neutral-dark/80 mb-8">Gérez vos produits avant de passer commande.</p>

                {error && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-xl">
                        {error}
                    </div>
                )}

                {cartItems.length === 0 ? (
                    <div className="bg-white p-8 rounded-xl shadow-soft text-center">
                        <p className="text-neutral-dark/80 text-lg">Votre panier est vide.</p>
                        <button
                            onClick={() => navigate('/shop')}
                            className="mt-4 inline-block bg-accent text-white px-6 py-2 rounded-xl hover:bg-accent-dark transition"
                        >
                            Découvrir nos produits
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2">
                            <div className="space-y-4">
                                {cartItems.map((item) => (
                                    <div
                                        key={item.id}
                                        className="bg-white p-4 rounded-xl shadow-soft flex items-center hover:shadow-lg transition-shadow"
                                    >
                                        <div className="flex-shrink-0 w-32 h-32">
                                            {item.image ? (
                                                <img
                                                    src={`http://localhost:5000${item.image}`}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover rounded-xl"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-neutral flex items-center justify-center rounded-xl">
                                                    <span className="text-neutral-dark/80">Aucune image</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-grow pl-4">
                                            <h3 className="text-lg font-semibold text-neutral-dark">{item.name}</h3>
                                            <p className="text-neutral-dark/80 text-sm line-clamp-2">{item.description}</p>
                                            <p className="text-accent font-semibold mt-1">
                                                {parseFloat(item.price).toFixed(2)} € x {item.quantity} ={' '}
                                                {(parseFloat(item.price) * item.quantity).toFixed(2)} €
                                            </p>
                                            <div className="flex items-center mt-2">
                                                <button
                                                    onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                                    className="p-1 bg-neutral rounded-xl hover:bg-neutral-dark hover:text-white"
                                                    disabled={item.quantity <= 1}
                                                >
                                                    <MinusIcon className="w-5 h-5" />
                                                </button>
                                                <span className="mx-3 text-neutral-dark">{item.quantity}</span>
                                                <button
                                                    onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                                    className="p-1 bg-neutral rounded-xl hover:bg-neutral-dark hover:text-white"
                                                >
                                                    <PlusIcon className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleRemove(item.id)}
                                            className="p-2 bg-red-100 rounded-xl hover:bg-red-200 transition"
                                        >
                                            <TrashIcon className="w-6 h-6 text-red-600" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="lg:col-span-1">
                            <div className="bg-white p-6 rounded-xl shadow-soft sticky top-4">
                                <h3 className="text-xl font-semibold text-neutral-dark mb-4">Résumé de la commande</h3>
                                <div className="flex justify-between mb-2">
                                    <span className="text-neutral-dark/80">Total des articles</span>
                                    <span className="text-neutral-dark font-semibold">{total.toFixed(2)} €</span>
                                </div>
                                {discount && (
                                    <div className="flex justify-between mb-2">
                                        <span className="text-neutral-dark/80">Réduction ({discount.code})</span>
                                        <span className="text-accent font-semibold">-{discountAmount.toFixed(2)} €</span>
                                    </div>
                                )}
                                <div className="flex justify-between mb-4">
                                    <span className="text-neutral-dark font-semibold">Total final</span>
                                    <span className="text-neutral-dark font-semibold">{finalTotal} €</span>
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-neutral-dark mb-1">
                                        Code promo
                                    </label>
                                    <div className="flex flex-col space-y-2">
                                        <input
                                            type="text"
                                            value={discountCode}
                                            onChange={(e) => setDiscountCode(e.target.value)}
                                            placeholder="Entrez votre code (ex. : FIRST15)"
                                            className="w-full border border-neutral/20 rounded-xl p-2 focus:ring-accent"
                                        />
                                        <button
                                            onClick={handleApplyDiscount}
                                            className="w-full bg-accent text-white px-4 py-2 rounded-xl hover:bg-accent-dark"
                                        >
                                            Appliquer
                                        </button>
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="paymentMethod" className="block text-sm font-medium text-neutral-dark mb-1">
                                        Méthode de paiement
                                    </label>
                                    <div className="relative">
                                        <select
                                            id="paymentMethod"
                                            value={selectedPaymentMethod}
                                            onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                                            className="block w-full pl-10 pr-4 py-2 border-neutral/20 rounded-xl shadow-soft focus:ring-accent"
                                        >
                                            {paymentMethods.map((method) => (
                                                <option
                                                    key={method.name}
                                                    value={method.name}
                                                    disabled={!method.is_active}
                                                >
                                                    {method.name === 'stripe'
                                                        ? 'Carte bancaire (Stripe)'
                                                        : method.name === 'wave'
                                                        ? 'Wave (Bientôt disponible)'
                                                        : 'Orange Money (Bientôt disponible)'}
                                                </option>
                                            ))}
                                        </select>
                                        <CreditCardIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-dark/80" />
                                    </div>
                                </div>
                                <button
                                    onClick={handleOpenModal}
                                    className="w-full bg-accent text-white py-3 rounded-xl hover:bg-accent-dark transition flex items-center justify-center"
                                    disabled={cartItems.length === 0 || selectedPaymentMethod !== 'stripe'}
                                >
                                    <CreditCardIcon className="w-5 h-5 mr-2" />
                                    Valider le panier
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {isModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300">
                        <div className="bg-white p-6 rounded-xl shadow-soft max-w-md w-full transform transition-all duration-300 scale-100">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-semibold text-neutral-dark">Confirmer votre commande</h3>
                                <button onClick={handleCloseModal} className="p-1 hover:bg-neutral rounded-xl">
                                    <XMarkIcon className="w-6 h-6 text-neutral-dark/80" />
                                </button>
                            </div>
                            <p className="text-neutral-dark/80 mb-4">Veuillez vérifier les détails de votre commande :</p>
                            <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                                {cartItems.map((item) => (
                                    <div key={item.id} className="flex items-center space-x-3">
                                        <div className="w-16 h-16 flex-shrink-0">
                                            {item.image ? (
                                                <img
                                                    src={`http://localhost:5000${item.image}`}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover rounded-xl"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-neutral flex items-center justify-center rounded-xl">
                                                    <span className="text-neutral-dark/80 text-sm">Aucune image</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-grow">
                                            <p className="text-neutral-dark font-medium">{item.name}</p>
                                            <p className="text-neutral-dark/80 text-sm">Quantité : {item.quantity}</p>
                                            <p className="text-accent font-semibold">
                                                {(parseFloat(item.price) * item.quantity).toFixed(2)} €
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="border-t border-neutral/20 pt-4">
                                <div className="flex justify-between mb-2">
                                    <span className="text-neutral-dark/80">Total des articles</span>
                                    <span className="text-neutral-dark">{total.toFixed(2)} €</span>
                                </div>
                                {discount && (
                                    <div className="flex justify-between mb-2">
                                        <span className="text-neutral-dark/80">Réduction ({discount.code})</span>
                                        <span className="text-accent">-{discountAmount.toFixed(2)} €</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-lg font-semibold text-neutral-dark">
                                    <span>Total</span>
                                    <span>{finalTotal} €</span>
                                </div>
                                <p className="text-neutral-dark/80 mt-2">Méthode de paiement : Carte bancaire (Stripe)</p>
                            </div>
                            <div className="flex justify-end space-x-4 mt-6">
                                <button
                                    onClick={handleCloseModal}
                                    className="px-4 py-2 bg-neutral text-neutral-dark rounded-xl hover:bg-neutral-dark hover:text-white transition"
                                >
                                    Annuler
                                </button>
                                <button
                                    onClick={handleCheckout}
                                    className="px-4 py-2 bg-accent text-white rounded-xl hover:bg-accent-dark transition flex items-center"
                                >
                                    <CreditCardIcon className="w-5 h-5 mr-2" />
                                    Confirmer et payer
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default Cart;