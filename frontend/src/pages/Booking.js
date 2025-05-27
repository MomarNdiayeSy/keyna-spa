import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';

const Booking = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const tariffId = queryParams.get('tariffId');
    const serviceId = queryParams.get('serviceId');

    const [service, setService] = useState(null);
    const [tariff, setTariff] = useState(null);
    const [availableSlots, setAvailableSlots] = useState([]);
    const [formData, setFormData] = useState({
        tariffId: tariffId || '',
        date: '',
        time: '',
        name: user ? user.name : '',
        email: user ? user.email : '',
        customer_phone: user ? user.phone_number : '',
        discount_code: '',
    });
    const [bookForOther, setBookForOther] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        if (!user) {
            navigate('/login', { state: { from: location } });
        }
    }, [user, navigate, location]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const serviceResponse = await axios.get(`http://localhost:5000/api/services`);
                const serviceData = serviceResponse.data.find(s => s.id === parseInt(serviceId));
                if (!serviceData) throw new Error('Service non trouvé.');
                setService(serviceData);

                const tariffData = serviceData.tariffs.find(t => t.id === parseInt(tariffId));
                if (!tariffData) throw new Error('Tarif non trouvé.');
                setTariff(tariffData);

                setLoading(false);
            } catch (error) {
                console.error('Erreur lors de la récupération des données:', error);
                setError(error.message);
                setLoading(false);
            }
        };

        if (serviceId && tariffId) {
            fetchData();
        } else {
            setLoading(false);
        }
    }, [serviceId, tariffId]);

    useEffect(() => {
        const fetchAvailableSlots = async () => {
            if (formData.date && tariffId && serviceId) {
                try {
                    const response = await axios.get('http://localhost:5000/api/schedules/available', {
                        params: { serviceId, tariffId, date: formData.date },
                    });
                    setAvailableSlots(response.data);
                } catch (error) {
                    console.error('Erreur lors de la récupération des créneaux:', error);
                    setError('Impossible de charger les créneaux disponibles.');
                }
            }
        };
        fetchAvailableSlots();
    }, [formData.date, tariffId, serviceId]);

    useEffect(() => {
        if (user && !bookForOther) {
            setFormData((prev) => ({
                ...prev,
                name: user.name,
                email: user.email,
                customer_phone: user.phone_number,
            }));
        } else if (bookForOther) {
            setFormData((prev) => ({
                ...prev,
                name: '',
                email: '',
                customer_phone: '',
            }));
        }
    }, [user, bookForOther]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleBookForOtherChange = (e) => {
        setBookForOther(e.target.checked);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        try {
            const dateTime = `${formData.date} ${formData.time}`;

            await axios.post(
                'http://localhost:5000/api/bookings',
                {
                    tariff_id: formData.tariffId,
                    date_time: dateTime,
                    customer_name: formData.name,
                    customer_email: formData.email,
                    customer_phone: formData.customer_phone,
                    user_id: user.userId,
                    discount_code: formData.discount_code.toUpperCase() || null,
                },
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                }
            );

            setSuccess('Réservation créée avec succès !');
            setFormData({
                tariffId: formData.tariffId,
                date: '',
                time: '',
                name: user ? user.name : '',
                email: user ? user.email : '',
                customer_phone: user ? user.phone_number : '',
                discount_code: '',
            });
        } catch (error) {
            console.error('Erreur lors de la réservation:', error);
            setError(error.message || error.response?.data?.error || 'Échec de la réservation.');
        }
    };

    if (loading) {
        return (
            <section className="min-h-screen bg-neutral py-12">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-serif font-bold mb-4 text-primary-dark">Réserver un Soin</h2>
                    <p className="text-center text-secondary-dark">Chargement...</p>
                </div>
            </section>
        );
    }

    return (
        <section className="min-h-screen bg-neutral py-12">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-serif font-bold mb-4 text-primary-dark">Réserver un Soin</h2>
                <p className="text-body text-secondary-dark mb-6">
                    Choisissez votre date et horaire pour une expérience KEYNA SPA.
                </p>

                {error && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-xl">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded-xl">
                        {success}
                    </div>
                )}

                {service && tariff && (
                    <div className="bg-white p-6 rounded-xl shadow-soft mb-6">
                        <h3 className="text-2xl font-serif text-primary-dark mb-2">{service.name}</h3>
                        <p className="text-accent font-semibold">{tariff.name} - {parseFloat(tariff.price).toFixed(2)} € ({tariff.duration})</p>
                        <p className="text-secondary-dark">{service.description}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white p-6 rounded-xl shadow-soft">
                    <div className="mb-6">
                        <label htmlFor="date" className="block text-sm font-semibold text-primary-dark mb-2">Date</label>
                        <input
                            type="date"
                            id="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            className="w-full p-3 border border-neutral-light rounded-xl focus:ring-2 focus:ring-accent"
                            required
                            min={new Date().toISOString().split('T')[0]}
                        />
                    </div>

                    <div className="mb-6">
                        <label htmlFor="time" className="block text-sm font-semibold text-primary-dark mb-2">Heure</label>
                        <select
                            id="time"
                            name="time"
                            value={formData.time}
                            onChange={handleChange}
                            className="w-full p-3 border border-neutral-light rounded-xl focus:ring-2 focus:ring-accent"
                            required
                            disabled={!formData.date || availableSlots.length === 0}
                        >
                            <option value="">Sélectionnez un horaire</option>
                            {availableSlots.map((slot) => (
                                <option key={slot.id} value={slot.start_time}>
                                    {slot.start_time} - {slot.end_time}
                                </option>
                            ))}
                        </select>
                        {!availableSlots.length && formData.date && (
                            <p className="text-red-600 text-sm mt-2">Aucun créneau disponible pour cette date.</p>
                        )}
                    </div>

                    <div className="mb-6">
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                checked={bookForOther}
                                onChange={handleBookForOtherChange}
                                className="mr-2 text-accent focus:ring-accent"
                            />
                            <span className="text-sm font-semibold text-primary-dark">Réserver pour quelqu’un d’autre</span>
                        </label>
                    </div>

                    <div className="mb-6">
                        <label htmlFor="name" className="block text-sm font-semibold text-primary-dark mb-2">Nom</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full p-3 border border-neutral-light rounded-xl focus:ring-2 focus:ring-accent"
                            required
                        />
                    </div>

                    <div className="mb-6">
                        <label htmlFor="email" className="block text-sm font-semibold text-primary-dark mb-2">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full p-3 border border-neutral-light rounded-xl focus:ring-2 focus:ring-accent"
                            required
                        />
                    </div>

                    <div className="mb-6">
                        <label htmlFor="customer_phone" className="block text-sm font-semibold text-primary-dark mb-2">Numéro de téléphone</label>
                        <input
                            type="text"
                            id="customer_phone"
                            name="customer_phone"
                            value={formData.customer_phone}
                            onChange={handleChange}
                            className="w-full p-3 border border-neutral-light rounded-xl focus:ring-2 focus:ring-accent"
                            placeholder="+33 1 23 45 67 89"
                        />
                    </div>

                    <div className="mb-6">
                        <label htmlFor="discount_code" className="block text-sm font-semibold text-primary-dark mb-2">Code Promo</label>
                        <input
                            type="text"
                            id="discount_code"
                            name="discount_code"
                            value={formData.discount_code}
                            onChange={handleChange}
                            placeholder="Ex. : FIRST15"
                            className="w-full p-3 border border-neutral-light rounded-xl focus:ring-2 focus:ring-accent"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-accent text-white py-3 rounded-xl hover:bg-accent-dark transition"
                        disabled={loading || !formData.date || !formData.time}
                    >
                        Confirmer la réservation
                    </button>
                </form>
            </div>
        </section>
    );
};

export default Booking;
