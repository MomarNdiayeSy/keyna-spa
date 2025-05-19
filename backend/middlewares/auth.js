const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
    const authHeader = req.header('Authorization');

    if (!authHeader) {
        return res.status(401).json({ error: 'Accès refusé: Aucun token fourni' });
    }

    const token = authHeader.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ error: 'Accès refusé: Format de token invalide' });
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (error) {
        return res.status(400).json({ error: 'Token invalide ou malformé' });
    }
};