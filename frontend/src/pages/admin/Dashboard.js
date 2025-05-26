import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import {
  FiBriefcase,
  FiPackage,
  FiCalendar,
  FiUsers,
  FiBarChart2,
  FiStar,
  FiTag,
  FiDollarSign,
  FiClock,
} from 'react-icons/fi';

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
    <section className="section bg-neutral min-h-screen py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-serif font-bold mb-12 text-center text-neutral-dark">
          Tableau de bord Admin
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <Link
            to="/admin/services"
            className="bg-white p-6 rounded-xl shadow-soft text-center hover:bg-primary/5 hover:scale-105 transition-all duration-300"
          >
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <FiBriefcase className="text-2xl text-primary" />
              </div>
            </div>
            <h3 className="text-xl font-sans font-semibold mb-2 text-neutral-dark">
              Gérer les Services
            </h3>
            <p className="text-sm text-neutral-dark/80">
              Ajouter, modifier ou supprimer des services.
            </p>
          </Link>
          <Link
            to="/admin/products"
            className="bg-white p-6 rounded-xl shadow-soft text-center hover:bg-primary/5 hover:scale-105 transition-all duration-300"
          >
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <FiPackage className="text-2xl text-primary" />
              </div>
            </div>
            <h3 className="text-xl font-sans font-semibold mb-2 text-neutral-dark">
              Gérer les Produits
            </h3>
            <p className="text-sm text-neutral-dark/80">
              Ajouter, modifier ou supprimer des produits.
            </p>
          </Link>
          <Link
            to="/admin/bookings"
            className="bg-white p-6 rounded-xl shadow-soft text-center hover:bg-primary/5 hover:scale-105 transition-all duration-300"
          >
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <FiCalendar className="text-2xl text-primary" />
              </div>
            </div>
            <h3 className="text-xl font-sans font-semibold mb-2 text-neutral-dark">
              Gérer les Réservations
            </h3>
            <p className="text-sm text-neutral-dark/80">
              Voir et gérer les réservations des clients.
            </p>
          </Link>
          <Link
            to="/admin/users"
            className="bg-white p-6 rounded-xl shadow-soft text-center hover:bg-primary/5 hover:scale-105 transition-all duration-300"
          >
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <FiUsers className="text-2xl text-primary" />
              </div>
            </div>
            <h3 className="text-xl font-sans font-semibold mb-2 text-neutral-dark">
              Gérer les Utilisateurs
            </h3>
            <p className="text-sm text-neutral-dark/80">
              Gérer les comptes des utilisateurs.
            </p>
          </Link>
          <Link
            to="/admin/statistics"
            className="bg-white p-6 rounded-xl shadow-soft text-center hover:bg-primary/5 hover:scale-105 transition-all duration-300"
          >
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <FiBarChart2 className="text-2xl text-primary" />
              </div>
            </div>
            <h3 className="text-xl font-sans font-semibold mb-2 text-neutral-dark">
              Statistiques
            </h3>
            <p className="text-sm text-neutral-dark/80">Voir les statistiques du spa.</p>
          </Link>
          <Link
            to="/admin/vip"
            className="bg-white p-6 rounded-xl shadow-soft text-center hover:bg-primary/5 hover:scale-105 transition-all duration-300"
          >
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <FiStar className="text-2xl text-primary" />
              </div>
            </div>
            <h3 className="text-xl font-sans font-semibold mb-2 text-neutral-dark">
              Gérer les Offres VIP
            </h3>
            <p className="text-sm text-neutral-dark/80">
              Ajouter, modifier ou supprimer des offres VIP.
            </p>
          </Link>
          <Link
            to="/admin/discounts"
            className="bg-white p-6 rounded-xl shadow-soft text-center hover:bg-primary/5 hover:scale-105 transition-all duration-300"
          >
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <FiTag className="text-2xl text-primary" />
              </div>
            </div>
            <h3 className="text-xl font-sans font-semibold mb-2 text-neutral-dark">
              Gérer les Codes Promo
            </h3>
            <p className="text-sm text-neutral-dark/80">
              Créer et gérer les codes promotionnels.
            </p>
          </Link>
          <Link
            to="/admin/pricing"
            className="bg-white p-6 rounded-xl shadow-soft text-center hover:bg-primary/5 hover:scale-105 transition-all duration-300"
          >
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <FiDollarSign className="text-2xl text-primary" />
              </div>
            </div>
            <h3 className="text-xl font-sans font-semibold mb-2 text-neutral-dark">
              Gérer la Grille Tarifaire
            </h3>
            <p className="text-sm text-neutral-dark/80">
              Configurer les tarifs des services.
            </p>
          </Link>
          <Link
            to="/admin/schedules"
            className="bg-white p-6 rounded-xl shadow-soft text-center hover:bg-primary/5 hover:scale-105 transition-all duration-300"
          >
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <FiClock className="text-2xl text-primary" />
              </div>
            </div>
            <h3 className="text-xl font-sans font-semibold mb-2 text-neutral-dark">
              Gérer les Créneaux Horaires
            </h3>
            <p className="text-sm text-neutral-dark/80">
              Ajouter, modifier ou supprimer des créneaux horaires.
            </p>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;