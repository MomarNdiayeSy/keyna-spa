const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const auth = require('../middlewares/auth');
const roleCheck = require('../middlewares/roleCheck');

// GET /api/users - Lister tous les utilisateurs (admin uniquement)
router.get('/', auth, roleCheck('admin'), async (req, res) => {
    try {
        const result = await pool.query('SELECT id, name, email, role, created_at FROM users');
        res.json(result.rows);
    } catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

module.exports = router;