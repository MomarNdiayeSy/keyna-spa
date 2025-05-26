import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import CartModal from '../components/CartModal';

const Shop = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modalProduct, setModalProduct] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

    // Récupérer les produits
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/products');
                const formattedProducts = response.data.map((product) => ({
                    ...product,
                    price: parseFloat(product.price),
                }));
                setProducts(formattedProducts);
                setLoading(false);
            } catch (error) {
                console.error('Erreur lors de la récupération des produits:', error);
                setError('Impossible de charger les produits.');
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    // Ouvrir la modale pour ajouter au panier
    const handleAddToCart = (product) => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }
        setModalProduct(product);
        setIsModalOpen(true);
    };

    // Fermer la modale
    const handleModalClose = () => {
        setIsModalOpen(false);
        setModalProduct(null);
    };

    // Rediriger vers le panier
    // const handleGoToCart = () => {
    //     navigate('/cart');
    // };

    if (loading) {
        return (
            <section className="section bg-white">
                <div className="container">
                    <h2 className="section-title">Boutique</h2>
                    <p className="text-center text-gray-600">Chargement...</p>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="section bg-white">
                <div className="container">
                    <h2 className="section-title">Boutique</h2>
                    <p className="text-center text-red-600">{error}</p>
                </div>
            </section>
        );
    }

    return (
        <section className="section bg-white">
            <div className="container">
                <h2 className="section-title">Boutique</h2>
                <p className="section-subtitle">Découvrez nos produits exclusifs.</p>


                {error && <p className="text-center text-red-600 mb-6">{error}</p>}
                {products.length === 0 ? (
                    <p className="text-center text-gray-600">Aucun produit disponible.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
                        {products.map((product) => (
                            <div key={product.id} className="card group hover:translate-y-[-5px]">
                                <div className="relative h-64 overflow-hidden">
                                    {product.image ? (
                                        <img
                                            src={`http://localhost:5000${product.image}`}
                                            alt={product.name}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                            <span className="text-gray-500">Aucune image</span>
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                                    <h3 className="absolute bottom-4 left-4 text-xl font-serif text-white">{product.name}</h3>
                                </div>
                                <div className="p-6">
                                    <p className="text-gray-600 mb-4">{product.description}</p>
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-lg font-semibold text-primary">
                                            {typeof product.price === 'number' && !isNaN(product.price)
                                                ? product.price.toFixed(2)
                                                : Number(product.price) && !isNaN(Number(product.price))
                                                    ? Number(product.price).toFixed(2)
                                                    : 'N/A'}{' '}
                                            €
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => handleAddToCart(product)}
                                        className="btn btn-primary w-full"
                                    >
                                        Ajouter au panier
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                <CartModal product={modalProduct} isOpen={isModalOpen} onClose={handleModalClose} />
            </div>
        </section>
    );
};

export default Shop;