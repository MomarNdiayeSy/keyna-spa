const pool = require('../config/db');

exports.createPricing = async (req, res) => {
    const { type, category, name, duration, description, price_solo, price_duo, price_package, included_services } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO pricing (type, category, name, duration, description, price_solo, price_duo, price_package, included_services) ' +
            'VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
            [type, category, name, duration, description, parseFloat(price_solo) || null, parseFloat(price_duo) || null, parseFloat(price_package) || null, included_services]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Erreur lors de la création:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

exports.getPricing = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM pricing ORDER BY type, category, name');
        const services = result.rows.filter(item => item.type === 'service');
        const formulas = result.rows.filter(item => item.type === 'formula');
        res.json({ services, formulas });
    } catch (error) {
        console.error('Erreur lors de la récupération:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

exports.updatePricing = async (req, res) => {
    const { id } = req.params;
    const { type, category, name, duration, description, price_solo, price_duo, price_package, included_services } = req.body;
    try {
        const result = await pool.query(
            'UPDATE pricing SET type = $1, category = $2, name = $3, duration = $4, description = $5, ' +
            'price_solo = $6, price_duo = $7, price_package = $8, included_services = $9, updated_at = CURRENT_TIMESTAMP ' +
            'WHERE id = $10 RETURNING *',
            [type, category, name, duration, description, parseFloat(price_solo) || null, parseFloat(price_duo) || null, parseFloat(price_package) || null, included_services, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Élément non trouvé' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Erreur lors de la mise à jour:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

exports.deletePricing = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM pricing WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Élément non trouvé' });
        }
        res.json({ message: 'Élément supprimé' });
    } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};