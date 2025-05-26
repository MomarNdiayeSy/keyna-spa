const bcrypt = require('bcrypt');
const pool = require('../config/db');

// Récupérer tous les utilisateurs
exports.getAllUsers = async (req, res) => {
  try {
    const users = await pool.query('SELECT id, name, email, phone_number, role, created_at FROM users');
    res.json(users.rows);
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// Créer un utilisateur
exports.createUser = async (req, res) => {
  const { name, email, password, phone_number, role } = req.body;

  try {
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Nom, email et mot de passe requis' });
    }

    const userCheck = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userCheck.rows.length > 0) {
      return res.status(400).json({ error: 'Cet email est déjà utilisé' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userRole = role && ['customer', 'admin'].includes(role) ? role : 'customer';

    const newUser = await pool.query(
      'INSERT INTO users (name, email, password, phone_number, role, created_at) VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP) RETURNING id, name, email, phone_number, role, created_at',
      [name, email, hashedPassword, phone_number || null, userRole]
    );

    res.status(201).json(newUser.rows[0]);
  } catch (error) {
    console.error('Erreur lors de la création de l’utilisateur:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// Mettre à jour un utilisateur
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, phone_number, role } = req.body;

  try {
    if (!name || !email) {
      return res.status(400).json({ error: 'Nom et email requis' });
    }

    const updatedUser = await pool.query(
      'UPDATE users SET name = $1, email = $2, phone_number = $3, role = $4 WHERE id = $5 RETURNING id, name, email, phone_number, role, created_at',
      [name, email, phone_number || null, role, id]
    );
    if (updatedUser.rows.length === 0) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }
    res.json(updatedUser.rows[0]);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l’utilisateur:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// Supprimer un utilisateur
exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedUser = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
    if (deletedUser.rows.length === 0) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }
    res.json({ message: 'Utilisateur supprimé' });
  } catch (error) {
    console.error('Erreur lors de la suppression de l’utilisateur:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};