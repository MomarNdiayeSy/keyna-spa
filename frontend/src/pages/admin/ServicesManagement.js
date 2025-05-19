import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { jwtDecode } from 'jwt-decode';

const ServicesManagement = () => {
    const [services, setServices] = useState([]);
    const [newService, setNewService] = useState({ name: '', description: '', price: '', duration: '', image: null });
    const [editingService, setEditingService] = useState(null);
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
            navigate('/login');
        }
    }, [navigate]);

    // Charger les services
    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await api.get('/api/services');
                const formattedServices = response.data.map((service) => ({
                    ...service,
                    price: parseFloat(service.price),
                }));
                setServices(formattedServices);
            } catch (err) {
                setError('Erreur lors du chargement des services');
                console.error('Erreur fetchServices:', err.response?.data || err.message);
            }
        };
        fetchServices();
    }, []);

    // Ajouter un service
    const handleAddService = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('name', newService.name);
            formData.append('description', newService.description);
            formData.append('price', parseFloat(newService.price));
            formData.append('duration', newService.duration);
            if (newService.image) {
                formData.append('image', newService.image);
            }

            const response = await api.post('/api/services', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setServices([...services, { ...response.data, price: parseFloat(response.data.price) }]);
            setNewService({ name: '', description: '', price: '', duration: '', image: null });
            setError('');
        } catch (err) {
            setError(err.response?.data?.error || 'Erreur lors de l’ajout du service');
            console.error('Erreur handleAddService:', err.response?.data || err.message);
        }
    };

    // Modifier un service
    const handleEditService = async (service) => {
        try {
            const formData = new FormData();
            formData.append('name', service.name);
            formData.append('description', service.description);
            formData.append('price', parseFloat(service.price));
            formData.append('duration', service.duration);
            if (service.image instanceof File) {
                formData.append('image', service.image);
            } else if (service.image) {
                formData.append('image', service.image);
            }

            const response = await api.put(`/api/services/${service.id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setServices(services.map((s) => (s.id === service.id ? { ...response.data, price: parseFloat(response.data.price) } : s)));
            setEditingService(null);
            setError('');
        } catch (err) {
            setError(err.response?.data?.error || 'Erreur lors de la modification du service');
            console.error('Erreur handleEditService:', err.response?.data || err.message);
        }
    };

    // Supprimer un service
    const handleDeleteService = async (id) => {
        try {
            await api.delete(`/api/services/${id}`);
            setServices(services.filter((s) => s.id !== id));
            setError('');
        } catch (err) {
            setError(err.response?.data?.error || 'Erreur lors de la suppression du service');
            console.error('Erreur handleDeleteService:', err.response?.data || err.message);
        }
    };

    return (
        <section className="section bg-gray-50 min-h-screen py-12">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-serif font-bold mb-8 text-center">Gestion des Services</h2>

                {error && <p className="text-red-500 mb-4">{error}</p>}

                {/* Formulaire d'ajout */}
                <form onSubmit={handleAddService} className="mb-12 bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold mb-4">Ajouter un Service</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            type="text"
                            placeholder="Nom"
                            value={newService.name}
                            onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                            className="p-3 border rounded-lg w-full"
                            required
                        />
                        <input
                            type="text"
                            placeholder="Description"
                            value={newService.description}
                            onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                            className="p-3 border rounded-lg w-full"
                        />
                        <input
                            type="number"
                            placeholder="Prix (€)"
                            value={newService.price}
                            onChange={(e) => setNewService({ ...newService, price: e.target.value })}
                            className="p-3 border rounded-lg w-full"
                            required
                        />
                        <input
                            type="text"
                            placeholder="Durée (ex. 60 min)"
                            value={newService.duration}
                            onChange={(e) => setNewService({ ...newService, duration: e.target.value })}
                            className="p-3 border rounded-lg w-full"
                            required
                        />
                        <input
                            type="file"
                            accept="image/jpeg,image/jpg,image/png"
                            onChange={(e) => setNewService({ ...newService, image: e.target.files[0] })}
                            className="p-3 border rounded-lg w-full"
                        />
                    </div>
                    <button type="submit" className="btn btn-primary mt-4">Ajouter</button>
                </form>

                {/* Liste des services */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold mb-4">Liste des Services</h3>
                    <table className="w-full table-auto">
                        <thead>
                        <tr className="bg-gray-100">
                            <th className="p-3 text-left">Nom</th>
                            <th className="p-3 text-left">Description</th>
                            <th className="p-3 text-left">Prix (€)</th>
                            <th className="p-3 text-left">Durée</th>
                            <th className="p-3 text-left">Image</th>
                            <th className="p-3 text-left">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {services.map((service) => (
                            <tr key={service.id} className="border-b">
                                <td className="p-3">{service.name}</td>
                                <td className="p-3">{service.description}</td>
                                <td className="p-3">{Number(service.price).toFixed(2)}</td>
                                <td className="p-3">{service.duration}</td>
                                <td className="p-3">
                                    {service.image ? (
                                        <img
                                            src={`http://localhost:5000${service.image}`}
                                            alt={service.name}
                                            className="w-16 h-16 object-cover"
                                        />
                                    ) : (
                                        'Aucune image'
                                    )}
                                </td>
                                <td className="p-3">
                                    <button
                                        onClick={() => setEditingService(service)}
                                        className="text-blue-500 hover:underline mr-4"
                                    >
                                        Modifier
                                    </button>
                                    <button
                                        onClick={() => handleDeleteService(service.id)}
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

                {/* Formulaire de modification (modal) */}
                {editingService && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <div className="bg-white p-6 rounded-lg w-full max-w-md">
                            <h3 className="text-xl font-semibold mb-4">Modifier le Service</h3>
                            <input
                                type="text"
                                value={editingService.name}
                                onChange={(e) => setEditingService({ ...editingService, name: e.target.value })}
                                className="p-3 border rounded-lg w-full mb-4"
                            />
                            <input
                                type="text"
                                value={editingService.description}
                                onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                                className="p-3 border rounded-lg w-full mb-4"
                            />
                            <input
                                type="number"
                                value={editingService.price}
                                onChange={(e) => setEditingService({ ...editingService, price: e.target.value })}
                                className="p-3 border rounded-lg w-full mb-4"
                            />
                            <input
                                type="text"
                                value={editingService.duration}
                                onChange={(e) => setEditingService({ ...editingService, duration: e.target.value })}
                                className="p-3 border rounded-lg w-full mb-4"
                            />
                            {editingService.image && typeof editingService.image === 'string' && (
                                <img
                                    src={`http://localhost:5000${editingService.image}`}
                                    alt={editingService.name}
                                    className="w-16 h-16 object-cover mb-4"
                                />
                            )}
                            <input
                                type="file"
                                accept="image/jpeg,image/jpg,image/png"
                                onChange={(e) => setEditingService({ ...editingService, image: e.target.files[0] })}
                                className="p-3 border rounded-lg w-full mb-4"
                            />
                            <div className="flex justify-end space-x-4">
                                <button
                                    onClick={() => setEditingService(null)}
                                    className="btn bg-gray-300 hover:bg-gray-400"
                                >
                                    Annuler
                                </button>
                                <button
                                    onClick={() => handleEditService(editingService)}
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

export default ServicesManagement;