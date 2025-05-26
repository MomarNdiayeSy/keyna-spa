const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const auth = require('../middlewares/auth');

// Routes pour le panier (authentification requise)
router.post('/', auth, cartController.addToCart);
router.get('/', auth, cartController.getCart);
router.delete('/:itemId', auth, cartController.removeFromCart);
router.put('/:itemId', auth, cartController.updateCartItem);

module.exports = router;