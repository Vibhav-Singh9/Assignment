const User = require('../models/User');

function buildQuery(query) {
  const filter = {};
  if (query.role) filter.role = query.role;
  if (query.email) filter.email = new RegExp(query.email, 'i');
  const sort = {};
  if (query.sortBy) {
    const direction = query.order === 'asc' ? 1 : -1;
    sort[query.sortBy] = direction;
  } else {
    sort.createdAt = -1;
  }
  const page = Math.max(parseInt(query.page || '1', 10), 1);
  const limit = Math.min(Math.max(parseInt(query.limit || '10', 10), 1), 100);
  const skip = (page - 1) * limit;
  return { filter, sort, page, limit, skip };
}

async function createUser(req, res) {
  try {
    const { email, password, role } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: 'Email already in use' });
    const user = await User.create({ email, password, role });
    return res.status(201).json(user);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

async function listUsers(req, res) {
  try {
    const { filter, sort, page, limit, skip } = buildQuery(req.query);
    const [items, total] = await Promise.all([
      User.find(filter).sort(sort).skip(skip).limit(limit),
      User.countDocuments(filter),
    ]);
    return res.json({ items, total, page, limit });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

async function getUser(req, res) {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    return res.json(user);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

async function updateUser(req, res) {
  try {
    const { email, password, role } = req.body;
    const user = await User.findById(req.params.id).select('+password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (email) user.email = email;
    if (typeof role !== 'undefined') user.role = role;
    if (password) user.password = password; // will be hashed by pre-save
    await user.save();
    return res.json(user.toJSON());
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

async function deleteUser(req, res) {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    return res.status(204).send();
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

module.exports = { createUser, listUsers, getUser, updateUser, deleteUser };


