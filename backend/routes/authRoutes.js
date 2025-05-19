const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Routes pour l'authentification (non protégées)
router.post('/register', authController.register);
router.post('/login', authController.login);

module.exports = router;