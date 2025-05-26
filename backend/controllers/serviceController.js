const pool = require('../config/db');

// Récupérer tous les services
exports.getAllServices = async (req, res) => {
    try {
        const services = await pool.query(`
            SELECT s.*, ARRAY_AGG(
                JSON_BUILD_OBJECT(
                    'id', t.id,
                    'name', t.name,
                    'price', t.price,
                    'duration', t.duration
                )
            ) AS tariffs
            FROM services s
            LEFT JOIN tariffs t ON s.id = t.service_id
            GROUP BY s.id
        `);
        const formattedServices = services.rows.map((service) => ({
            ...service,
            tariffs: service.tariffs.filter((t) => t.id !== null), // Filtrer les tarifs nuls
        }));
        res.json(formattedServices);
    } catch (error) {
        console.error('Erreur lors de la récupération des services:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

// Ajouter un service (pour admin)
exports.createService = async (req, res) => {
    const { name, description } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    try {
        const newService = await pool.query(
            'INSERT INTO services (name, description, image, created_at) VALUES ($1, $2, $3, CURRENT_TIMESTAMP) RETURNING *',
            [name, description, image]
        );
        res.status(201).json(newService.rows[0]);
    } catch (error) {
        console.error('Erreur lors de la création du service:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

// Modifier un service (pour admin)
exports.updateService = async (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : req.body.image;

    try {
        const updatedService = await pool.query(
            'UPDATE services SET name = $1, description = $2, image = $3 WHERE id = $4 RETURNING *',
            [name, description, image, id]
        );
        if (updatedService.rows.length === 0) {
            return res.status(404).json({ error: 'Service non trouvé.' });
        }
        res.json(updatedService.rows[0]);
    } catch (error) {
        console.error('Erreur lors de la modification du service:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

// Supprimer un service (pour admin)
exports.deleteService = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedService = await pool.query('DELETE FROM services WHERE id = $1 RETURNING *', [id]);
        if (deletedService.rows.length === 0) {
            return res.status(404).json({ error: 'Service non trouvé.' });
        }
        res.json({ message: 'Service supprimé.' });
    } catch (error) {
        console.error('Erreur lors de la suppression du service:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};