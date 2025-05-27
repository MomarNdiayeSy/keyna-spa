import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getVipOffers } from '../services/vipService';

const VipSpace = () => {
    const [offers, setOffers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3;

    // Récupérer les offres VIP
    useEffect(() => {
        const fetchOffers = async () => {
            try {
                const response = await getVipOffers();
                // Convertir les prix en nombres
                const formattedOffers = response.map((offer) => ({
                    ...offer,
                    price: parseFloat(offer.price),
                }));
                setOffers(formattedOffers);
                setLoading(false);
            } catch (error) {
                console.error('Erreur lors de la récupération des offres VIP:', error);
                setError('Impossible de charger les offres VIP.');
                setLoading(false);
            }
        };
        fetchOffers();
    }, []);

    // Calculer les données de pagination
    const totalPages = Math.ceil(offers.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentOffers = offers.slice(startIndex, endIndex);

    // Fonction pour changer de page
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        // Scroll vers le haut de la section
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Générer les numéros de pages
    const getPageNumbers = () => {
        const pages = [];
        for (let i = 1; i <= totalPages; i++) {
            pages.push(i);
        }
        return pages;
    };

    if (loading) {
        return (
            <section className="section bg-white">
                <div className="container">
                    <h2 className="section-title">Espace VIP</h2>
                    <p className="text-center text-gray-600">Chargement...</p>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="section bg-white">
                <div className="container">
                    <h2 className="section-title">Espace VIP</h2>
                    <p className="text-center text-red-600">{error}</p>
                </div>
            </section>
        );
    }

    return (
        <section className="section bg-white">
            <div className="container">
                <h2 className="section-title">Espace VIP</h2>
                <p className="section-subtitle">
                    Offres exclusives pour nos membres VIP.
                </p>

                {/* Affichage des informations de pagination
                {offers.length > 0 && (
                    <div className="text-center text-gray-600 mb-6">
                        Affichage de {startIndex + 1} à {Math.min(endIndex, offers.length)} sur {offers.length} offres
                    </div>
                )} */}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
                    {currentOffers.map((offer) => (
                        <div key={offer.id} className="card group hover:translate-y-[-5px]">
                            <div className="relative h-64 overflow-hidden">
                                {offer.image ? (
                                    <img
                                        src={`http://localhost:5000/${offer.image}`}
                                        alt={offer.name}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                        <span className="text-gray-500">Aucune image</span>
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                                <h3 className="absolute bottom-4 left-4 text-xl font-serif text-white">{offer.name}</h3>
                            </div>
                            <div className="p-6">
                                <p className="text-gray-600 mb-4">{offer.description}</p>
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-lg font-semibold text-primary">
                                        {typeof offer.price === 'number' && !isNaN(offer.price)
                                            ? offer.price.toFixed(2)
                                            : Number(offer.price) && !isNaN(Number(offer.price))
                                                ? Number(offer.price).toFixed(2)
                                                : 'N/A'}{' '}
                                        €
                                    </span>
                                </div>
                                <Link to="/booking" className="btn btn-primary w-full">
                                    Réserver
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center mt-12 space-x-2">
                        {/* Bouton Précédent */}
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className={`px-4 py-2 rounded-lg border ${
                                currentPage === 1
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'
                            }`}
                        >
                            Précédent
                        </button>

                        {/* Numéros de pages */}
                        {getPageNumbers().map((pageNumber) => (
                            <button
                                key={pageNumber}
                                onClick={() => handlePageChange(pageNumber)}
                                className={`px-4 py-2 rounded-lg border ${
                                    currentPage === pageNumber
                                        ? 'bg-primary text-white border-primary'
                                        : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'
                                }`}
                            >
                                {pageNumber}
                            </button>
                        ))}

                        {/* Bouton Suivant */}
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className={`px-4 py-2 rounded-lg border ${
                                currentPage === totalPages
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'
                            }`}
                        >
                            Suivant
                        </button>
                    </div>
                )}

                {/* Message si aucune offre */}
                {offers.length === 0 && (
                    <div className="text-center text-gray-600 mt-12">
                        <p>Aucune offre VIP disponible pour le moment.</p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default VipSpace;