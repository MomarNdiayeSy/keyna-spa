import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { jwtDecode } from 'jwt-decode';

const VipOffersManagement = () => {
    const [offers, setOffers] = useState([]);
    const [newOffer, setNewOffer] = useState({ name: '', description: '', price: '', image: null });
    const [editingOffer, setEditingOffer] = useState(null);
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

    // Charger les offres VIP
    useEffect(() => {
        const fetchOffers = async () => {
            try {
                const response = await api.get('/api/vip');
                // Convertir les prix en nombres
                const formattedOffers = response.data.map((offer) => ({
                    ...offer,
                    price: parseFloat(offer.price),
                }));
                setOffers(formattedOffers);
            } catch (err) {
                setError('Erreur lors du chargement des offres VIP');
                console.error('Erreur fetchOffers:', err.response?.data || err.message);
            }
        };
        fetchOffers();
    }, []);

    // Ajouter une offre VIP
    const handleAddOffer = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('name', newOffer.name);
            formData.append('description', newOffer.description);
            formData.append('price', parseFloat(newOffer.price));
            if (newOffer.image) {
                formData.append('image', newOffer.image);
            }
            const response = await api.post('/api/vip', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setOffers([...offers, { ...response.data, price: parseFloat(response.data.price) }]);
            setNewOffer({ name: '', description: '', price: '', image: null });
            setError('');
        } catch (err) {
            setError(err.response?.data?.error || 'Erreur lors de l’ajout de l’offre VIP');
            console.error('Erreur handleAddOffer:', err.response?.data || err.message);
        }
    };

    // Modifier une offre VIP
    const handleEditOffer = async (offer) => {
        try {
            const formData = new FormData();
            formData.append('name', offer.name);
            formData.append('description', offer.description);
            formData.append('price', parseFloat(offer.price));
            if (offer.image instanceof File) {
                formData.append('image', offer.image);
            }

            const response = await api.put(`/api/vip/${offer.id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setOffers(offers.map((o) => (o.id === offer.id ? { ...response.data, price: parseFloat(response.data.price) } : o)));
            setEditingOffer(null);
            setError('');
        } catch (err) {
            setError(err.response?.data?.error || 'Erreur lors de la modification de l’offre VIP');
            console.error('Erreur handleEditOffer:', err.response?.data || err.message);
        }
    };

    // Supprimer une offre VIP
    const handleDeleteOffer = async (id) => {
        try {
            await api.delete(`/api/vip/${id}`);
            setOffers(offers.filter((o) => o.id !== id));
            setError('');
        } catch (err) {
            setError(err.response?.data?.error || 'Erreur lors de la suppression de l’offre VIP');
            console.error('Erreur handleDeleteOffer:', err.response?.data || err.message);
        }
    };

    return (
        <section className="section bg-gray-50 min-h-screen py-12">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-serif font-bold mb-8 text-center">Gestion des Offres VIP</h2>

                {error && <p className="text-red-500 mb-4">{error}</p>}

                {/* Formulaire d'ajout */}
                <form onSubmit={handleAddOffer} className="mb-12 bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold mb-4">Ajouter une Offre VIP</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            type="text"
                            placeholder="Nom"
                            value={newOffer.name}
                            onChange={(e) => setNewOffer({ ...newOffer, name: e.target.value })}
                            className="p-3 border rounded-lg w-full"
                            required
                        />
                        <input
                            type="text"
                            placeholder="Description"
                            value={newOffer.description}
                            onChange={(e) => setNewOffer({ ...newOffer, description: e.target.value })}
                            className="p-3 border rounded-lg w-full"
                        />
                        <input
                            type="number"
                            placeholder="Prix (€)"
                            value={newOffer.price}
                            onChange={(e) => setNewOffer({ ...newOffer, price: e.target.value })}
                            className="p-3 border rounded-lg w-full"
                            required
                        />
                        <input
                            type="file"
                            accept="image/jpeg,image/png"
                            onChange={(e) => setNewOffer({ ...newOffer, image: e.target.files[0] })}
                            className="p-3 border rounded-lg w-full"
                        />
                    </div>
                    <button type="submit" className="btn btn-primary mt-4">Ajouter</button>
                </form>

                {/* Liste des offres VIP */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold mb-4">Liste des Offres VIP</h3>
                    <table className="w-full table-auto">
                        <thead>
                        <tr className="bg-gray-100">
                            <th className="p-3 text-left">Image</th>
                            <th className="p-3 text-left">Nom</th>
                            <th className="p-3 text-left">Description</th>
                            <th className="p-3 text-left">Prix (€)</th>
                            <th className="p-3 text-left">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {offers.map((offer) => (
                            <tr key={offer.id} className="border-b">
                                <td className="p-3">
                                    {offer.image ? (
                                        <img
                                            src={`http://localhost:5000/${offer.image}`}
                                            alt={offer.name}
                                            className="h-16 w-16 object-cover rounded"
                                        />
                                    ) : (
                                        'Aucune image'
                                    )}
                                </td>
                                <td className="p-3">{offer.name}</td>
                                <td className="p-3">{offer.description}</td>
                                <td className="p-3">{Number(offer.price).toFixed(2)}</td>
                                <td className="p-3">
                                    <button
                                        onClick={() => setEditingOffer(offer)}
                                        className="text-blue-500 hover:underline mr-4"
                                    >
                                        Modifier
                                    </button>
                                    <button
                                        onClick={() => handleDeleteOffer(offer.id)}
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
                {editingOffer && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <div className="bg-white p-6 rounded-lg w-full max-w-md">
                            <h3 className="text-xl font-semibold mb-4">Modifier l’Offre VIP</h3>
                            <input
                                type="text"
                                value={editingOffer.name}
                                onChange={(e) => setEditingOffer({ ...editingOffer, name: e.target.value })}
                                className="p-3 border rounded-lg w-full mb-4"
                            />
                            <input
                                type="text"
                                value={editingOffer.description}
                                onChange={(e) => setEditingOffer({ ...editingOffer, description: e.target.value })}
                                className="p-3 border rounded-lg w-full mb-4"
                            />
                            <input
                                type="number"
                                value={editingOffer.price}
                                onChange={(e) => setEditingOffer({ ...editingOffer, price: e.target.value })}
                                className="p-3 border rounded-lg w-full mb-4"
                            />
                            <input
                                type="file"
                                accept="image/jpeg,image/png"
                                onChange={(e) => setEditingOffer({ ...editingOffer, image: e.target.files[0] })}
                                className="p-3 border rounded-lg w-full mb-4"
                            />
                            {editingOffer.image && typeof editingOffer.image === 'string' && (
                                <img
                                    src={`http://localhost:5000/${editingOffer.image}`}
                                    alt={editingOffer.name}
                                    className="h-16 w-16 object-cover rounded mb-4"
                                />
                            )}
                            <div className="flex justify-end space-x-4">
                                <button
                                    onClick={() => setEditingOffer(null)}
                                    className="btn bg-gray-300 hover:bg-gray-400"
                                >
                                    Annuler
                                </button>
                                <button
                                    onClick={() => handleEditOffer(editingOffer)}
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

export default VipOffersManagement;