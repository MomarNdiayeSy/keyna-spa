module.exports = (roles) => (req, res, next) => {
  const allowedRoles = Array.isArray(roles) ? roles : [roles];
  if (!req.user) {
    return res.status(401).json({ error: 'Utilisateur non authentifié' });
  }
  if (!allowedRoles.includes(req.user.role)) {
    return res.status(403).json({ error: `Accès interdit: rôle ${allowedRoles.join(' ou ')} requis` });
  }
  next();
};