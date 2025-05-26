import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const TariffsManagement = () => {
    const { serviceId } = useParams();
    const [tariffs, setTariffs] = useState([]);
    const [service, setService] = useState(null);
    const [newTariff, setNewTariff] = useState({ name: '', price: '', duration: '' });
    const [editingTariff, setEditingTariff] = useState(null);
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
                const [tariffsResponse, serviceResponse] = await Promise.all([
                    axios.get(`http://localhost:5000/api/tariffs/${serviceId}`),
                    axios.get(`http://localhost:5000/api/services`)
                ]);
                setTariffs(tariffsResponse.data);
                setService(serviceResponse.data.find(s => s.id === parseInt(serviceId)));
                setError('');
            } catch (err) {
                setError('Erreur lors du chargement des données.');
                console.error('Erreur:', err);
            }
        };
        fetchData();
    }, [serviceId]);

    const handleAddTariff = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/tariffs', {
                ...newTariff,
                service_id: serviceId,
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            setTariffs([...tariffs, response.data]);
            setNewTariff({ name: '', price: '', duration: '' });
            setError('');
        } catch (err) {
            setError(err.response?.data?.error || 'Erreur lors de l’ajout du tarif.');
            console.error('Erreur:', err);
        }
    };

    const handleEditTariff = async (tariff) => {
        try {
            const response = await axios.put(`http://localhost:5000/api/tariffs/${tariff.id}`, {
                name: tariff.name,
                price: parseFloat(tariff.price),
                duration: tariff.duration,
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            setTariffs(tariffs.map((t) => t.id === tariff.id ? response.data : t));
            setEditingTariff(null);
            setError('');
        } catch (err) {
            setError(err.response?.data?.error || 'Erreur lors de la modification du tarif.');
            console.error('Erreur:', err);
        }
    };

    const handleDeleteTariff = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/tariffs/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            setTariffs(tariffs.filter((t) => t.id !== id));
            setError('');
        } catch (err) {
            setError(err.response?.data?.error || 'Erreur lors de la suppression du tarif.');
            console.error('Erreur:', err);
        }
    };

    return (
        <section className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-serif font-bold mb-8 text-center text-primary-dark">
                    Gestion des Tarifs - {service ? service.name : '...'}
                </h2>

                {error && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-xl">
                        {error}
                    </div>
                )}

                <form onSubmit={handleAddTariff} className="mb-12 bg-white p-6 rounded-xl shadow-soft">
                    <h3 className="text-xl font-semibold mb-4 text-primary-dark">Ajouter un Tarif</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <input
                            type="text"
                            placeholder="Nom (ex. : 35 min)"
                            value={newTariff.name}
                            onChange={(e) => setNewTariff({ ...newTariff, name: e.target.value })}
                            className="p-3 border border-neutral-light rounded-xl"
                            required
                        />
                        <input
                            type="number"
                            step="0.01"
                            placeholder="Prix (€)"
                            value={newTariff.price}
                            onChange={(e) => setNewTariff({ ...newTariff, price: e.target.value })}
                            className="p-3 border border-neutral-light rounded-xl"
                            required
                        />
                        <input
                            type="text"
                            placeholder="Durée (ex. : 35 min)"
                            value={newTariff.duration}
                            onChange={(e) => setNewTariff({ ...newTariff, duration: e.target.value })}
                            className="p-3 border border-neutral-light rounded-xl"
                            required
                        />
                    </div>
                    <button type="submit" className="mt-4 bg-accent text-white px-6 py-2 rounded-xl hover:bg-accent-dark">
                        Ajouter
                    </button>
                </form>

                <div className="bg-white p-6 rounded-xl shadow-soft">
                    <h3 className="text-xl font-semibold mb-4 text-primary-dark">Liste des Tarifs</h3>
                    <table className="w-full table-auto">
                        <thead>
                            <tr className="bg-neutral-light">
                                <th className="p-3 text-left">Nom</th>
                                <th className="p-3 text-left">Prix (€)</th>
                                <th className="p-3 text-left">Durée</th>
                                <th className="p-3 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tariffs.map((tariff) => (
                                <tr key={tariff.id} className="border-b">
                                    <td className="p-3">{tariff.name}</td>
                                    <td className="p-3">{parseFloat(tariff.price).toFixed(2)}</td>
                                    <td className="p-3">{tariff.duration}</td>
                                    <td className="p-3">
                                        <button
                                            onClick={() => setEditingTariff(tariff)}
                                            className="text-blue-500 hover:underline mr-4"
                                        >
                                            Modifier
                                        </button>
                                        <button
                                            onClick={() => handleDeleteTariff(tariff.id)}
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

                {editingTariff && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <div className="bg-white p-6 rounded-xl shadow-soft w-full max-w-md">
                            <h3 className="text-lg font-semibold mb-4 text-primary-dark">Modifier le Tarif</h3>
                            <input
                                type="text"
                                value={editingTariff.name}
                                onChange={(e) => setEditingTariff({ ...editingTariff, name: e.target.value })}
                                className="p-3 border border-neutral-light rounded-xl w-full mb-4"
                                required
                            />
                            <input
                                type="number"
                                step="0.01"
                                value={editingTariff.price}
                                onChange={(e) => setEditingTariff({ ...editingTariff, price: e.target.value })}
                                className="p-3 border border-neutral-light rounded-xl w-full mb-4"
                                required
                            />
                            <input
                                type="text"
                                value={editingTariff.duration}
                                onChange={(e) => setEditingTariff({ ...editingTariff, duration: e.target.value })}
                                className="p-3 border border-neutral-light rounded-xl w-full mb-4"
                                required
                            />
                            <div className="flex justify-end space-x-4">
                                <button
                                    onClick={() => setEditingTariff(null)}
                                    className="px-4 py-2 bg-neutral-light rounded-xl hover:bg-neutral-dark hover:text-white"
                                >
                                    Annuler
                                </button>
                                <button
                                    onClick={() => handleEditTariff(editingTariff)}
                                    className="px-4 py-2 bg-accent text-white rounded-xl hover:bg-accent-dark"
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

export default TariffsManagement;