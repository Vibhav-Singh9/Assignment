const User = require('../models/User');
const { signJwt } = require('../config/jwt');

async function register(req, res) {
  try {
    const { email, password, role } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password are required' });
    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: 'Email already in use' });
    const user = await User.create({ email, password, role });
    return res.status(201).json(user);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password are required' });
    const user = await User.findOne({ email }).select('+password');
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const valid = await user.comparePassword(password);
    if (!valid) return res.status(401).json({ message: 'Invalid credentials' });
    const token = signJwt({ id: user._id, role: user.role });
    return res.json({ token, user: user.toJSON() });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

module.exports = { register, login };


