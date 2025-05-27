const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const auth = require('../middlewares/auth');
const roleCheck = require('../middlewares/roleCheck');

// GET /api/notifications - Récupérer les notifications non lues (admin uniquement)
router.get('/', auth, roleCheck('admin'), notificationController.getUnreadNotifications);

// PUT /api/notifications/:id/read - Marquer une notification comme lue (admin uniquement)
router.put('/:id/read', auth, roleCheck('admin'), notificationController.markNotificationAsRead);

module.exports = router;