const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');
const auth = require('../middlewares/auth');
const roleCheck = require('../middlewares/roleCheck');
const upload = require('../middlewares/upload');

// GET /api/services - Lister tous les services
router.get('/', serviceController.getAllServices);

// POST /api/services - Créer un service (admin uniquement)
router.post('/', auth, roleCheck('admin'), upload.single('image'), serviceController.createService);

// PUT /api/services/:id - Modifier un service (admin uniquement)
router.put('/:id', auth, roleCheck('admin'), upload.single('image'), serviceController.updateService);

// DELETE /api/services/:id - Supprimer un service (admin uniquement)
router.delete('/:id', auth, roleCheck('admin'), serviceController.deleteService);

module.exports = router;