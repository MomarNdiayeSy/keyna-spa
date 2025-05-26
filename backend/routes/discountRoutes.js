const express = require('express');
const router = express.Router();
const discountController = require('../controllers/discountController');
const auth = require('../middlewares/auth');
const admin = require('../middlewares/admin');

router.post('/', auth, admin, discountController.createDiscount);
router.get('/', auth, admin, discountController.getDiscounts);
router.put('/:id', auth, admin, discountController.updateDiscount);
router.delete('/:id', auth, admin, discountController.deleteDiscount);
router.post('/validate', auth, discountController.validateDiscount);
router.post('/apply', auth, discountController.applyDiscount);

module.exports = router;