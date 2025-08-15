const express = require('express');
const authenticateJwt = require('../middleware/auth');
const { requireAdmin } = require('../middleware/roles');
const { createUser, listUsers, getUser, updateUser, deleteUser } = require('../controllers/userController');

const router = express.Router();

router.use(authenticateJwt);

router.post('/', requireAdmin, createUser);
router.get('/', requireAdmin, listUsers);
router.get('/:id', requireAdmin, getUser);
router.put('/:id', requireAdmin, updateUser);
router.delete('/:id', requireAdmin, deleteUser);

module.exports = router;


