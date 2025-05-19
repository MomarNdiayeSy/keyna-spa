import React from 'react';
import { FiMapPin, FiPhone, FiMail } from 'react-icons/fi';

const Contact = () => {
    return (
        <section className="section bg-gray-50">
            <div className="container">
                <h2 className="section-title">Nous Contacter</h2>
                <p className="section-subtitle">
                    Vous avez une question ou souhaitez réserver un soin ? Contactez-nous via le formulaire ci-dessous ou utilisez nos coordonnées.
                </p>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-12">
                    {/* Formulaire */}
                    <div className="card p-8">
                        <form className="space-y-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                    Nom
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                    placeholder="Votre nom"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                    placeholder="Votre email"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                                    Message
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    rows="5"
                                    className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                    placeholder="Votre message"
                                    required
                                ></textarea>
                            </div>
                            <button type="submit" className="btn btn-primary w-full">
                                Envoyer
                            </button>
                        </form>
                    </div>

                    {/* Informations de contact */}
                    <div className="space-y-8">
                        <h3 className="text-2xl font-serif font-semibold text-gray-800">Nos Coordonnées</h3>
                        <div className="space-y-6">
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white">
                                    <FiMapPin size={20} />
                                </div>
                                <div>
                                    <h4 className="font-medium">Adresse</h4>
                                    <p className="text-gray-600">123 Rue du Spa, Ville, France</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white">
                                    <FiPhone size={20} />
                                </div>
                                <div>
                                    <h4 className="font-medium">Téléphone</h4>
                                    <p className="text-gray-600">+33 1 23 45 67 89</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white">
                                    <FiMail size={20} />
                                </div>
                                <div>
                                    <h4 className="font-medium">Email</h4>
                                    <p className="text-gray-600">contact@keynaspa.com</p>
                                </div>
                                <p className="text-gray-600">contact@keynaspa.com</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Contact;