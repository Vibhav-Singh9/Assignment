const { verifyJwt } = require('../config/jwt');

function authenticateJwt(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const [scheme, token] = authHeader.split(' ');
  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  try {
    const payload = verifyJwt(token);
    req.user = { id: payload.id, role: payload.role };
    return next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

module.exports = authenticateJwt;


