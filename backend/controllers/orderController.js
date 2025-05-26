const pool = require('../config/db');

exports.getOrders = async (req, res) => {
    const userId = req.user?.userId;
    if (!userId) {
        return res.status(401).json({ error: 'Utilisateur non authentifié.' });
    }

    try {
        const orders = await pool.query(
            'SELECT o.*, array_agg(json_build_object(' +
            '\'id\', oi.id, \'name\', p.name, \'quantity\', oi.quantity, \'price\', oi.price)) as items ' +
            'FROM orders o ' +
            'LEFT JOIN order_items oi ON o.id = oi.order_id ' +
            'LEFT JOIN products p ON oi.product_id = p.id ' +
            'WHERE o.user_id = $1 ' +
            'GROUP BY o.id',
            [userId]
        );
        res.json(orders.rows);
    } catch (error) {
        console.error('Erreur lors de la récupération des commandes:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};