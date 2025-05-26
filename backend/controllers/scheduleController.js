const pool = require('../config/db');

// Créer un créneau
exports.createSchedule = async (req, res) => {
    const { service_id, day, start_time, end_time } = req.body;
    try {
        const newSchedule = await pool.query(
            'INSERT INTO schedules (service_id, day, start_time, end_time, is_available, created_at) VALUES ($1, $2, $3, $4, TRUE, CURRENT_TIMESTAMP) RETURNING *',
            [service_id, day, start_time, end_time]
        );
        res.status(201).json(newSchedule.rows[0]);
    } catch (error) {
        console.error('Erreur lors de la création du créneau:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

// Récupérer tous les créneaux
exports.getAllSchedules = async (req, res) => {
    try {
        const schedules = await pool.query('SELECT * FROM schedules ORDER BY day, start_time');
        res.json(schedules.rows);
    } catch (error) {
        console.error('Erreur lors de la récupération des créneaux:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

// Récupérer les créneaux disponibles
exports.getAvailableSchedules = async (req, res) => {
    const { serviceId, tariffId, date } = req.query;
    try {
        // Récupérer la durée du tarif
        const tariff = await pool.query('SELECT duration FROM tariffs WHERE id = $1', [tariffId]);
        if (tariff.rows.length === 0) {
            return res.status(404).json({ error: 'Tarif non trouvé.' });
        }
        const duration = tariff.rows[0].duration; // Ex. : "35 min"

        // Récupérer les créneaux disponibles
        const schedules = await pool.query(`
            SELECT s.*
            FROM schedules s
            WHERE s.service_id = $1
            AND s.day = $2
            AND s.is_available = TRUE
            AND NOT EXISTS (
                SELECT 1
                FROM bookings b
                WHERE b.tariff_id = $3
                AND b.date_time::DATE = s.day
                AND (
                    (b.date_time::TIME >= s.start_time AND b.date_time::TIME < s.end_time)
                    OR
                    (b.date_time::TIME + INTERVAL '1 min' * EXTRACT(EPOCH FROM INTERVAL '1 min' * $4::INTEGER) / 60 > s.start_time
                    AND b.date_time::TIME < s.end_time)
                )
            )
        `, [serviceId, date, tariffId, parseInt(duration)]);

        res.json(schedules.rows);
    } catch (error) {
        console.error('Erreur lors de la récupération des créneaux:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

// Modifier un créneau
exports.updateSchedule = async (req, res) => {
    const { id } = req.params;
    const { is_available } = req.body;
    try {
        const updatedSchedule = await pool.query(
            'UPDATE schedules SET is_available = $1 WHERE id = $2 RETURNING *',
            [is_available, id]
        );
        if (updatedSchedule.rows.length === 0) {
            return res.status(404).json({ error: 'Créneau non trouvé.' });
        }
        res.json(updatedSchedule.rows[0]);
    } catch (error) {
        console.error('Erreur lors de la modification du créneau:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

// Supprimer un créneau
exports.deleteSchedule = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedSchedule = await pool.query('DELETE FROM schedules WHERE id = $1 RETURNING *', [id]);
        if (deletedSchedule.rows.length === 0) {
            return res.status(404).json({ error: 'Créneau non trouvé.' });
        }
        res.json({ message: 'Créneau supprimé.' });
    } catch (error) {
        console.error('Erreur lors de la suppression du créneau:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};