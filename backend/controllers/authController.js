const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

// Vérifier JWT_SECRET
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    process.exit(1);
}

// Inscription
exports.register = async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Nom, email et mot de passe sont requis' });
        }

        const userCheck = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userCheck.rows.length > 0) {
            return res.status(400).json({ error: 'Cet email est déjà utilisé' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const userRole = role && ['customer', 'admin'].includes(role) ? role : 'customer';

        const newUser = await pool.query(
            'INSERT INTO users (name, email, password, role, created_at) VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP) RETURNING id, name, email, role',
            [name, email, hashedPassword, userRole]
        );

        const token = jwt.sign(
            { userId: newUser.rows[0].id, email: newUser.rows[0].email, role: userRole },
            JWT_SECRET,
            { expiresIn: '1h' }
        );
        res.status(201).json({ token, user: newUser.rows[0] });
    } catch (error) {
        console.error('Erreur lors de l’inscription:', error);
        res.status(500).json({ error: 'Erreur serveur lors de l’inscription' });
    }
};

// Connexion
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({ error: 'Email et mot de passe sont requis' });
        }

        const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (user.rows.length === 0) {
            return res.status(400).json({ error: 'Email ou mot de passe incorrect' });
        }

        const validPassword = await bcrypt.compare(password, user.rows[0].password);
        if (!validPassword) {
            return res.status(400).json({ error: 'Email ou mot de passe incorrect' });
        }

        const token = jwt.sign(
            { userId: user.rows[0].id, email: user.rows[0].email, role: user.rows[0].role },
            JWT_SECRET,
            { expiresIn: '1h' }
        );
        res.json({
            token,
            user: { id: user.rows[0].id, name: user.rows[0].name, email: user.rows[0].email, role: user.rows[0].role },
        });
    } catch (error) {
        console.error('Erreur lors de la connexion:', error);
        res.status(500).json({ error: 'Erreur serveur lors de la connexion' });
    }
};