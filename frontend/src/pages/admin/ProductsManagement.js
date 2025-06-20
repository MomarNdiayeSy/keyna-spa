import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { jwtDecode } from 'jwt-decode';

const ProductsManagement = () => {
    const [products, setProducts] = useState([]);
    const [newProduct, setNewProduct] = useState({ name: '', description: '', price: '', image: null });
    const [editingProduct, setEditingProduct] = useState(null);
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

    // Charger les produits
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await api.get('/api/products');
                setProducts(response.data);
            } catch (err) {
                setError('Erreur lors du chargement des produits');
                console.error('Erreur fetchProducts:', err.response?.data || err.message);
            }
        };
        fetchProducts();
    }, []);

    // Ajouter un produit
    const handleAddProduct = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('name', newProduct.name);
            formData.append('description', newProduct.description);
            formData.append('price', parseFloat(newProduct.price));
            if (newProduct.image) {
                formData.append('image', newProduct.image);
            }

            const response = await api.post('/api/products', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setProducts([...products, response.data]);
            setNewProduct({ name: '', description: '', price: '', image: null });
            setError('');
        } catch (err) {
            setError(err.response?.data?.error || 'Erreur lors de l’ajout du produit');
            console.error('Erreur handleAddProduct:', err.response?.data || err.message);
        }
    };

    // Modifier un produit
    const handleEditProduct = async (product) => {
        try {
            const formData = new FormData();
            formData.append('name', product.name);
            formData.append('description', product.description);
            formData.append('price', parseFloat(product.price));
            if (product.image instanceof File) {
                formData.append('image', product.image);
            }

            const response = await api.put(`/api/products/${product.id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setProducts(products.map((p) => (p.id === product.id ? response.data : p)));
            setEditingProduct(null);
            setError('');
        } catch (err) {
            setError(err.response?.data?.error || 'Erreur lors de la modification du produit');
            console.error('Erreur handleEditProduct:', err.response?.data || err.message);
        }
    };

    // Supprimer un produit
    const handleDeleteProduct = async (id) => {
        try {
            await api.delete(`/api/products/${id}`);
            setProducts(products.filter((p) => p.id !== id));
            setError('');
        } catch (err) {
            setError(err.response?.data?.error || 'Erreur lors de la suppression du produit');
            console.error('Erreur handleDeleteProduct:', err.response?.data || err.message);
        }
    };

    return (
        <section className="section bg-gray-50 min-h-screen py-12">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-serif font-bold mb-8 text-center">Gestion des Produits</h2>

                {error && <p className="text-red-500 mb-4">{error}</p>}

                {/* Formulaire d'ajout */}
                <form onSubmit={handleAddProduct} className="mb-12 bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold mb-4">Ajouter un Produit</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            type="text"
                            placeholder="Nom"
                            value={newProduct.name}
                            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                            className="p-3 border rounded-lg w-full"
                            required
                        />
                        <input
                            type="text"
                            placeholder="Description"
                            value={newProduct.description}
                            onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                            className="p-3 border rounded-lg w-full"
                        />
                        <input
                            type="number"
                            placeholder="Prix (€)"
                            value={newProduct.price}
                            onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                            className="p-3 border rounded-lg w-full"
                            required
                        />
                        <input
                            type="file"
                            accept="image/jpeg,image/jpg,image/png"
                            onChange={(e) => setNewProduct({ ...newProduct, image: e.target.files[0] })}
                            className="p-3 border rounded-lg w-full"
                        />
                    </div>
                    <button type="submit" className="btn btn-primary mt-4">Ajouter</button>
                </form>

                {/* Liste des produits */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold mb-4">Liste des Produits</h3>
                    <table className="w-full table-auto">
                        <thead>
                        <tr className="bg-gray-100">
                            <th className="p-3 text-left">Nom</th>
                            <th className="p-3 text-left">Description</th>
                            <th className="p-3 text-left">Prix (€)</th>
                            <th className="p-3 text-left">Image</th>
                            <th className="p-3 text-left">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {products.map((product) => (
                            <tr key={product.id} className="border-b">
                                <td className="p-3">{product.name}</td>
                                <td className="p-3">{product.description}</td>
                                <td className="p-3">{Number(product.price).toFixed(2)}</td>
                                <td className="p-3">
                                    {product.image ? (
                                        <img src={`http://localhost:5000${product.image}`} alt={product.name} className="w-16 h-16 object-cover" />
                                    ) : (
                                        'Aucune image'
                                    )}
                                </td>
                                <td className="p-3">
                                    <button
                                        onClick={() => setEditingProduct(product)}
                                        className="text-blue-500 hover:underline mr-4"
                                    >
                                        Modifier
                                    </button>
                                    <button
                                        onClick={() => handleDeleteProduct(product.id)}
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
                {editingProduct && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <div className="bg-white p-6 rounded-lg w-full max-w-md">
                            <h3 className="text-xl font-semibold mb-4">Modifier le Produit</h3>
                            <input
                                type="text"
                                value={editingProduct.name}
                                onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                                className="p-3 border rounded-lg w-full mb-4"
                            />
                            <input
                                type="text"
                                value={editingProduct.description}
                                onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                                className="p-3 border rounded-lg w-full mb-4"
                            />
                            <input
                                type="number"
                                value={editingProduct.price}
                                onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
                                className="p-3 border rounded-lg w-full mb-4"
                            />
                            <input
                                type="file"
                                accept="image/jpeg,image/jpg,image/png"
                                onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.files[0] })}
                                className="p-3 border rounded-lg w-full mb-4"
                            />
                            {editingProduct.image && typeof editingProduct.image === 'string' && (
                                <img
                                    src={`http://localhost:5000${editingProduct.image}`}
                                    alt={editingProduct.name}
                                    className="w-16 h-16 object-cover mb-4"
                                />
                            )}
                            <div className="flex justify-end space-x-4">
                                <button
                                    onClick={() => setEditingProduct(null)}
                                    className="btn bg-gray-300 hover:bg-gray-400"
                                >
                                    Annuler
                                </button>
                                <button
                                    onClick={() => handleEditProduct(editingProduct)}
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

export default ProductsManagement;