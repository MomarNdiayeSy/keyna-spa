const pool = require('../config/db');

// Récupérer les statistiques globales
exports.getStatistics = async (req, res) => {
    try {
        // Récupérer les données en parallèle
        const [usersResult, bookingsResult, servicesResult] = await Promise.all([
            pool.query('SELECT COUNT(*) FROM users'),
            pool.query('SELECT * FROM bookings'),
            pool.query('SELECT * FROM services'),
        ]);

        // Calculer les revenus
        const bookings = bookingsResult.rows;
        const services = servicesResult.rows.map((service) => ({
            ...service,
            price: parseFloat(service.price),
        }));
        const revenue = bookings.reduce((sum, booking) => {
            const service = services.find((s) => s.id === booking.service_id);
            return sum + (service ? service.price : 0);
        }, 0);

        // Préparer les statistiques
        const stats = {
            users: parseInt(usersResult.rows[0].count),
            bookings: bookings.length,
            services: services.length,
            revenue,
        };

        res.json(stats);
    } catch (error) {
        console.error('Erreur lors de la récupération des statistiques:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};