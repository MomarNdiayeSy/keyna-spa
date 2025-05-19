const pool = require('../config/db');

// Récupérer tous les utilisateurs
exports.getAllUsers = async (req, res) => {
    try {
        const users = await pool.query('SELECT id, name, email, role, created_at FROM users');
        res.json(users.rows);
    } catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

// Supprimer un utilisateur
exports.deleteUser = async (req, res) => {
    const { userId } = req.params;

    try {
        const deletedUser = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [userId]);
        if (deletedUser.rows.length === 0) {
            return res.status(404).json({ error: 'Utilisateur non trouvé.' });
        }
        res.json({ message: 'Utilisateur supprimé.' });
    } catch (error) {
        console.error('Erreur lors de la suppression de l’utilisateur:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};