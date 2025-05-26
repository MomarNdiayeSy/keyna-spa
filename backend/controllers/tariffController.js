const pool = require('../config/db');

// Créer un tarif
exports.createTariff = async (req, res) => {
    const { service_id, name, price, duration } = req.body;
    try {
        const newTariff = await pool.query(
            'INSERT INTO tariffs (service_id, name, price, duration, created_at) VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP) RETURNING *',
            [service_id, name, parseFloat(price), duration]
        );
        res.status(201).json(newTariff.rows[0]);
    } catch (error) {
        console.error('Erreur lors de la création du tarif:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

// Récupérer les tarifs d’un service
exports.getTariffsByService = async (req, res) => {
    const { serviceId } = req.params;
    try {
        const tariffs = await pool.query('SELECT * FROM tariffs WHERE service_id = $1', [serviceId]);
        res.json(tariffs.rows.map((t) => ({ ...t, price: parseFloat(t.price) })));
    } catch (error) {
        console.error('Erreur lors de la récupération des tarifs:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

// Modifier un tarif
exports.updateTariff = async (req, res) => {
    const { id } = req.params;
    const { name, price, duration } = req.body;
    try {
        const updatedTariff = await pool.query(
            'UPDATE tariffs SET name = $1, price = $2, duration = $3 WHERE id = $4 RETURNING *',
            [name, parseFloat(price), duration, id]
        );
        if (updatedTariff.rows.length === 0) {
            return res.status(404).json({ error: 'Tarif non trouvé.' });
        }
        res.json({ ...updatedTariff.rows[0], price: parseFloat(updatedTariff.rows[0].price) });
    } catch (error) {
        console.error('Erreur lors de la modification du tarif:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

// Supprimer un tarif
exports.deleteTariff = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedTariff = await pool.query('DELETE FROM tariffs WHERE id = $1 RETURNING *', [id]);
        if (deletedTariff.rows.length === 0) {
            return res.status(404).json({ error: 'Tarif non trouvé.' });
        }
        res.json({ message: 'Tarif supprimé.' });
    } catch (error) {
        console.error('Erreur lors de la suppression du tarif:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};