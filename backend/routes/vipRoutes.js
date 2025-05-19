const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const auth = require('../middlewares/auth');
const roleCheck = require('../middlewares/roleCheck');
const multer = require('multer');
const path = require('path');

// Configuration de multer pour l'upload d'images
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    },
});
const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);
        if (extname && mimetype) {
            cb(null, true);
        } else {
            cb(new Error('Seules les images JPEG/PNG sont autorisées'));
        }
    },
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
});

// GET /api/vip - Lister toutes les offres VIP
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM vip_offers');
        // Convertir les prix en nombres
        const formattedOffers = result.rows.map((offer) => ({
            ...offer,
            price: parseFloat(offer.price),
        }));
        res.json(formattedOffers);
    } catch (error) {
        console.error('Erreur lors de la récupération des offres VIP:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

// POST /api/vip - Créer une offre VIP (admin uniquement)
router.post('/', auth, roleCheck('admin'), upload.single('image'), async (req, res) => {
    const { name, description, price } = req.body;
    const image = req.file ? `uploads/${req.file.filename}` : null;
    try {
        const result = await pool.query(
            'INSERT INTO vip_offers (name, description, price, image, created_at) VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP) RETURNING *',
            [name, description, price, image]
        );
        res.status(201).json({
            ...result.rows[0],
            price: parseFloat(result.rows[0].price),
        });
    } catch (error) {
        console.error('Erreur lors de la création de l’offre VIP:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

// PUT /api/vip/:id - Modifier une offre VIP (admin uniquement)
router.put('/:id', auth, roleCheck('admin'), upload.single('image'), async (req, res) => {
    const { id } = req.params;
    const { name, description, price } = req.body;
    const image = req.file ? `uploads/${req.file.filename}` : req.body.image;
    try {
        const result = await pool.query(
            'UPDATE vip_offers SET name = $1, description = $2, price = $3, image = $4 WHERE id = $5 RETURNING *',
            [name, description, price, image, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Offre VIP non trouvée' });
        }
        res.json({
            ...result.rows[0],
            price: parseFloat(result.rows[0].price),
        });
    } catch (error) {
        console.error('Erreur lors de la modification de l’offre VIP:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

// DELETE /api/vip/:id - Supprimer une offre VIP (admin uniquement)
router.delete('/:id', auth, roleCheck('admin'), async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM vip_offers WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Offre VIP non trouvée' });
        }
        res.json({ message: 'Offre VIP supprimée' });
    } catch (error) {
        console.error('Erreur lors de la suppression de l’offre VIP:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

module.exports = router;