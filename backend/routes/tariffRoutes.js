const express = require('express');
const router = express.Router();
const tariffController = require('../controllers/tariffController');
const auth = require('../middlewares/auth');
const roleCheck = require('../middlewares/roleCheck');

// GET /api/tariffs/:serviceId - Lister les tarifs d’un service
router.get('/:serviceId', tariffController.getTariffsByService);

// POST /api/tariffs - Créer un tarif (admin uniquement)
router.post('/', auth, roleCheck('admin'), tariffController.createTariff);

// PUT /api/tariffs/:id - Modifier un tarif (admin uniquement)
router.put('/:id', auth, roleCheck('admin'), tariffController.updateTariff);

// DELETE /api/tariffs/:id - Supprimer un tarif (admin uniquement)
router.delete('/:id', auth, roleCheck('admin'), tariffController.deleteTariff);

module.exports = router;