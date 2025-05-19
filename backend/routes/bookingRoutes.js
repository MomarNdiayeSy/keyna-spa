const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const auth = require('../middlewares/auth');
const roleCheck = require('../middlewares/roleCheck');

// GET /api/bookings - Lister toutes les réservations (admin uniquement)
router.get('/', auth, roleCheck('admin'), bookingController.getAllBookings);

// POST /api/bookings - Créer une réservation
router.post('/', bookingController.createBooking);

// PUT /api/bookings/:id - Modifier une réservation (admin uniquement)
router.put('/:id', auth, roleCheck('admin'), bookingController.updateBooking);

// DELETE /api/bookings/:id - Supprimer une réservation (admin uniquement)
router.delete('/:id', auth, roleCheck('admin'), bookingController.deleteBooking);

module.exports = router;