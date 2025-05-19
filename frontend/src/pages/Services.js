import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Services = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Charger les services depuis l'API
    useEffect(() => {
        axios
            .get('http://localhost:5000/api/services')
            .then((response) => {
                const apiServices = response.data.map((service) => ({
                    ...service,
                    price: parseFloat(service.price),
                }));
                setServices(apiServices);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Erreur lors de la récupération des services:', error);
                setError('Impossible de charger les services. Veuillez réessayer plus tard.');
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <section className="section bg-white">
                <div className="container">
                    <h2 className="section-title">Nos Services</h2>
                    <p className="text-center text-gray-600">Chargement des services...</p>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="section bg-white">
                <div className="container">
                    <h2 className="section-title">Nos Services</h2>
                    <p className="text-center text-red-600">{error}</p>
                </div>
            </section>
        );
    }

    return (
        <section className="section bg-white">
            <div className="container">
                <h2 className="section-title">Nos Services</h2>
                <p className="section-subtitle">
                    Découvrez nos soins conçus pour votre bien-être. Chaque service est pensé pour offrir une expérience relaxante et revitalisante.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
                    {services.map((service) => (
                        <div key={service.id} className="card group hover:translate-y-[-5px]">
                            <div className="relative h-64 overflow-hidden">
                                {service.image ? (
                                    <img
                                        src={`http://localhost:5000${service.image}`}
                                        alt={service.name}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                        <span className="text-gray-500">Aucune image</span>
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                                <h3 className="absolute bottom-4 left-4 text-xl font-serif text-white">{service.name}</h3>
                            </div>
                            <div className="p-6">
                                <p className="text-gray-600 mb-4">{service.description}</p>
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-lg font-semibold text-primary">
                                        {typeof service.price === 'number' && !isNaN(service.price)
                                            ? service.price.toFixed(2)
                                            : Number(service.price) && !isNaN(Number(service.price))
                                                ? Number(service.price).toFixed(2)
                                                : 'N/A'}{' '}
                                        €
                                    </span>
                                    <span className="text-gray-500">{service.duration}</span>
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

export default Services;