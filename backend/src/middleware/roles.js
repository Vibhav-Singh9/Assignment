function requireAdmin(req, res, next) {
  if (req.user && req.user.role === 'admin') return next();
  return res.status(403).json({ message: 'Admin access required' });
}

function requireSelfOrAdmin(paramKey = 'id') {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: 'Authentication required' });
    if (req.user.role === 'admin') return next();
    if (req.user.id === req.params[paramKey]) return next();
    return res.status(403).json({ message: 'Forbidden' });
  };
}

module.exports = { requireAdmin, requireSelfOrAdmin };


