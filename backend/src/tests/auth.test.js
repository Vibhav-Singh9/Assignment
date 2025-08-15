const request = require('supertest');
const app = require('../app');

require('./setup');

describe('Auth', () => {
  test('register and login', async () => {
    const email = 'user@example.com';
    const password = 'password123';

    const reg = await request(app).post('/api/auth/register').send({ email, password });
    expect(reg.status).toBe(201);
    expect(reg.body.email).toBe(email);

    const res = await request(app).post('/api/auth/login').send({ email, password });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });
});


