const request = require('supertest');
const app = require('../app');
const User = require('../models/User');

require('./setup');

async function getAdminToken() {
  const adminEmail = 'adminf@example.com';
  await User.create({ email: adminEmail, password: 'pass1234', role: 'admin' });
  const login = await request(app).post('/api/auth/login').send({ email: adminEmail, password: 'pass1234' });
  return login.body.token;
}

describe('Users listing filters/sorting', () => {
  test('filter by email substring and role, sort asc', async () => {
    const token = await getAdminToken();
    const payloads = [
      { email: 'user.alpha@example.com', password: 'pass1234', role: 'user' },
      { email: 'user.beta@example.com', password: 'pass1234', role: 'user' },
      { email: 'admin.gamma@example.com', password: 'pass1234', role: 'admin' },
    ];
    // eslint-disable-next-line no-restricted-syntax
    for (const p of payloads) {
      // eslint-disable-next-line no-await-in-loop
      await request(app).post('/api/users').set('Authorization', `Bearer ${token}`).send(p);
    }
    const list = await request(app)
      .get('/api/users?email=user.&role=user&sortBy=email&order=asc')
      .set('Authorization', `Bearer ${token}`);
    expect(list.status).toBe(200);
    expect(list.body.items.length).toBe(2);
    expect(list.body.items[0].email < list.body.items[1].email).toBe(true);
  });
});


