import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import api from '../../services/api';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Statistics = () => {
    const [stats, setStats] = useState({ users: 0, bookings: 0, services: 0, revenue: 0 });
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
            setError('Erreur de token');
            navigate('/login');
        }
    }, [navigate]);

    // Charger les statistiques
    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [usersRes, bookingsRes, servicesRes] = await Promise.all([
                    api.get('/api/users').catch((err) => {
                        console.error('Erreur GET /api/users:', err.response?.data || err.message);
                        throw err;
                    }),
                    api.get('/api/bookings').catch((err) => {
                        console.error('Erreur GET /api/bookings:', err.response?.data || err.message);
                        throw err;
                    }),
                    api.get('/api/services').catch((err) => {
                        console.error('Erreur GET /api/services:', err.response?.data || err.message);
                        throw err;
                    }),
                ]);

                const revenue = bookingsRes.data.reduce((sum, booking) => {
                    const service = servicesRes.data.find((s) => s.id === booking.service_id);
                    return sum + (service ? Number(service.price) : 0);
                }, 0);

                setStats({
                    users: usersRes.data.length,
                    bookings: bookingsRes.data.length,
                    services: servicesRes.data.length,
                    revenue,
                });
            } catch (err) {
                setError('Erreur lors du chargement des statistiques');
                console.error('Erreur fetchStats:', err.response?.data || err.message);
            }
        };
        fetchStats();
    }, []);

    // Données pour le graphique
    const chartData = {
        labels: ['Utilisateurs', 'Réservations', 'Services'],
        datasets: [
            {
                label: 'Statistiques',
                data: [stats.users, stats.bookings, stats.services],
                backgroundColor: '#1e3a8a',
            },
        ],
    };

    return (
        <section className="section bg-gray-50 min-h-screen py-12">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-serif font-bold mb-8 text-center">Statistiques</h2>

                {error && <p className="text-red-500 mb-4">{error}</p>}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-xl font-semibold mb-4">Aperçu Général</h3>
                        <Bar data={chartData} />
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-xl font-semibold mb-4">Détails</h3>
                        <p>Utilisateurs : {stats.users}</p>
                        <p>Réservations : {stats.bookings}</p>
                        <p>Services : {stats.services}</p>
                        <p>Revenus : {stats.revenue.toFixed(2)} €</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Statistics;