const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const auth = require('../middlewares/auth');

router.get('/methods', paymentController.getPaymentMethods);
router.post('/create-checkout-session', auth, paymentController.createCheckoutSession);
router.post('/confirm', auth, paymentController.confirmPayment);

module.exports = router;