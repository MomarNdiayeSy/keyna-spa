import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getVipOffers } from '../services/vipService';

const VipSpace = () => {
    const [offers, setOffers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
                    {offers.map((offer) => (
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
            </div>
        </section>
    );
};

export default VipSpace;