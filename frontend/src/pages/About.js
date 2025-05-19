import React from 'react';
import { Link } from 'react-router-dom';
import { FiUsers, FiAward } from 'react-icons/fi';
import aboutImage from '../assets/hero-bg.jpg';

const About = () => {
    return (
        <section className="section bg-white">
            <div className="container">
                <h2 className="section-title">À Propos de KEYNA SPA</h2>
                <p className="section-subtitle">
                    Découvrez l’histoire, la mission et les valeurs qui font de KEYNA SPA une référence dans le bien-être de luxe.
                </p>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-12 items-center">
                    {/* Texte */}
                    <div>
                        <h3 className="text-2xl font-serif font-semibold text-gray-800 mb-4">Notre Histoire</h3>
                        <p className="text-gray-600 mb-4">
                            Fondé en 2012, KEYNA SPA est né d’une passion pour le bien-être et l’élégance. Notre objectif était de créer un havre de paix où chaque client pourrait se ressourcer et retrouver l’harmonie intérieure.
                        </p>
                        <p className="text-gray-600 mb-6">
                            Aujourd’hui, nous sommes fiers d’être une référence dans le domaine du spa de luxe, grâce à notre engagement envers l’excellence et l’innovation.
                        </p>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white">
                                    <FiUsers size={20} />
                                </div>
                                <div>
                                    <h4 className="font-medium">Équipe Qualifiée</h4>
                                    <p className="text-sm text-gray-600">Professionnels certifiés</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white">
                                    <FiAward size={20} />
                                </div>
                                <div>
                                    <h4 className="font-medium">Produits Premium</h4>
                                    <p className="text-sm text-gray-600">Naturels et durables</p>
                                </div>
                            </div>
                        </div>

                        <Link to="/contact" className="btn btn-primary mt-8 inline-block">
                            Nous Contacter
                        </Link>
                    </div>

                    {/* Image */}
                    <div>
                        <div className="rounded-xl overflow-hidden">
                            <img
                                src={aboutImage}
                                alt="KEYNA SPA"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;