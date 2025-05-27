import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import io from 'socket.io-client';

const BookingsManagement = () => {
    const [bookings, setBookings] = useState([]);
    const [services, setServices] = useState([]);
    const [tariffs, setTariffs] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedServiceId, setSelectedServiceId] = useState('');
    const [newBooking, setNewBooking] = useState({
        tariff_id: '',
        date_time: '',
        customer_name: '',
        customer_email: '',
        customer_phone: '',
        user_id: '',
        status: 'pending',
    });
    const [editingBooking, setEditingBooking] = useState(null);
    const [error, setError] = useState('');
    const [notifications, setNotifications] = useState([]);
    const navigate = useNavigate();

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
            navigate('/login');
        }

        // Établir la connexion Socket.IO
        const socket = io('http://localhost:5000', {
            auth: { token },
        });

        socket.on('connect', () => {
            console.log('Connecté au serveur Socket.IO');
        });

        socket.on('newBooking', (booking) => {
            setNotifications((prev) => [
                ...prev,
                {
                    id: Date.now(),
                    message: `Nouvelle réservation par ${booking.customer_name} pour ${booking.service_name} (${booking.tariff_name}) le ${new Date(booking.date_time).toLocaleString('fr-FR')}`,
                    booking,
                },
            ]);
            // Mettre à jour la liste des réservations
            setBookings((prev) => [...prev, booking]);
        });

        socket.on('connect_error', (err) => {
            console.error('Erreur de connexion Socket.IO:', err.message);
        });

        return () => {
            socket.disconnect();
        };
    }, [navigate]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const [bookingsRes, servicesRes, usersRes] = await Promise.all([
                    axios.get('http://localhost:5000/api/bookings', {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    axios.get('http://localhost:5000/api/services', {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    axios.get('http://localhost:5000/api/users', {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                ]);

                setBookings(bookingsRes.data);
                setServices(servicesRes.data);
                setUsers(usersRes.data);
                setError('');
            } catch (err) {
                setError('Erreur lors du chargement des données.');
                console.error('Erreur:', err);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const fetchTariffs = async () => {
            if (selectedServiceId) {
                try {
                    const token = localStorage.getItem('token');
                    const tariffsRes = await axios.get(`http://localhost:5000/api/tariffs/${selectedServiceId}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    setTariffs(tariffsRes.data);
                } catch (err) {
                    setError('Erreur lors de la récupération des tarifs.');
                    console.error('Erreur:', err);
                }
            } else {
                setTariffs([]);
            }
        };
        fetchTariffs();
    }, [selectedServiceId]);

    const handleAddBooking = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('http://localhost:5000/api/bookings', {
                ...newBooking,
                date_time: newBooking.date_time ? new Date(newBooking.date_time).toISOString() : null,
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setBookings([...bookings, {
                ...response.data,
                service_name: services.find(s => s.id === tariffs.find(t => t.id === parseInt(newBooking.tariff_id))?.service_id)?.name,
                tariff_name: tariffs.find(t => t.id === parseInt(newBooking.tariff_id))?.name,
            }]);
            setNewBooking({
                tariff_id: '',
                date_time: '',
                customer_name: '',
                customer_email: '',
                customer_phone: '',
                user_id: '',
                status: 'pending',
            });
            setSelectedServiceId('');
            setError('');
        } catch (err) {
            setError(err.response?.data?.error || 'Erreur lors de l’ajout de la réservation.');
            console.error('Erreur:', err);
        }
    };

    const handleEditBooking = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(`http://localhost:5000/api/bookings/${editingBooking.id}`, {
                ...editingBooking,
                date_time: editingBooking.date_time ? new Date(editingBooking.date_time).toISOString() : null,
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setBookings(bookings.map((b) => (b.id === editingBooking.id ? {
                ...response.data,
                service_name: services.find(s => s.id === tariffs.find(t => t.id === parseInt(response.data.tariff_id))?.service_id)?.name,
                tariff_name: tariffs.find(t => t.id === parseInt(response.data.tariff_id))?.name,
            } : b)));
            setEditingBooking(null);
            setSelectedServiceId('');
            setError('');
        } catch (err) {
            setError(err.response?.data?.error || 'Erreur lors de la modification de la réservation.');
            console.error('Erreur:', err);
        }
    };

    const handleDeleteBooking = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5000/api/bookings/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setBookings(bookings.filter((b) => b.id !== id));
            setError('');
        } catch (err) {
            setError(err.response?.data?.error || 'Erreur lors de la suppression de la réservation.');
            console.error('Erreur:', err);
        }
    };

    const removeNotification = (id) => {
        setNotifications((prev) => prev.filter((notif) => notif.id !== id));
    };

    return (
        <section className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto px-4 relative">
                <h2 className="text-3xl font-serif font-bold mb-8 text-center text-primary-dark">Gestion des Réservations</h2>

                {error && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-xl">
                        {error}
                    </div>
                )}

                {/* Notifications Toast */}
                <div className="fixed top-4 right-4 z-50 space-y-2">
                    {notifications.map((notif) => (
                        <div
                            key={notif.id}
                            className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-xl shadow-lg flex items-center justify-between max-w-sm"
                            onMouseEnter={() => clearTimeout(notif.timeoutId)}
                            onMouseLeave={() => {
                                notif.timeoutId = setTimeout(() => removeNotification(notif.id), 5000);
                            }}
                        >
                            <span>{notif.message}</span>
                            <button
                                onClick={() => removeNotification(notif.id)}
                                className="ml-4 text-green-700 hover:text-green-900"
                            >
                                ✕
                            </button>
                        </div>
                    ))}
                </div>

                <form onSubmit={handleAddBooking} className="mb-12 bg-white p-6 rounded-xl shadow-soft">
                    <h3 className="text-xl font-semibold mb-4 text-primary-dark">Ajouter une Réservation</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <select
                            value={selectedServiceId}
                            onChange={(e) => setSelectedServiceId(e.target.value)}
                            className="p-3 border border-neutral-light rounded-xl"
                            required
                        >
                            <option value="">Sélectionner un service</option>
                            {services.map((service) => (
                                <option key={service.id} value={service.id}>
                                    {service.name}
                                </option>
                            ))}
                        </select>
                        <select
                            value={newBooking.tariff_id}
                            onChange={(e) => setNewBooking({ ...newBooking, tariff_id: e.target.value })}
                            className="p-3 border border-neutral-light rounded-xl"
                            required
                            disabled={!selectedServiceId}
                        >
                            <option value="">Sélectionner une option</option>
                            {tariffs.map((tariff) => (
                                <option key={tariff.id} value={tariff.id}>
                                    {tariff.name} ({parseFloat(tariff.price).toFixed(2)} €, {tariff.duration})
                                </option>
                            ))}
                        </select>
                        <input
                            type="datetime-local"
                            value={newBooking.date_time}
                            onChange={(e) => setNewBooking({ ...newBooking, date_time: e.target.value })}
                            className="p-3 border border-neutral-light rounded-xl"
                            required
                        />
                        <input
                            type="text"
                            placeholder="Nom du client"
                            value={newBooking.customer_name}
                            onChange={(e) => setNewBooking({ ...newBooking, customer_name: e.target.value })}
                            className="p-3 border border-neutral-light rounded-xl"
                            required
                        />
                        <input
                            type="email"
                            placeholder="Email du client"
                            value={newBooking.customer_email}
                            onChange={(e) => setNewBooking({ ...newBooking, customer_email: e.target.value })}
                            className="p-3 border border-neutral-light rounded-xl"
                            required
                        />
                        <input
                            type="tel"
                            placeholder="Numéro de téléphone"
                            value={newBooking.customer_phone}
                            onChange={(e) => setNewBooking({ ...newBooking, customer_phone: e.target.value })}
                            className="p-3 border border-neutral-light rounded-xl"
                        />
                        <select
                            value={newBooking.user_id}
                            onChange={(e) => setNewBooking({ ...newBooking, user_id: e.target.value })}
                            className="p-3 border border-neutral-light rounded-xl"
                        >
                            <option value="">Aucun utilisateur associé</option>
                            {users.map((user) => (
                                <option key={user.id} value={user.id}>
                                    {user.name} ({user.email || 'N/A'})
                                </option>
                            ))}
                        </select>
                        <select
                            value={newBooking.status}
                            onChange={(e) => setNewBooking({ ...newBooking, status: e.target.value })}
                            className="p-3 border border-neutral-light rounded-xl"
                        >
                            <option value="pending">En attente</option>
                            <option value="confirmed">Confirmée</option>
                            <option value="cancelled">Annulée</option>
                        </select>
                    </div>
                    <button type="submit" className="mt-4 bg-accent text-white px-6 py-2 rounded-xl hover:bg-accent-dark">
                        Ajouter
                    </button>
                </form>

                <div className="bg-white p-6 rounded-xl shadow-soft">
                    <h3 className="text-xl font-semibold mb-4 text-primary-dark">Liste des Réservations</h3>
                    <table className="w-full table-auto">
                        <thead>
                            <tr className="bg-neutral-light">
                                <th className="p-3 text-left">Service</th>
                                <th className="p-3 text-left">Option</th>
                                <th className="p-3 text-left">Date et heure</th>
                                <th className="p-3 text-left">Client</th>
                                <th className="p-3 text-left">Email</th>
                                <th className="p-3 text-left">Téléphone</th>
                                <th className="p-3 text-left">Statut</th>
                                <th className="p-3 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.map((booking) => (
                                <tr key={booking.id} className="border-b">
                                    <td className="p-3">{booking.service_name || 'N/A'}</td>
                                    <td className="p-3">{booking.tariff_name || 'N/A'}</td>
                                    <td className="p-3">{new Date(booking.date_time).toLocaleString('fr-FR')}</td>
                                    <td className="p-3">{booking.customer_name}</td>
                                    <td className="p-3">{booking.customer_email}</td>
                                    <td className="p-3">{booking.customer_phone || 'N/A'}</td>
                                    <td className="p-3">{booking.status}</td>
                                    <td className="p-3">
                                        <button
                                            onClick={() => {
                                                setEditingBooking(booking);
                                                setSelectedServiceId(tariffs.find(t => t.id === parseInt(booking.tariff_id))?.service_id || '');
                                            }}
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
                            ))}
                        </tbody>
                    </table>
                </div>

                {editingBooking && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <div className="bg-white p-6 rounded-xl shadow-soft w-full max-w-md">
                            <h3 className="text-lg font-semibold mb-4 text-primary-dark">Modifier la Réservation</h3>
                            <form onSubmit={handleEditBooking}>
                                <select
                                    value={selectedServiceId}
                                    onChange={(e) => setSelectedServiceId(e.target.value)}
                                    className="p-3 border border-neutral-light rounded-xl w-full mb-4"
                                    required
                                >
                                    <option value="">Sélectionner un service</option>
                                    {services.map((service) => (
                                        <option key={service.id} value={service.id}>
                                            {service.name}
                                        </option>
                                    ))}
                                </select>
                                <select
                                    value={editingBooking.tariff_id}
                                    onChange={(e) => setEditingBooking({ ...editingBooking, tariff_id: e.target.value })}
                                    className="p-3 border border-neutral-light rounded-xl w-full mb-4"
                                    required
                                    disabled={!selectedServiceId}
                                >
                                    <option value="">Sélectionner une option</option>
                                    {tariffs.map((tariff) => (
                                        <option key={tariff.id} value={tariff.id}>
                                            {tariff.name} ({parseFloat(tariff.price).toFixed(2)} €, {tariff.duration})
                                        </option>
                                    ))}
                                </select>
                                <input
                                    type="datetime-local"
                                    value={
                                        editingBooking.date_time
                                            ? new Date(editingBooking.date_time).toISOString().slice(0, 16)
                                            : ''
                                    }
                                    onChange={(e) => setEditingBooking({ ...editingBooking, date_time: e.target.value })}
                                    className="p-3 border border-neutral-light rounded-xl w-full mb-4"
                                    required
                                />
                                <input
                                    type="text"
                                    value={editingBooking.customer_name}
                                    onChange={(e) => setEditingBooking({ ...editingBooking, customer_name: e.target.value })}
                                    className="p-3 border border-neutral-light rounded-xl w-full mb-4"
                                    required
                                />
                                <input
                                    type="email"
                                    value={editingBooking.customer_email}
                                    onChange={(e) => setEditingBooking({ ...editingBooking, customer_email: e.target.value })}
                                    className="p-3 border border-neutral-light rounded-xl w-full mb-4"
                                    required
                                />
                                <input
                                    type="tel"
                                    value={editingBooking.customer_phone || ''}
                                    onChange={(e) => setEditingBooking({ ...editingBooking, customer_phone: e.target.value })}
                                    className="p-3 border border-neutral-light rounded-xl w-full mb-4"
                                    placeholder="+33 1 23 45 67 89"
                                />
                                <select
                                    value={editingBooking.user_id || ''}
                                    onChange={(e) => setEditingBooking({ ...editingBooking, user_id: e.target.value })}
                                    className="p-3 border border-neutral-light rounded-xl w-full mb-4"
                                >
                                    <option value="">Aucun utilisateur associé</option>
                                    {users.map((user) => (
                                        <option key={user.id} value={user.id}>
                                            {user.name} ({user.email || 'N/A'})
                                        </option>
                                    ))}
                                </select>
                                <select
                                    value={editingBooking.status}
                                    onChange={(e) => setEditingBooking({ ...editingBooking, status: e.target.value })}
                                    className="p-3 border border-neutral-light rounded-xl w-full mb-4"
                                >
                                    <option value="pending">En attente</option>
                                    <option value="confirmed">Confirmée</option>
                                    <option value="cancelled">Annulée</option>
                                </select>
                                <div className="flex justify-end space-x-4">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setEditingBooking(null);
                                            setSelectedServiceId('');
                                        }}
                                        className="px-4 py-2 bg-neutral-light rounded-xl hover:bg-neutral-dark hover:text-white"
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-accent text-white rounded-xl hover:bg-accent-dark"
                                    >
                                        Enregistrer
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default BookingsManagement;