import React, { useState, useEffect } from 'react';
import { pricingService } from '../services/pricingService';
import { TrashIcon, PencilIcon } from '@heroicons/react/24/outline';

const PricingManagement = () => {
    const [pricingData, setPricingData] = useState({ services: [], formulas: [] });
    const [serviceForm, setServiceForm] = useState({
        type: 'service',
        category: '',
        name: '',
        duration: '',
        description: '',
        price_solo: '',
    });
    const [formulaForm, setFormulaForm] = useState({
        type: 'formula',
        name: '',
        description: '',
        price_solo: '',
        price_duo: '',
        price_package: '',
        included_services: '',
    });
    const [editingId, setEditingId] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchPricing();
    }, []);

    const fetchPricing = async () => {
        try {
            const data = await pricingService.getPricing();
            setPricingData(data);
        } catch (error) {
            setError('Erreur lors de la récupération des tarifs.');
            console.error(error);
        }
    };

    const handleServiceSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                type: 'service',
                category: serviceForm.category,
                name: serviceForm.name,
                duration: parseInt(serviceForm.duration) || null,
                description: serviceForm.description,
                price_solo: serviceForm.price_solo,
                price_duo: null,
                price_package: null,
                included_services: null,
            };
            if (editingId) {
                await pricingService.updatePricing(editingId, payload);
            } else {
                await pricingService.createPricing(payload);
            }
            fetchPricing();
            resetServiceForm();
        } catch (error) {
            setError('Erreur lors de la sauvegarde du service.');
            console.error(error);
        }
    };

    const handleFormulaSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                type: 'formula',
                category: null,
                name: formulaForm.name,
                duration: null,
                description: formulaForm.description,
                price_solo: formulaForm.price_solo,
                price_duo: formulaForm.price_duo || null,
                price_package: formulaForm.price_package || null,
                included_services: formulaForm.included_services,
            };
            if (editingId) {
                await pricingService.updatePricing(editingId, payload);
            } else {
                await pricingService.createPricing(payload);
            }
            fetchPricing();
            resetFormulaForm();
        } catch (error) {
            setError('Erreur lors de la sauvegarde de la formule.');
            console.error(error);
        }
    };

    const handleEdit = (item) => {
        setEditingId(item.id);
        if (item.type === 'service') {
            setServiceForm({
                type: 'service',
                category: item.category || '',
                name: item.name,
                duration: item.duration || '',
                description: item.description || '',
                price_solo: item.price_solo || '',
            });
        } else {
            setFormulaForm({
                type: 'formula',
                name: item.name,
                description: item.description || '',
                price_solo: item.price_solo || '',
                price_duo: item.price_duo || '',
                price_package: item.price_package || '',
                included_services: item.included_services || '',
            });
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Confirmer la suppression ?')) return;
        try {
            await pricingService.deletePricing(id);
            fetchPricing();
        } catch (error) {
            setError('Erreur lors de la suppression.');
            console.error(error);
        }
    };

    const resetServiceForm = () => {
        setServiceForm({ type: 'service', category: '', name: '', duration: '', description: '', price_solo: '' });
        setEditingId(null);
    };

    const resetFormulaForm = () => {
        setFormulaForm({ type: 'formula', name: '', description: '', price_solo: '', price_duo: '', price_package: '', included_services: '' });
        setEditingId(null);
    };

    return (
        <section className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-gray-800 mb-8">Gestion de la Grille Tarifaire</h2>
                {error && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
                        {error}
                    </div>
                )}
                <div className="space-y-12">
                    {/* Gestion des services */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h3 className="text-xl font-semibold mb-4">
                                {editingId && serviceForm.type === 'service' ? 'Modifier le Service' : 'Créer un Service'}
                            </h3>
                            <form onSubmit={handleServiceSubmit}>
                                <div className="mb-4">
                                    <label className="block text-gray-700">Catégorie</label>
                                    <input
                                        type="text"
                                        value={serviceForm.category}
                                        onChange={(e) => setServiceForm({ ...serviceForm, category: e.target.value })}
                                        className="w-full border rounded p-2"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700">Nom</label>
                                    <input
                                        type="text"
                                        value={serviceForm.name}
                                        onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })}
                                        className="w-full border rounded p-2"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700">Durée (minutes)</label>
                                    <input
                                        type="number"
                                        value={serviceForm.duration}
                                        onChange={(e) => setServiceForm({ ...serviceForm, duration: e.target.value })}
                                        className="w-full border rounded p-2"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700">Description</label>
                                    <textarea
                                        value={serviceForm.description}
                                        onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                                        className="w-full border rounded p-2"
                                        rows="4"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700">Prix (FCFA)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={serviceForm.price_solo}
                                        onChange={(e) => setServiceForm({ ...serviceForm, price_solo: e.target.value })}
                                        className="w-full border rounded p-2"
                                        required
                                    />
                                </div>
                                <div className="flex justify-end space-x-4">
                                    <button
                                        type="button"
                                        onClick={resetServiceForm}
                                        className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark"
                                    >
                                        {editingId && serviceForm.type === 'service' ? 'Mettre à jour' : 'Créer'}
                                    </button>
                                </div>
                            </form>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h3 className="text-xl font-semibold mb-4">Liste des Services</h3>
                            {pricingData.services.length === 0 ? (
                                <p className="text-gray-600">Aucun service disponible.</p>
                            ) : (
                                <div className="space-y-4">
                                    {pricingData.services.map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex justify-between items-center p-4 border rounded"
                                        >
                                            <div>
                                                <p className="font-semibold">{item.name}</p>
                                                <p className="text-gray-600 text-sm">{item.category}</p>
                                                {item.duration && (
                                                    <p className="text-gray-600 text-sm">Durée : {item.duration} min</p>
                                                )}
                                                {item.description && (
                                                    <p className="text-gray-600 text-sm">{item.description}</p>
                                                )}
                                                <p className="text-primary font-semibold">{parseFloat(item.price_solo).toFixed(2)} FCFA</p>
                                            </div>
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => handleEdit(item)}
                                                    className="p-2 bg-blue-100 rounded hover:bg-blue-200"
                                                >
                                                    <PencilIcon className="w-5 h-5 text-blue-600" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(item.id)}
                                                    className="p-2 bg-red-100 rounded hover:bg-red-200"
                                                >
                                                    <TrashIcon className="w-5 h-5 text-red-600" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                    {/* Gestion des formules */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h3 className="text-xl font-semibold mb-4">
                                {editingId && formulaForm.type === 'formula' ? 'Modifier la Formule' : 'Créer une Formule'}
                            </h3>
                            <form onSubmit={handleFormulaSubmit}>
                                <div className="mb-4">
                                    <label className="block text-gray-700">Nom</label>
                                    <input
                                        type="text"
                                        value={formulaForm.name}
                                        onChange={(e) => setFormulaForm({ ...formulaForm, name: e.target.value })}
                                        className="w-full border rounded p-2"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700">Description</label>
                                    <textarea
                                        value={formulaForm.description}
                                        onChange={(e) => setFormulaForm({ ...formulaForm, description: e.target.value })}
                                        className="w-full border rounded p-2"
                                        rows="4"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700">Prix Solo (FCFA)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={formulaForm.price_solo}
                                        onChange={(e) => setFormulaForm({ ...formulaForm, price_solo: e.target.value })}
                                        className="w-full border rounded p-2"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700">Prix Duo (FCFA, optionnel)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={formulaForm.price_duo}
                                        onChange={(e) => setFormulaForm({ ...formulaForm, price_duo: e.target.value })}
                                        className="w-full border rounded p-2"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700">Prix Forfait (FCFA, optionnel)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={formulaForm.price_package}
                                        onChange={(e) => setFormulaForm({ ...formulaForm, price_package: e.target.value })}
                                        className="w-full border rounded p-2"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700">Services inclus (séparés par des virgules)</label>
                                    <textarea
                                        value={formulaForm.included_services}
                                        onChange={(e) => setFormulaForm({ ...formulaForm, included_services: e.target.value })}
                                        className="w-full border rounded p-2"
                                        rows="4"
                                        placeholder="Ex. : Accès Spa, Gommage, Massage 30 min"
                                    />
                                </div>
                                <div className="flex justify-end space-x-4">
                                    <button
                                        type="button"
                                        onClick={resetFormulaForm}
                                        className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark"
                                    >
                                        {editingId && formulaForm.type === 'formula' ? 'Mettre à jour' : 'Créer'}
                                    </button>
                                </div>
                            </form>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h3 className="text-xl font-semibold mb-4">Liste des Formules</h3>
                            {pricingData.formulas.length === 0 ? (
                                <p className="text-gray-600">Aucune formule disponible.</p>
                            ) : (
                                <div className="space-y-4">
                                    {pricingData.formulas.map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex justify-between items-center p-4 border rounded"
                                        >
                                            <div>
                                                <p className="font-semibold">{item.name}</p>
                                                {item.description && (
                                                    <p className="text-gray-600 text-sm">{item.description}</p>
                                                )}
                                                {item.included_services && (
                                                    <p className="text-gray-600 text-sm">Inclut : {item.included_services}</p>
                                                )}
                                                <p className="text-primary font-semibold">
                                                    Solo : {parseFloat(item.price_solo).toFixed(2)} FCFA
                                                    {item.price_duo && ` | Duo : ${parseFloat(item.price_duo).toFixed(2)} FCFA`}
                                                    {item.price_package && ` | Forfait : ${parseFloat(item.price_package).toFixed(2)} FCFA`}
                                                </p>
                                            </div>
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => handleEdit(item)}
                                                    className="p-2 bg-blue-100 rounded hover:bg-blue-200"
                                                >
                                                    <PencilIcon className="w-5 h-5 text-blue-600" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(item.id)}
                                                    className="p-2 bg-red-100 rounded hover:bg-red-200"
                                                >
                                                    <TrashIcon className="w-5 h-5 text-red-600" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PricingManagement;