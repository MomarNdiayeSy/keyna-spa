import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const SchedulesManagement = () => {
    const [schedules, setSchedules] = useState([]);
    const [services, setServices] = useState([]);
    const [newSchedule, setNewSchedule] = useState({ service_id: '', day: '', start_time: '', end_time: '' });
    const [error, setError] = useState('');
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
    }, [navigate]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const [schedulesResponse, servicesResponse] = await Promise.all([
                    axios.get('http://localhost:5000/api/schedules', {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    axios.get('http://localhost:5000/api/services'),
                ]);
                console.log('Services response:', servicesResponse.data); // Pour débogage
                setSchedules(Array.isArray(schedulesResponse.data) ? schedulesResponse.data : []);
                setServices(Array.isArray(servicesResponse.data) ? servicesResponse.data : []);
                setError('');
            } catch (err) {
                if (err.response?.status === 401) {
                    setError('Session expirée. Veuillez vous reconnecter.');
                    navigate('/login');
                } else if (err.response?.status === 404) {
                    setError('Aucun créneau ou service trouvé.');
                } else {
                    setError('Erreur lors du chargement des données. Veuillez réessayer.');
                }
                console.error('Erreur:', err);
            }
        };
        fetchData();
    }, [navigate]);

    const handleAddSchedule = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/schedules', newSchedule, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            setSchedules([...schedules, response.data]);
            setNewSchedule({ service_id: '', day: '', start_time: '', end_time: '' });
            setError('');
        } catch (err) {
            setError(err.response?.data?.error || 'Erreur lors de l’ajout du créneau.');
            console.error('Erreur:', err);
        }
    };

    const handleToggleAvailability = async (id, is_available) => {
        try {
            const response = await axios.put(`http://localhost:5000/api/schedules/${id}`, { is_available }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            setSchedules(schedules.map((s) => (s.id === id ? response.data : s)));
            setError('');
        } catch (err) {
            setError(err.response?.data?.error || 'Erreur lors de la modification du créneau.');
            console.error('Erreur:', err);
        }
    };

    const handleDeleteSchedule = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/schedules/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            setSchedules(schedules.filter((s) => s.id !== id));
            setError('');
        } catch (err) {
            setError(err.response?.data?.error || 'Erreur lors de la suppression du créneau.');
            console.error('Erreur:', err);
        }
    };

    return (
        <section className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-serif font-bold mb-8 text-center text-primary-dark">Gestion des Créneaux Horaires</h2>

                {error && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-xl">
                        {error}
                    </div>
                )}

                <form onSubmit={handleAddSchedule} className="mb-12 bg-white p-6 rounded-xl shadow-soft">
                    <h3 className="text-xl font-semibold mb-4 text-primary-dark">Ajouter un Créneau</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {services.length === 0 ? (
                            <div className="col-span-2 text-center text-neutral-dark/80">
                                <p>Aucun service disponible. Veuillez d'abord ajouter des services.</p>
                                <Link
                                    to="/admin/services"
                                    className="mt-2 inline-block bg-accent text-white px-4 py-2 rounded-xl hover:bg-accent-dark"
                                >
                                    Ajouter un service
                                </Link>
                            </div>
                        ) : (
                            <select
                                value={newSchedule.service_id}
                                onChange={(e) => setNewSchedule({ ...newSchedule, service_id: e.target.value })}
                                className="p-3 border border-neutral-light rounded-xl"
                                required
                            >
                                <option value="">Sélectionner un service</option>
                                {services.map((service) => (
                                    <option key={service.id} value={service.id}>{service.name}</option>
                                ))}
                            </select>
                        )}
                        <input
                            type="date"
                            value={newSchedule.day}
                            onChange={(e) => setNewSchedule({ ...newSchedule, day: e.target.value })}
                            className="p-3 border border-neutral-light rounded-xl"
                            required
                            disabled={services.length === 0}
                        />
                        <input
                            type="time"
                            value={newSchedule.start_time}
                            onChange={(e) => setNewSchedule({ ...newSchedule, start_time: e.target.value })}
                            className="p-3 border border-neutral-light rounded-xl"
                            required
                            disabled={services.length === 0}
                        />
                        <input
                            type="time"
                            value={newSchedule.end_time}
                            onChange={(e) => setNewSchedule({ ...newSchedule, end_time: e.target.value })}
                            className="p-3 border border-neutral-light rounded-xl"
                            required
                            disabled={services.length === 0}
                        />
                    </div>
                    <button
                        type="submit"
                        className="mt-4 bg-accent text-white px-6 py-2 rounded-xl hover:bg-accent-dark"
                        disabled={services.length === 0}
                    >
                        Ajouter
                    </button>
                </form>

                <div className="bg-white p-6 rounded-xl shadow-soft">
                    <h3 className="text-xl font-semibold mb-4 text-primary-dark">Liste des Créneaux</h3>
                    {schedules.length === 0 ? (
                        <p className="text-center text-neutral-dark/80">Aucun créneau disponible.</p>
                    ) : (
                        <table className="w-full table-auto">
                            <thead>
                                <tr className="bg-neutral-light">
                                    <th className="p-3 text-left">Service</th>
                                    <th className="p-3 text-left">Date</th>
                                    <th className="p-3 text-left">Heure</th>
                                    <th className="p-3 text-left">Disponible</th>
                                    <th className="p-3 text-left">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {schedules.map((schedule) => {
                                    const service = services.find((s) => s.id === schedule.service_id);
                                    return (
                                        <tr key={schedule.id} className="border-b">
                                            <td className="p-3">{service ? service.name : 'Inconnu'}</td>
                                            <td className="p-3">{schedule.day}</td>
                                            <td className="p-3">{schedule.start_time} - {schedule.end_time}</td>
                                            <td className="p-3">
                                                <span className={schedule.is_available ? 'text-accent' : 'text-red-500'}>
                                                    {schedule.is_available ? 'Oui' : 'Non'}
                                                </span>
                                            </td>
                                            <td className="p-3">
                                                <button
                                                    onClick={() => handleToggleAvailability(schedule.id, !schedule.is_available)}
                                                    className="text-blue-500 hover:underline mr-4"
                                                >
                                                    {schedule.is_available ? 'Rendre indisponible' : 'Rendre disponible'}
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteSchedule(schedule.id)}
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
                    )}
                </div>
            </div>
        </section>
    );
};

export default SchedulesManagement;