import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const ServiceDetail = () => {
    const { id } = useParams();
    const [service, setService] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get(`http://localhost:5000/api/services`)
            .then((response) => {
                const serviceData = response.data.find(s => s.id === parseInt(id));
                if (serviceData) {
                    setService(serviceData);
                    setLoading(false);
                } else {
                    setError('Service non trouvé.');
                    setLoading(false);
                }
            })
            .catch((error) => {
                console.error('Erreur lors de la récupération du service:', error);
                setError('Impossible de charger le service.');
                setLoading(false);
            });
    }, [id]);

    if (loading) {
        return (
            <section className="min-h-screen bg-neutral py-12">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-serif font-bold text-neutral-dark mb-4">Chargement...</h2>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="min-h-screen bg-neutral py-12">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-serif font-bold text-neutral-dark mb-4">Erreur</h2>
                    <p className="text-red-600">{error}</p>
                </div>
            </section>
        );
    }

    return (
        <section className="min-h-screen bg-neutral py-12">
            <div className="container mx-auto px-4">
                <h1 className="text-4xl font-serif text-accent mb-6">{service.name}</h1>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div>
                        {service.image ? (
                            <img
                                src={`http://localhost:5000${service.image}`}
                                alt={service.name}
                                className="w-full h-96 object-cover rounded-xl shadow-soft"
                            />
                        ) : (
                            <div className="w-full h-96 bg-neutral-gray flex items-center justify-center rounded-xl shadow-soft">
                                <span className="text-neutral-dark">Aucune image</span>
                            </div>
                        )}
                    </div>
                    <div>
                        <p className="text-body text-secondary mb-6">{service.description}</p>
                        <h3 className="text-2xl font-serif text-primary-dark mb-4">Options disponibles</h3>
                        {service.tariffs && service.tariffs.length > 0 ? (
                            <div className="space-y-4">
                                {service.tariffs.map((tariff) => (
                                    <div key={tariff.id} className="bg-white p-4 rounded-xl shadow-soft">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <h4 className="text-lg font-semibold text-primary-dark">{tariff.name}</h4>
                                                <p className="text-accent">{tariff.duration}</p>
                                                <p className="text-primary font-semibold">{parseFloat(tariff.price).toFixed(2)} €</p>
                                            </div>
                                            <Link
                                                to={`/booking?tariffId=${tariff.id}&serviceId=${service.id}`}
                                                className="btn bg-accent text-white px-6 py-2 rounded-xl hover:bg-accent-dark"
                                            >
                                                Réserver
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-neutral-dark">Aucun tarif disponible pour ce service.</p>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ServiceDetail;