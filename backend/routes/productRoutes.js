const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const productController = require('../controllers/productController');
const auth = require('../middlewares/auth');
const roleCheck = require('../middlewares/roleCheck');
const upload = require('../middlewares/upload');

// GET /api/products - Lister tous les produits
router.get('/', productController.getAllProducts);

// POST /api/products - Créer un produit (admin uniquement)
router.post('/', auth, roleCheck('admin'), upload.single('image'), productController.createProduct);

// PUT /api/products/:productId - Modifier un produit (admin uniquement)
router.put('/:productId', auth, roleCheck('admin'), upload.single('image'), productController.updateProduct);

// DELETE /api/products/:productId - Supprimer un produit (admin uniquement)
router.delete('/:productId', auth, roleCheck('admin'), productController.deleteProduct);

module.exports = router;