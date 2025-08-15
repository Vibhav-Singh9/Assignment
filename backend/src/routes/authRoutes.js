const express = require('express');
const { register, login } = require('../controllers/authController');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication
 */

router.post('/register', register);
router.post('/login', login);

module.exports = router;


