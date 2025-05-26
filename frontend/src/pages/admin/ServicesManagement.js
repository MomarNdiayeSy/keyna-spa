import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const ServicesManagement = () => {
    const [services, setServices] = useState([]);
    const [newService, setNewService] = useState({ name: '', description: '' });
    const [editingService, setEditingService] = useState(null);
    const [image, setImage] = useState(null);
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
        const fetchServices = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/services', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                });
                setServices(response.data);
                setError('');
            } catch (err) {
                setError('Erreur lors de la récupération des services.');
                console.error('Erreur:', err);
            }
        };
        fetchServices();
    }, []);

    const handleAddService = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', newService.name);
        formData.append('description', newService.description);
        if (image) formData.append('image', image);

        try {
            const response = await axios.post('http://localhost:5000/api/services', formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            setServices([...services, response.data]);
            setNewService({ name: '', description: '' });
            setImage(null);
            setError('');
        } catch (err) {
            setError(err.response?.data?.error || 'Erreur lors de l’ajout du service.');
            console.error('Erreur:', err);
        }
    };

    const handleEditService = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', editingService.name);
        formData.append('description', editingService.description);
        if (image) formData.append('image', image);
        else formData.append('image', editingService.image);

        try {
            const response = await axios.put(`http://localhost:5000/api/services/${editingService.id}`, formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            setServices(services.map((s) => (s.id === editingService.id ? response.data : s)));
            setEditingService(null);
            setImage(null);
            setError('');
        } catch (err) {
            setError(err.response?.data?.error || 'Erreur lors de la modification du service.');
            console.error('Erreur:', err);
        }
    };

    const handleDeleteService = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/services/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            setServices(services.filter((s) => s.id !== id));
            setError('');
        } catch (err) {
            setError(err.response?.data?.error || 'Erreur lors de la suppression du service.');
            console.error('Erreur:', err);
        }
    };

    return (
        <section className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-serif font-bold mb-8 text-center text-primary-dark">Gestion des Services</h2>

                {error && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-xl">
                        {error}
                    </div>
                )}

                <form onSubmit={handleAddService} className="mb-12 bg-white p-6 rounded-xl shadow-soft">
                    <h3 className="text-xl font-semibold mb-4 text-primary-dark">Ajouter un Service</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            type="text"
                            placeholder="Nom du service"
                            value={newService.name}
                            onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                            className="p-3 border border-neutral-light rounded-xl"
                            required
                        />
                        <input
                            type="text"
                            placeholder="Description"
                            value={newService.description}
                            onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                            className="p-3 border border-neutral-light rounded-xl"
                            required
                        />
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setImage(e.target.files[0])}
                            className="p-3 border border-neutral-light rounded-xl"
                        />
                    </div>
                    <button type="submit" className="mt-4 bg-accent text-white px-6 py-2 rounded-xl hover:bg-accent-dark">
                        Ajouter
                    </button>
                </form>

                <div className="bg-white p-6 rounded-xl shadow-soft">
                    <h3 className="text-xl font-semibold mb-4 text-primary-dark">Liste des Services</h3>
                    <table className="w-full table-auto">
                        <thead>
                            <tr className="bg-neutral-light">
                                <th className="p-3 text-left">Nom</th>
                                <th className="p-3 text-left">Description</th>
                                <th className="p-3 text-left">Image</th>
                                <th className="p-3 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {services.map((service) => (
                                <tr key={service.id} className="border-b">
                                    <td className="p-3">{service.name}</td>
                                    <td className="p-3">{service.description}</td>
                                    <td className="p-3">
                                        {service.image ? (
                                            <img
                                                src={`http://localhost:5000${service.image}`}
                                                alt={service.name}
                                                className="w-16 h-16 object-cover rounded-xl"
                                            />
                                        ) : (
                                            'Aucune image'
                                        )}
                                    </td>
                                    <td className="p-3">
                                        <Link
                                            to={`/admin/services/${service.id}/tariffs`}
                                            className="text-green-500 hover:underline mr-4"
                                        >
                                            Gérer Tarifs
                                        </Link>
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

                {editingService && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <div className="bg-white p-6 rounded-xl shadow-soft w-full max-w-md">
                            <h3 className="text-lg font-semibold mb-4 text-primary-dark">Modifier le Service</h3>
                            <form onSubmit={handleEditService}>
                                <input
                                    type="text"
                                    value={editingService.name}
                                    onChange={(e) => setEditingService({ ...editingService, name: e.target.value })}
                                    className="p-3 border border-neutral-light rounded-xl w-full mb-4"
                                    required
                                />
                                <input
                                    type="text"
                                    value={editingService.description}
                                    onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                                    className="p-3 border border-neutral-light rounded-xl w-full mb-4"
                                    required
                                />
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setImage(e.target.files[0])}
                                    className="p-3 border border-neutral-light rounded-xl w-full mb-4"
                                />
                                <div className="flex justify-end space-x-4">
                                    <button
                                        type="button"
                                        onClick={() => setEditingService(null)}
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

export default ServicesManagement;