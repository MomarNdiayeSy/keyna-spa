const pool = require('../config/db');

// Récupérer les offres VIP
exports.getVipOffers = async (req, res) => {
    try {
        const offers = await pool.query('SELECT * FROM vip_offers');
        // Convertir les prix en nombres
        const formattedOffers = offers.rows.map((offer) => ({
            ...offer,
            price: parseFloat(offer.price),
        }));
        res.json(formattedOffers);
    } catch (error) {
        console.error('Erreur lors de la récupération des offres VIP:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};