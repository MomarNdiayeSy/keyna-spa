import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import authService from '../services/authService';
import { FiLoader } from 'react-icons/fi';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone_number: '',
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            await authService.register(formData);
            await login(formData.email, formData.password);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.error || 'Erreur lors de l’inscription');
            console.error('Erreur d’inscription:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className="min-h-screen flex items-center justify-center bg-white py-12 animate-fade-in">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-2xl transform transition-all duration-500 hover:shadow-lg">
                    <h2 className="text-3xl font-serif font-bold mb-6 text-center text-primary-dark">
                        Inscription
                    </h2>
                    {error && (
                        <div className="bg-red-100 border-l-4 border-red-600 text-red-700 p-4 mb-6 rounded-lg animate-slide-in">
                            {error}
                        </div>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="relative">
                            <label
                                htmlFor="name"
                                className="block text-sm font-medium text-gray-700 mb-1 transition-all duration-300"
                            >
                                Nom
                            </label>
                            <input
                                type="text"
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full p-3 border border-neutral-light rounded-lg focus:ring-2 focus:ring-accent-dark focus:border-accent-dark transition-all duration-300"
                                placeholder="Entrez votre nom"
                                required
                                disabled={isLoading}
                            />
                        </div>
                        <div className="relative">
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-700 mb-1 transition-all duration-300"
                            >
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full p-3 border border-neutral-light rounded-lg focus:ring-2 focus:ring-accent-dark focus:border-accent-dark transition-all duration-300"
                                placeholder="Entrez votre email"
                                required
                                disabled={isLoading}
                            />
                        </div>
                        <div className="relative">
                            <label
                                htmlFor="phone_number"
                                className="block text-sm font-medium text-gray-700 mb-1 transition-all duration-300"
                            >
                                Numéro de téléphone
                            </label>
                            <input
                                type="tel"
                                id="phone_number"
                                value={formData.phone_number}
                                onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                                className="w-full p-3 border border-neutral-light rounded-lg focus:ring-2 focus:ring-accent-dark focus:border-accent-dark transition-all duration-300"
                                placeholder="+33 1 23 45 67 89"
                                disabled={isLoading}
                            />
                        </div>
                        <div className="relative">
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-gray-700 mb-1 transition-all duration-300"
                            >
                                Mot de passe
                            </label>
                            <input
                                type="password"
                                id="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="w-full p-3 border border-neutral-light rounded-lg focus:ring-2 focus:ring-accent-dark focus:border-accent-dark transition-all duration-300"
                                placeholder="Entrez votre mot de passe"
                                required
                                disabled={isLoading}
                            />
                        </div>
                        <button
                            type="submit"
                            className="btn bg-accent text-white w-full py-3 rounded-lg hover:bg-accent-dark transform hover:scale-105 transition-all duration-300 flex items-center justify-center disabled:opacity-50"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <FiLoader className="animate-spin mr-2" />
                                    Inscription en cours...
                                </>
                            ) : (
                                'S’inscrire'
                            )}
                        </button>
                    </form>
                    <p className="mt-6 text-center text-neutral-dark text-sm">
                        Déjà un compte ?{' '}
                        <Link
                            to="/login"
                            className="text-primary hover:text-primary-dark font-medium hover:underline transition-colors duration-300"
                        >
                            Se connecter
                        </Link>
                    </p>
                </div>
            </div>
        </section>
    );
};

export default Register;