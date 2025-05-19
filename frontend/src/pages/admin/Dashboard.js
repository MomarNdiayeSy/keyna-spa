import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const Dashboard = () => {
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

    return (
        <section className="section bg-gray-50 min-h-screen py-12">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-serif font-bold mb-8 text-center">
                    Tableau de bord Admin
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <a
                        href="/admin/services"
                        className="bg-white p-6 rounded-lg shadow-md text-center hover:bg-gray-100"
                    >
                        <h3 className="text-xl font-semibold mb-2">Gérer les Services</h3>
                        <p>Ajouter, modifier ou supprimer des services.</p>
                    </a>
                    <a
                        href="/admin/products"
                        className="bg-white p-6 rounded-lg shadow-md text-center hover:bg-gray-100"
                    >
                        <h3 className="text-xl font-semibold mb-2">Gérer les Produits</h3>
                        <p>Ajouter, modifier ou supprimer des produits.</p>
                    </a>
                    <a
                        href="/admin/bookings"
                        className="bg-white p-6 rounded-lg shadow-md text-center hover:bg-gray-100"
                    >
                        <h3 className="text-xl font-semibold mb-2">Gérer les Réservations</h3>
                        <p>Voir et gérer les réservations des clients.</p>
                    </a>
                    <a
                        href="/admin/users"
                        className="bg-white p-6 rounded-lg shadow-md text-center hover:bg-gray-100"
                    >
                        <h3 className="text-xl font-semibold mb-2">Gérer les Utilisateurs</h3>
                        <p>Gérer les comptes des utilisateurs.</p>
                    </a>
                    <a
                        href="/admin/statistics"
                        className="bg-white p-6 rounded-lg shadow-md text-center hover:bg-gray-100"
                    >
                        <h3 className="text-xl font-semibold mb-2">Statistiques</h3>
                        <p>Voir les statistiques du spa.</p>
                    </a>
                    <a
                        href="/admin/vip"
                        className="bg-white p-6 rounded-lg shadow-md text-center hover:bg-gray-100"
                    >
                        <h3 className="text-xl font-semibold mb-2">Gérer les Offres VIP</h3>
                        <p>Ajouter, modifier ou supprimer des offres VIP.</p>
                    </a>
                </div>
            </div>
        </section>
    );
};

export default Dashboard;