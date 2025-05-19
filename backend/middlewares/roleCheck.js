module.exports = (roles) => (req, res, next) => {
    console.log('Vérification rôle:', { user: req.user, roles, path: req.path });
    if (!req.user) {
        console.log('Erreur: Utilisateur non authentifié');
        return res.status(401).json({ error: 'Utilisateur non authentifié' });
    }
    if (!roles.includes(req.user.role)) {
        console.log('Erreur: Accès interdit', { role: req.user.role, required: roles });
        return res.status(403).json({ error: `Accès interdit: rôle ${roles.join(' ou ')} requis` });
    }
    console.log('Rôle vérifié, accès autorisé');
    next();
};