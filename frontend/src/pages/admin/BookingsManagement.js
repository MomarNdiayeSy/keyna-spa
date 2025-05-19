import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { jwtDecode } from 'jwt-decode';

const BookingsManagement = () => {
    const [bookings, setBookings] = useState([]);
    const [services, setServices] = useState([]);
    const [newBooking, setNewBooking] = useState({
        service_id: '',
        booking_date: '',
        booking_time: '',
        customer_name: '',
        customer_email: '',
    });
    const [editingBooking, setEditingBooking] = useState(null);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Vérifier l'authentification admin
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }
        try {
            const decoded = jwtDecode(token);
            if (decoded.role !== 'admin') {
                navigate('/login');
            }
        } catch (err) {
            setError('Erreur de token');
            navigate('/login');
        }
    }, [navigate]);

    // Charger les réservations et services
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [bookingsRes, servicesRes] = await Promise.all([
                    api.get('/api/bookings').catch((err) => {
                        console.error('Erreur GET /api/bookings:', err.response?.data || err.message);
                        throw err;
                    }),
                    api.get('/api/services').catch((err) => {
                        console.error('Erreur GET /api/services:', err.response?.data || err.message);
                        throw err;
                    }),
                ]);
                setBookings(bookingsRes.data);
                setServices(servicesRes.data);
            } catch (err) {
                setError('Erreur lors du chargement des données');
                console.error('Erreur fetchData:', err.response?.data || err.message);
            }
        };
        fetchData();
    }, []);

    // Ajouter une réservation
    const handleAddBooking = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/api/bookings', {
                service_id: parseInt(newBooking.service_id),
                booking_date: newBooking.booking_date,
                booking_time: newBooking.booking_time,
                customer_name: newBooking.customer_name,
                customer_email: newBooking.customer_email,
            });
            setBookings([...bookings, response.data]);
            setNewBooking({
                service_id: '',
                booking_date: '',
                booking_time: '',
                customer_name: '',
                customer_email: '',
            });
            setError('');
        } catch (err) {
            setError(err.response?.data?.error || 'Erreur lors de l’ajout de la réservation');
            console.error('Erreur handleAddBooking:', err.response?.data || err.message);
        }
    };

    // Modifier une réservation
    const handleEditBooking = async (booking) => {
        try {
            const response = await api.put(`/api/bookings/${booking.id}`, {
                service_id: parseInt(booking.service_id),
                booking_date: booking.booking_date,
                booking_time: booking.booking_time,
                customer_name: booking.customer_name,
                customer_email: booking.customer_email,
            });
            setBookings(bookings.map((b) => (b.id === booking.id ? response.data : b)));
            setEditingBooking(null);
            setError('');
        } catch (err) {
            setError(err.response?.data?.error || 'Erreur lors de la modification de la réservation');
            console.error('Erreur handleEditBooking:', err.response?.data || err.message);
        }
    };

    // Supprimer une réservation
    const handleDeleteBooking = async (id) => {
        try {
            await api.delete(`/api/bookings/${id}`);
            setBookings(bookings.filter((b) => b.id !== id));
            setError('');
        } catch (err) {
            setError(err.response?.data?.error || 'Erreur lors de la suppression de la réservation');
            console.error('Erreur handleDeleteBooking:', err.response?.data || err.message);
        }
    };

    return (
        <section className="section bg-gray-50 min-h-screen py-12">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-serif font-bold mb-8 text-center">Gestion des Réservations</h2>

                {error && <p className="text-red-500 mb-4">{error}</p>}

                {/* Formulaire d'ajout */}
                <form onSubmit={handleAddBooking} className="mb-12 bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold mb-4">Ajouter une Réservation</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <select
                            value={newBooking.service_id}
                            onChange={(e) => setNewBooking({ ...newBooking, service_id: e.target.value })}
                            className="p-3 border rounded-lg w-full"
                            required
                        >
                            <option value="">Sélectionner un service</option>
                            {services.map((service) => (
                                <option key={service.id} value={service.id}>{service.name}</option>
                            ))}
                        </select>
                        <input
                            type="date"
                            value={newBooking.booking_date}
                            onChange={(e) => setNewBooking({ ...newBooking, booking_date: e.target.value })}
                            className="p-3 border rounded-lg w-full"
                            required
                        />
                        <input
                            type="time"
                            value={newBooking.booking_time}
                            onChange={(e) => setNewBooking({ ...newBooking, booking_time: e.target.value })}
                            className="p-3 border rounded-lg w-full"
                            required
                        />
                        <input
                            type="text"
                            placeholder="Nom du client"
                            value={newBooking.customer_name}
                            onChange={(e) => setNewBooking({ ...newBooking, customer_name: e.target.value })}
                            className="p-3 border rounded-lg w-full"
                            required
                        />
                        <input
                            type="email"
                            placeholder="Email du client"
                            value={newBooking.customer_email}
                            onChange={(e) => setNewBooking({ ...newBooking, customer_email: e.target.value })}
                            className="p-3 border rounded-lg w-full"
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary mt-4">Ajouter</button>
                </form>

                {/* Liste des réservations */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold mb-4">Liste des Réservations</h3>
                    <table className="w-full table-auto">
                        <thead>
                        <tr className="bg-gray-100">
                            <th className="p-3 text-left">Service</th>
                            <th className="p-3 text-left">Date</th>
                            <th className="p-3 text-left">Heure</th>
                            <th className="p-3 text-left">Client</th>
                            <th className="p-3 text-left">Email</th>
                            <th className="p-3 text-left">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {bookings.map((booking) => {
                            const service = services.find((s) => s.id === booking.service_id);
                            return (
                                <tr key={booking.id} className="border-b">
                                    <td className="p-3">{service ? service.name : 'Inconnu'}</td>
                                    <td className="p-3">{booking.booking_date}</td>
                                    <td className="p-3">{booking.booking_time}</td>
                                    <td className="p-3">{booking.customer_name}</td>
                                    <td className="p-3">{booking.customer_email}</td>
                                    <td className="p-3">
                                        <button
                                            onClick={() => setEditingBooking(booking)}
                                            className="text-blue-500 hover:underline mr-4"
                                        >
                                            Modifier
                                        </button>
                                        <button
                                            onClick={() => handleDeleteBooking(booking.id)}
                                            className="text-red-500 hover:underline"
                                        >
                                            Supprimer
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                </div>

                {/* Formulaire de modification (modal) */}
                {editingBooking && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <div className="bg-white p-6 rounded-lg w-full max-w-md">
                            <h3 className="text-xl font-semibold mb-4">Modifier la Réservation</h3>
                            <select
                                value={editingBooking.service_id}
                                onChange={(e) => setEditingBooking({ ...editingBooking, service_id: e.target.value })}
                                className="p-3 border rounded-lg w-full mb-4"
                            >
                                <option value="">Sélectionner un service</option>
                                {services.map((service) => (
                                    <option key={service.id} value={service.id}>{service.name}</option>
                                ))}
                            </select>
                            <input
                                type="date"
                                value={editingBooking.booking_date}
                                onChange={(e) => setEditingBooking({ ...editingBooking, booking_date: e.target.value })}
                                className="p-3 border rounded-lg w-full mb-4"
                            />
                            <input
                                type="time"
                                value={editingBooking.booking_time}
                                onChange={(e) => setEditingBooking({ ...editingBooking, booking_time: e.target.value })}
                                className="p-3 border rounded-lg w-full mb-4"
                            />
                            <input
                                type="text"
                                value={editingBooking.customer_name}
                                onChange={(e) => setEditingBooking({ ...editingBooking, customer_name: e.target.value })}
                                className="p-3 border rounded-lg w-full mb-4"
                            />
                            <input
                                type="email"
                                value={editingBooking.customer_email}
                                onChange={(e) => setEditingBooking({ ...editingBooking, customer_email: e.target.value })}
                                className="p-3 border rounded-lg w-full mb-4"
                            />
                            <div className="flex justify-end space-x-4">
                                <button
                                    onClick={() => setEditingBooking(null)}
                                    className="btn bg-gray-300 hover:bg-gray-400"
                                >
                                    Annuler
                                </button>
                                <button
                                    onClick={() => handleEditBooking(editingBooking)}
                                    className="btn btn-primary"
                                >
                                    Enregistrer
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default BookingsManagement;