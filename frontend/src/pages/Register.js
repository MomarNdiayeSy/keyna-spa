import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import authService from '../services/authService';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await authService.register(formData);
            await login(formData.email, formData.password);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.error || 'Erreur lors de l’inscription');
            console.error('Erreur d’inscription:', err);
        }
    };

    return (
        <section className="section bg-gray-50 min-h-screen flex items-center justify-center">
            <div className="container mx-auto px-4">
                <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
                    <h2 className="text-3xl font-serif font-bold mb-6 text-center">Inscription</h2>
                    {error && <p className="text-red-500 mb-4">{error}</p>}
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label htmlFor="name" className="block text-sm font-medium mb-2">
                                Nom
                            </label>
                            <input
                                type="text"
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full p-3 border rounded-lg"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-sm font-medium mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full p-3 border rounded-lg"
                                required
                            />
                        </div>
                        <div className="mb-6">
                            <label htmlFor="password" className="block text-sm font-medium mb-2">
                                Mot de passe
                            </label>
                            <input
                                type="password"
                                id="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="w-full p-3 border rounded-lg"
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary w-full">
                            S’inscrire
                        </button>
                    </form>
                    <p className="mt-4 text-center">
                        Déjà un compte ?{' '}
                        <a href="/login" className="text-primary hover:underline">
                            Se connecter
                        </a>
                    </p>
                </div>
            </div>
        </section>
    );
};

export default Register;