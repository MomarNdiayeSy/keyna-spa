import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getHistory } from '../services/historyService';

const History = () => {
  const [bookings, setBookings] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('bookings'); // New state for active tab
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }
        const { bookings, orders } = await getHistory();
        setBookings(bookings);
        setOrders(orders);
        setLoading(false);
      } catch (error) {
        console.error('Erreur lors de la récupération de l’historique:', {
          message: error.message,
          response: error.response ? {
            status: error.response.status,
            data: error.response.data,
          } : null,
        });
        setError(error.response?.data?.error || 'Impossible de charger l’historique.');
        setLoading(false);
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      }
    };
    fetchHistory();
  }, [navigate]);

  if (loading) {
    return (
      <section className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Historique</h2>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Historique</h2>
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
            {error}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Historique</h2>
        <p className="text-gray-600 mb-8">Consultez vos réservations et commandes passées.</p>

        {/* Tabs Menu */}
        <div className="mb-8">
          <div className="flex border-b border-gray-200">
            <button
              className={`px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                activeTab === 'bookings'
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-gray-600 hover:text-primary'
              }`}
              onClick={() => setActiveTab('bookings')}
            >
              Réservations
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                activeTab === 'orders'
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-gray-600 hover:text-primary'
              }`}
              onClick={() => setActiveTab('orders')}
            >
              Commandes
            </button>
          </div>
        </div>

        {/* Content Based on Active Tab */}
        {activeTab === 'bookings' && (
          <div>
            {bookings.length === 0 ? (
              <div className="bg-white p-8 rounded-lg shadow-md text-center">
                <p className="text-gray-600 text-lg">Vous n’avez aucune réservation pour le moment.</p>
                <button
                  onClick={() => navigate('/booking')}
                  className="mt-4 rounded-full bg-blue-800 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600"
                  title="Réserver un service"
                >
                  Réserver un service
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {bookings.map((booking) => (
                  <div key={booking.id} className="bg-white rounded-lg p-4 shadow-md">
                    <div className="mb-4 flex items-center justify-between">
                      <h4 className="text-gray-900 text-lg font-semibold">
                        Réservation #{booking.id}
                      </h4>
                      <span
                        className={`text-sm font-semibold ${
                          booking.status === 'confirmed' ? 'text-green-600' : 'text-yellow-600'
                        }`}
                      >
                        {booking.status === 'confirmed' ? 'Confirmée' : 'En attente'}
                      </span>
                    </div>
                    <p className="mb-2 text-gray-600">
                      Tarif: {booking.tariff_name || 'Non spécifié'}
                    </p>
                    <p className="mb-2 text-gray-600">
                      Date: {new Date(booking.date_time).toLocaleString()}
                    </p>
                    <p className="mb-2 text-gray-600">
                      Client: {booking.customer_name} ({booking.customer_email})
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'orders' && (
          <div>
            {orders.length === 0 ? (
              <div className="bg-white p-8 rounded-lg shadow-md text-center">
                <p className="text-gray-600 text-lg">Vous n’avez aucune commande pour le moment.</p>
                <button
                  onClick={() => navigate('/shop')}
                  className="mt-4 inline-block bg-primary text-white px-6 py-2 rounded-full hover:bg-primary-dark transition"
                >
                  Découvrir nos produits
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => (
                  <div key={order.id} className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-xl font-semibold text-gray-800">
                        Commande #{order.id}
                      </h4>
                      <span
                        className={`text-sm font-medium ${
                          order.status === 'paid' ? 'text-green-600' : 'text-yellow-600'
                        }`}
                      >
                        {order.status === 'paid' ? 'Payée' : 'En attente'}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-2">
                      Date: {new Date(order.created_at).toLocaleDateString()}
                    </p>
                    <div className="mb-4">
                      <h5 className="text-gray-800 font-medium">Articles:</h5>
                      <ul className="list-disc pl-5 text-gray-600">
                        {order.items.map((item) => (
                          <li key={item.id}>
                            {item.product_name} x {item.quantity} -{' '}
                            {(parseFloat(item.price) * item.quantity).toFixed(2)} €
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex justify-between font-semibold text-gray-800">
                      <span>Total</span>
                      <span>{parseFloat(order.total_amount).toFixed(2)} €</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default History;