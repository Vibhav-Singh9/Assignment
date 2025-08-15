const request = require('supertest');
const app = require('../app');

require('./setup');

describe('Auth negatives', () => {
  test('register missing fields -> 400', async () => {
    const res = await request(app).post('/api/auth/register').send({ email: '' });
    expect(res.status).toBe(400);
  });

  test('login non-existent user -> 401', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: 'no@x.com', password: 'x' });
    expect(res.status).toBe(401);
  });

  test('login wrong password -> 401', async () => {
    await request(app).post('/api/auth/register').send({ email: 'neg@x.com', password: 'pass1234' });
    const res = await request(app).post('/api/auth/login').send({ email: 'neg@x.com', password: 'wrong' });
    expect(res.status).toBe(401);
  });
});


