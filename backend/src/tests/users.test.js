const request = require('supertest');
const app = require('../app');
const User = require('../models/User');

require('./setup');

async function getAdminToken() {
  const admin = await User.create({ email: 'admin@example.com', password: 'pass1234', role: 'admin' });
  const login = await request(app).post('/api/auth/login').send({ email: admin.email, password: 'pass1234' });
  return login.body.token;
}

describe('Users', () => {
  test('admin can CRUD users and list with pagination', async () => {
    const token = await getAdminToken();

    const create = await request(app)
      .post('/api/users')
      .set('Authorization', `Bearer ${token}`)
      .send({ email: 'user1@example.com', password: 'secret123', role: 'user' });
    expect(create.status).toBe(201);

    const list = await request(app)
      .get('/api/users?limit=1&page=1')
      .set('Authorization', `Bearer ${token}`);
    expect(list.status).toBe(200);
    expect(list.body.items.length).toBeLessThanOrEqual(1);
    expect(list.body.total).toBeGreaterThanOrEqual(1);

    const userId = create.body._id;
    const get = await request(app).get(`/api/users/${userId}`).set('Authorization', `Bearer ${token}`);
    expect(get.status).toBe(200);

    const update = await request(app)
      .put(`/api/users/${userId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ role: 'admin' });
    expect(update.status).toBe(200);
    expect(update.body.role).toBe('admin');

    const del = await request(app)
      .delete(`/api/users/${userId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(del.status).toBe(204);
  });
});


