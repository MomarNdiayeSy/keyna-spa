const pool = require('../config/db');

// Récupérer toutes les réservations (admin uniquement)
exports.getAllBookings = async (req, res) => {
    try {
        const bookings = await pool.query('SELECT * FROM bookings');
        res.json(bookings.rows);
    } catch (error) {
        console.error('Erreur lors de la récupération des réservations:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

// Créer une réservation
exports.createBooking = async (req, res) => {
    const { service_id, booking_date, booking_time, customer_name, customer_email } = req.body;

    try {
        const newBooking = await pool.query(
            'INSERT INTO bookings (service_id, booking_date, booking_time, customer_name, customer_email, created_at) VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP) RETURNING *',
            [service_id, booking_date, booking_time, customer_name, customer_email]
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
    const { service_id, booking_date, booking_time, customer_name, customer_email } = req.body;

    try {
        const updatedBooking = await pool.query(
            'UPDATE bookings SET service_id = $1, booking_date = $2, booking_time = $3, customer_name = $4, customer_email = $5 WHERE id = $6 RETURNING *',
            [service_id, booking_date, booking_time, customer_name, customer_email, id]
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