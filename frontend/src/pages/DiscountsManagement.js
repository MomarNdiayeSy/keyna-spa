import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const DiscountsManagement = () => {
    const [discounts, setDiscounts] = useState([]);
    const [newDiscount, setNewDiscount] = useState({
        code: '',
        amount: '',
        type: 'percentage',
        valid_until: '',
        is_active: true,
        max_uses: '',
    });
    const [editingDiscount, setEditingDiscount] = useState(null);
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
        const initializeDiscounts = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:5000/api/discounts', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setDiscounts(response.data);
                if (!response.data.find((d) => d.code === 'FIRST15')) {
                    await axios.post(
                        'http://localhost:5000/api/discounts',
                        {
                            code: 'FIRST15',
                            amount: 15,
                            type: 'percentage',
                            valid_until: '2025-05-30',
                            is_active: true,
                        },
                        {
                            headers: { Authorization: `Bearer ${token}` },
                        }
                    );
                    fetchDiscounts();
                }
            } catch (err) {
                setError('Erreur lors de la récupération des codes promo.');
                console.error('Erreur:', err);
            }
        };
        initializeDiscounts();
    }, []);

    const fetchDiscounts = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/discounts', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            setDiscounts(response.data);
            setError('');
        } catch (err) {
            setError(err.response?.data?.error || 'Erreur lors de la récupération des codes promo.');
            console.error('Erreur:', err);
        }
    };

    const handleAddDiscount = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/discounts', newDiscount, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            setDiscounts([...discounts, response.data]);
            setNewDiscount({
                code: '',
                amount: '',
                type: 'percentage',
                valid_until: '',
                is_active: true,
                max_uses: '',
            });
            setError('');
        } catch (err) {
            setError(err.response?.data?.error || 'Erreur lors de l’ajout du code promo.');
            console.error('Erreur:', err);
        }
    };

    const handleEditDiscount = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`http://localhost:5000/api/discounts/${editingDiscount.id}`, editingDiscount, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            setDiscounts(discounts.map((d) => (d.id === editingDiscount.id ? response.data : d)));
            setEditingDiscount(null);
            setError('');
        } catch (err) {
            setError(err.response?.data?.error || 'Erreur lors de la modification du code promo.');
            console.error('Erreur:', err);
        }
    };

    const handleDeleteDiscount = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/discounts/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            setDiscounts(discounts.filter((d) => d.id !== id));
            setError('');
        } catch (err) {
            setError(err.response?.data?.error || 'Erreur lors de la suppression du code promo.');
            console.error('Erreur:', err);
        }
    };

    return (
        <section className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-serif font-bold mb-8 text-center text-primary-dark">Gestion des Codes Promo</h2>

                {error && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-xl">
                        {error}
                    </div>
                )}

                <form onSubmit={handleAddDiscount} className="mb-12 bg-white p-6 rounded-xl shadow-soft">
                    <h3 className="text-xl font-semibold mb-4 text-primary-dark">Ajouter un Code Promo</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            type="text"
                            placeholder="Code (ex. : FIRST15)"
                            value={newDiscount.code}
                            onChange={(e) => setNewDiscount({ ...newDiscount, code: e.target.value.toUpperCase() })}
                            className="p-3 border border-neutral-light rounded-xl"
                            required
                        />
                        <input
                            type="number"
                            step="0.01"
                            placeholder="Montant (ex. : 15 pour 15%)"
                            value={newDiscount.amount}
                            onChange={(e) => setNewDiscount({ ...newDiscount, amount: e.target.value })}
                            className="p-3 border border-neutral-light rounded-xl"
                            required
                        />
                        <select
                            value={newDiscount.type}
                            onChange={(e) => setNewDiscount({ ...newDiscount, type: e.target.value })}
                            className="p-3 border border-neutral-light rounded-xl"
                        >
                            <option value="percentage">Pourcentage</option>
                            <option value="fixed">Montant fixe</option>
                        </select>
                        <input
                            type="date"
                            value={newDiscount.valid_until}
                            onChange={(e) => setNewDiscount({ ...newDiscount, valid_until: e.target.value })}
                            className="p-3 border border-neutral-light rounded-xl"
                        />
                        <input
                            type="number"
                            placeholder="Utilisations max (optionnel)"
                            value={newDiscount.max_uses}
                            onChange={(e) => setNewDiscount({ ...newDiscount, max_uses: e.target.value })}
                            className="p-3 border border-neutral-light rounded-xl"
                        />
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                checked={newDiscount.is_active}
                                onChange={(e) => setNewDiscount({ ...newDiscount, is_active: e.target.checked })}
                                className="mr-2"
                            />
                            <span className="text-sm font-semibold text-primary-dark">Actif</span>
                        </label>
                    </div>
                    <button type="submit" className="mt-4 bg-accent text-white px-6 py-2 rounded-xl hover:bg-accent-dark">
                        Ajouter
                    </button>
                </form>

                <div className="bg-white p-6 rounded-xl shadow-soft">
                    <h3 className="text-xl font-semibold mb-4 text-primary-dark">Liste des Codes Promo</h3>
                    <table className="w-full table-auto">
                        <thead>
                            <tr className="bg-neutral-light">
                                <th className="p-3 text-left">Code</th>
                                <th className="p-3 text-left">Montant</th>
                                <th className="p-3 text-left">Type</th>
                                <th className="p-3 text-left">Valide jusqu’à</th>
                                <th className="p-3 text-left">Utilisations</th>
                                <th className="p-3 text-left">Actif</th>
                                <th className="p-3 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {discounts.map((discount) => (
                                <tr key={discount.id} className="border-b">
                                    <td className="p-3">{discount.code}</td>
                                    <td className="p-3">{discount.amount}{discount.type === 'percentage' ? '%' : '€'}</td>
                                    <td className="p-3">{discount.type === 'percentage' ? 'Pourcentage' : 'Fixe'}</td>
                                    <td className="p-3">{discount.valid_until || 'N/A'}</td>
                                    <td className="p-3">{discount.current_uses || 0}/{discount.max_uses || 'Illimité'}</td>
                                    <td className="p-3">{discount.is_active ? 'Oui' : 'Non'}</td>
                                    <td className="p-3">
                                        <button
                                            onClick={() => setEditingDiscount(discount)}
                                            className="text-blue-500 hover:underline mr-4"
                                        >
                                            Modifier
                                        </button>
                                        <button
                                            onClick={() => handleDeleteDiscount(discount.id)}
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

                {editingDiscount && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <div className="bg-white p-6 rounded-xl shadow-soft w-full max-w-md">
                            <h3 className="text-lg font-semibold mb-4 text-primary-dark">Modifier le Code Promo</h3>
                            <form onSubmit={handleEditDiscount}>
                                <input
                                    type="text"
                                    value={editingDiscount.code}
                                    onChange={(e) => setEditingDiscount({ ...editingDiscount, code: e.target.value.toUpperCase() })}
                                    className="p-3 border border-neutral-light rounded-xl w-full mb-4"
                                    required
                                />
                                <input
                                    type="number"
                                    step="0.01"
                                    value={editingDiscount.amount}
                                    onChange={(e) => setEditingDiscount({ ...editingDiscount, amount: e.target.value })}
                                    className="p-3 border border-neutral-light rounded-xl w-full mb-4"
                                    required
                                />
                                <select
                                    value={editingDiscount.type}
                                    onChange={(e) => setEditingDiscount({ ...editingDiscount, type: e.target.value })}
                                    className="p-3 border border-neutral-light rounded-xl w-full mb-4"
                                >
                                    <option value="percentage">Pourcentage</option>
                                    <option value="fixed">Montant fixe</option>
                                </select>
                                <input
                                    type="date"
                                    value={editingDiscount.valid_until || ''}
                                    onChange={(e) => setEditingDiscount({ ...editingDiscount, valid_until: e.target.value })}
                                    className="p-3 border border-neutral-light rounded-xl w-full mb-4"
                                />
                                <input
                                    type="number"
                                    value={editingDiscount.max_uses || ''}
                                    onChange={(e) => setEditingDiscount({ ...editingDiscount, max_uses: e.target.value })}
                                    className="p-3 border border-neutral-light rounded-xl w-full mb-4"
                                    placeholder="Utilisations max (optionnel)"
                                />
                                <label className="flex items-center mb-4">
                                    <input
                                        type="checkbox"
                                        checked={editingDiscount.is_active}
                                        onChange={(e) => setEditingDiscount({ ...editingDiscount, is_active: e.target.checked })}
                                        className="mr-2"
                                    />
                                    <span className="text-sm font-semibold text-primary-dark">Actif</span>
                                </label>
                                <div className="flex justify-end space-x-4">
                                    <button
                                        type="button"
                                        onClick={() => setEditingDiscount(null)}
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

export default DiscountsManagement;