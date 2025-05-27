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
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 3; // Maximum 3 produits par page
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

    // Calculs pour la pagination
    const totalPages = Math.ceil(products.length / productsPerPage);
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const currentProducts = products.slice(startIndex, endIndex);

    // Fonction pour changer de page
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Générer les numéros de pages à afficher
    const getPageNumbers = () => {
        const pageNumbers = [];
        const maxVisiblePages = 5;
        
        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i);
            }
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) {
                    pageNumbers.push(i);
                }
                pageNumbers.push('...');
                pageNumbers.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                pageNumbers.push(1);
                pageNumbers.push('...');
                for (let i = totalPages - 3; i <= totalPages; i++) {
                    pageNumbers.push(i);
                }
            } else {
                pageNumbers.push(1);
                pageNumbers.push('...');
                for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                    pageNumbers.push(i);
                }
                pageNumbers.push('...');
                pageNumbers.push(totalPages);
            }
        }
        
        return pageNumbers;
    };

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
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12 mb-12">
                            {currentProducts.map((product) => (
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

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center items-center space-x-2">
                                {/* Bouton Précédent */}
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                        currentPage === 1
                                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                            : 'bg-white text-primary hover:bg-primary hover:text-white border border-primary/20'
                                    }`}
                                >
                                    Précédent
                                </button>

                                {/* Numéros de pages */}
                                {getPageNumbers().map((pageNumber, index) => (
                                    <React.Fragment key={index}>
                                        {pageNumber === '...' ? (
                                            <span className="px-3 py-2 text-gray-500">...</span>
                                        ) : (
                                            <button
                                                onClick={() => handlePageChange(pageNumber)}
                                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                                    currentPage === pageNumber
                                                        ? 'bg-primary text-white'
                                                        : 'bg-white text-primary hover:bg-primary hover:text-white border border-primary/20'
                                                }`}
                                            >
                                                {pageNumber}
                                            </button>
                                        )}
                                    </React.Fragment>
                                ))}

                                {/* Bouton Suivant */}
                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                        currentPage === totalPages
                                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                            : 'bg-white text-primary hover:bg-primary hover:text-white border border-primary/20'
                                    }`}
                                >
                                    Suivant
                                </button>
                            </div>
                        )}
                    </>
                )}
                
                <CartModal product={modalProduct} isOpen={isModalOpen} onClose={handleModalClose} />
            </div>
        </section>
    );
};

export default Shop;