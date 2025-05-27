const pool = require('../config/db');

// Récupérer toutes les réservations (admin uniquement)
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await pool.query(`
      SELECT 
        b.*,
        s.name AS service_name,
        t.name AS tariff_name
      FROM bookings b
      LEFT JOIN tariffs t ON b.tariff_id = t.id
      LEFT JOIN services s ON t.service_id = s.id
    `);
    res.json(bookings.rows);
  } catch (error) {
    console.error('Erreur lors de la récupération des réservations:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// Créer une réservation
exports.createBooking = async (req, res) => {
  const { tariff_id, date_time, customer_name, customer_email, customer_phone, user_id, discount_code } = req.body;

  try {
    const discountQuery = discount_code 
      ? await pool.query('SELECT amount FROM discounts WHERE code = $1 AND valid_until >= CURRENT_DATE', [discount_code])
      : { rows: [] };
    
    const discountAmount = discountQuery.rows[0]?.amount || 0;

    const newBooking = await pool.query(
      'INSERT INTO bookings (tariff_id, date_time, customer_name, customer_email, customer_phone, user_id, status, discount_amount, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, CURRENT_TIMESTAMP) RETURNING *',
      [tariff_id, date_time, customer_name, customer_email, customer_phone || null, user_id || null, 'pending', discountAmount]
    );

    res.status(201).json(newBooking.rows[0]);
  } catch (error) {
    console.error('Erreur lors de la création de la réservation:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// Modifier une réservation (admin uniquement)
exports.updateBooking = async (req, res) => {
  const { id } = req.params;
  const { tariff_id, date_time, customer_name, customer_email, customer_phone, user_id, status } = req.body;

  try {
    const updatedBooking = await pool.query(
      'UPDATE bookings SET tariff_id = $1, date_time = $2, customer_name = $3, customer_email = $4, customer_phone = $5, user_id = $6, status = $7 WHERE id = $8 RETURNING *',
      [tariff_id, date_time, customer_name, customer_email, customer_phone || null, user_id || null, status || 'pending', id]
    );
    if (updatedBooking.rows.length === 0) {
      return res.status(404).json({ error: 'Réservation non trouvée' });
    }
    res.json(updatedBooking.rows[0]);
  } catch (error) {
    console.error('Erreur lors de la modification de la réservation:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// Supprimer une réservation (admin uniquement)
exports.deleteBooking = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedBooking = await pool.query('DELETE FROM bookings WHERE id = $1 RETURNING *', [id]);
    if (deletedBooking.rows.length === 0) {
      return res.status(404).json({ error: 'Réservation non trouvée' });
    }
    res.json({ message: 'Réservation supprimée' });
  } catch (error) {
    console.error('Erreur lors de la suppression de la réservation:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};