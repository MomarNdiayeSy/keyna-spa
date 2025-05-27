const pool = require('../config/db');

// Récupérer les notifications non lues pour un admin
exports.getUnreadNotifications = async (req, res) => {
  const adminId = req.user.userId;

  try {
    const notifications = await pool.query(
      'SELECT n.*, b.tariff_id, b.date_time, b.customer_name, b.customer_email, s.name AS service_name, t.name AS tariff_name ' +
      'FROM notifications n ' +
      'LEFT JOIN bookings b ON n.booking_id = b.id ' +
      'LEFT JOIN tariffs t ON b.tariff_id = t.id ' +
      'LEFT JOIN services s ON t.service_id = s.id ' +
      'WHERE n.admin_id IS NULL OR n.admin_id = $1 AND n.is_read = FALSE ' +
      'ORDER BY n.created_at DESC',
      [adminId]
    );
    res.json(notifications.rows);
  } catch (error) {
    console.error('Erreur lors de la récupération des notifications:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// Marquer une notification comme lue
exports.markNotificationAsRead = async (req, res) => {
  const { id } = req.params;
  const adminId = req.user.userId;

  try {
    const updatedNotification = await pool.query(
      'UPDATE notifications SET is_read = TRUE WHERE id = $1 AND (admin_id IS NULL OR admin_id = $2) RETURNING *',
      [id, adminId]
    );
    if (updatedNotification.rows.length === 0) {
      return res.status(404).json({ error: 'Notification non trouvée ou non autorisée' });
    }
    res.json(updatedNotification.rows[0]);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la notification:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};