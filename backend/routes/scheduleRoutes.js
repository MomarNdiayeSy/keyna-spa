const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/scheduleController');
const auth = require('../middlewares/auth');
const roleCheck = require('../middlewares/roleCheck');

// Récupérer tous les créneaux (admin)
router.get('/', auth, roleCheck('admin'), scheduleController.getAllSchedules);

// Récupérer les créneaux disponibles
router.get('/available', scheduleController.getAvailableSchedules);

// Créer un créneau (admin uniquement)
router.post('/', auth, roleCheck('admin'), scheduleController.createSchedule);

// Modifier un créneau (admin uniquement)
router.put('/:id', auth, roleCheck('admin'), scheduleController.updateSchedule);

// Supprimer un créneau (admin uniquement)
router.delete('/:id', auth, roleCheck('admin'), scheduleController.deleteSchedule);

module.exports = router;