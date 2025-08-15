const request = require('supertest');
const app = require('../app');
const User = require('../models/User');

require('./setup');

describe('Middleware', () => {
  test('rejects missing token', async () => {
    const res = await request(app).get('/api/users');
    expect(res.status).toBe(401);
  });

  test('rejects non-admin for user list', async () => {
    const user = await User.create({ email: 'u1@example.com', password: 'pass1234', role: 'user' });
    const login = await request(app).post('/api/auth/login').send({ email: user.email, password: 'pass1234' });
    const res = await request(app).get('/api/users').set('Authorization', `Bearer ${login.body.token}`);
    expect(res.status).toBe(403);
  });
});


