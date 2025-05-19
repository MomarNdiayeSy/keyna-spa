import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Booking = () => {
    const [services, setServices] = useState([]);
    const [formData, setFormData] = useState({
        serviceId: '',
        date: '',
        time: '',
        name: '',
        email: '',
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    // Charger les services depuis l'API
    useEffect(() => {
        axios
            .get('http://localhost:5000/api/services')
            .then((response) => {
                setServices(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Erreur lors de la récupération des services:', error);
                setError('Impossible de charger les services.');
                setLoading(false);
            });
    }, []);

    // Gérer les changements dans le formulaire
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Gérer la soumission du formulaire
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        try {
            await axios.post('http://localhost:5000/api/bookings', formData);
            setSuccess('Réservation effectuée avec succès ! Vous recevrez une confirmation par email.');
            setFormData({ serviceId: '', date: '', time: '', name: '', email: '' });
        } catch (error) {
            console.error('Erreur lors de la réservation:', error);
            setError('Échec de la réservation. Veuillez réessayer.');
        }
    };

    if (loading) {
        return (
            <section className="section bg-white">
                <div className="container">
                    <h2 className="section-title">Réserver un Soin</h2>
                    <p className="text-center text-gray-600">Chargement...</p>
                </div>
            </section>
        );
    }

    return (
        <section className="section bg-white">
            <div className="container">
                <h2 className="section-title">Réserver un Soin</h2>
                <p className="section-subtitle">
                    Choisissez votre service, votre date et votre horaire pour une expérience KEYNA SPA.
                </p>

                {error && <p className="text-center text-red-600 mb-6">{error}</p>}
                {success && <p className="text-center text-green-600 mb-6">{success}</p>}

                <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
                    <div className="mb-6">
                        <label htmlFor="serviceId" className="block text-gray-700 font-semibold mb-2">
                            Service
                        </label>
                        <select
                            id="serviceId"
                            name="serviceId"
                            value={formData.serviceId}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-primary"
                            required
                        >
                            <option value="">Sélectionnez un service</option>
                            {services.map((service) => (
                                <option key={service.id} value={service.id}>
                                    {service.name} -{' '}
                                    {typeof service.price === 'number' && !isNaN(service.price)
                                        ? service.price.toFixed(2)
                                        : Number(service.price) && !isNaN(Number(service.price))
                                            ? Number(service.price).toFixed(2)
                                            : 'N/A'}{' '}
                                    € ({service.duration})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-6">
                        <label htmlFor="date" className="block text-gray-700 font-semibold mb-2">
                            Date
                        </label>
                        <input
                            type="date"
                            id="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-primary"
                            required
                        />
                    </div>

                    <div className="mb-6">
                        <label htmlFor="time" className="block text-gray-700 font-semibold mb-2">
                            Heure
                        </label>
                        <input
                            type="time"
                            id="time"
                            name="time"
                            value={formData.time}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-primary"
                            required
                        />
                    </div>

                    <div className="mb-6">
                        <label htmlFor="name" className="block text-gray-700 font-semibold mb-2">
                            Nom
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-primary"
                            required
                        />
                    </div>

                    <div className="mb-6">
                        <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-primary"
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-primary w-full">
                        Confirmer la Réservation
                    </button>
                </form>
            </div>
        </section>
    );
};

export default Booking;