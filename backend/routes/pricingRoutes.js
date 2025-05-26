const express = require('express');
const router = express.Router();
const pricingController = require('../controllers/pricingController');
const auth = require('../middlewares/auth');
const admin = require('../middlewares/admin');

router.post('/', auth, admin, pricingController.createPricing);
router.get('/', pricingController.getPricing); // Accessible à tous
router.put('/:id', auth, admin, pricingController.updatePricing);
router.delete('/:id', auth, admin, pricingController.deletePricing);

module.exports = router;