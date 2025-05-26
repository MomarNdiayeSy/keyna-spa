const pool = require('../config/db');

exports.getHistory = async (req, res) => {
  const userId = req.user?.userId;

  if (!userId) {
    return res.status(401).json({ error: 'Utilisateur non authentifié.' });
  }

  try {
    // Récupérer les réservations
    const bookings = await pool.query(
      `SELECT b.*, s.name as service_name
       FROM bookings b
       JOIN services s ON b.service_id = s.id
       WHERE b.user_id = $1
       ORDER BY b.created_at DESC`,
      [userId]
    );

    // Récupérer les commandes avec leurs articles
    const orders = await pool.query(
      `SELECT o.*, oi.id as item_id, oi.quantity, oi.price, p.name as product_name
       FROM orders o
       LEFT JOIN order_items oi ON o.id = oi.order_id
       LEFT JOIN products p ON oi.product_id = p.id
       WHERE o.user_id = $1
       ORDER BY o.created_at DESC`,
      [userId]
    );

    // Regrouper les articles par commande
    const formattedOrders = [];
    const orderMap = new Map();
    orders.rows.forEach((row) => {
      if (!orderMap.has(row.id)) {
        orderMap.set(row.id, {
          id: row.id,
          user_id: row.user_id,
          total_amount: row.total_amount,
          status: row.status,
          created_at: row.created_at,
          items: [],
        });
      }
      if (row.item_id) {
        orderMap.get(row.id).items.push({
          id: row.item_id,
          product_name: row.product_name,
          quantity: row.quantity,
          price: row.price,
        });
      }
    });
    orderMap.forEach((value) => formattedOrders.push(value));

    res.json({
      bookings: bookings.rows,
      orders: formattedOrders,
    });
  } catch (error) {
    console.error('Erreur lors de la récupération de l’historique:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};