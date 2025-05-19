import React, { useState, useContext } from 'react';
import axios from 'axios';
import { CartContext } from '../contexts/CartContext';

const CartModal = ({ product, isOpen, onClose }) => {
    const [quantity, setQuantity] = useState(1);
    const { updateCartCount } = useContext(CartContext);

    if (!isOpen || !product) return null;

    const handleAdd = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                onClose();
                return;
            }
            await axios.post(
                'http://localhost:5000/api/cart',
                { productId: product.id, quantity },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            await updateCartCount();
            onClose();
        } catch (error) {
            console.error('Erreur lors de l’ajout au panier:', error);
        }
    };

    const handleQuantityChange = (newQuantity) => {
        if (newQuantity < 1) return; // Empêche une quantité inférieure à 1
        setQuantity(newQuantity);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-md w-full">
                <h2 className="text-xl font-semibold mb-4">Produit ajouté au panier</h2>
                <div className="flex items-center space-x-4 mb-4">
                    {product.image ? (
                        <img
                            src={`http://localhost:5000${product.image}`}
                            alt={product.name}
                            className="w-16 h-16 object-cover rounded"
                        />
                    ) : (
                        <div className="w-16 h-16 bg-gray-200 flex items-center justify-center rounded">
                            <span className="text-gray-500">Aucune image</span>
                        </div>
                    )}
                    <div>
                        <h3 className="text-lg font-semibold">{product.name}</h3>
                        <p className="text-gray-600">{product.description}</p>
                        <p className="text-primary font-semibold">
                            {parseFloat(product.price).toFixed(2)} €
                        </p>
                    </div>
                </div>
                <div className="flex items-center space-x-4 mb-4">
                    <button
                        onClick={() => handleQuantityChange(quantity - 1)}
                        className="btn btn-primary bg-gray-300 hover:bg-gray-400 text-black"
                        disabled={quantity <= 1}
                    >
                        −
                    </button>
                    <span className="text-lg">{quantity}</span>
                    <button
                        onClick={() => handleQuantityChange(quantity + 1)}
                        className="btn btn-primary bg-gray-300 hover:bg-gray-400 text-black"
                    >
                        +
                    </button>
                </div>
                <p className="text-lg font-semibold mb-4">
                    Total: {(parseFloat(product.price) * quantity).toFixed(2)} €
                </p>
                <div className="flex justify-end space-x-4">
                    <button
                        onClick={onClose}
                        className="btn btn-primary bg-gray-500 hover:bg-gray-600"
                    >
                        Annuler
                    </button>
                    <button
                        onClick={handleAdd}
                        className="btn btn-primary"
                    >
                        Confirmer
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CartModal;