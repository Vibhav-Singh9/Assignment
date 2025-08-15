const request = require('supertest');
const app = require('../app');
const User = require('../models/User');

require('./setup');

async function login(email, password) {
  const res = await request(app).post('/api/auth/login').send({ email, password });
  return res.body.token;
}

describe('Tasks filters/sorting/pagination', () => {
  test('filter by status/priority and sort by dueDate', async () => {
    await User.create({ email: 'tf@a.com', password: 'pass1234', role: 'user' });
    const token = await login('tf@a.com', 'pass1234');

    const now = Date.now();
    const tasks = [
      { title: 'A', status: 'pending', priority: 'low', dueDate: new Date(now + 1000).toISOString() },
      { title: 'B', status: 'in-progress', priority: 'high', dueDate: new Date(now + 2000).toISOString() },
      { title: 'C', status: 'pending', priority: 'high', dueDate: new Date(now + 3000).toISOString() },
    ];
    // eslint-disable-next-line no-restricted-syntax
    for (const t of tasks) {
      // eslint-disable-next-line no-await-in-loop
      await request(app).post('/api/tasks').set('Authorization', `Bearer ${token}`).send(t);
    }

    const res = await request(app)
      .get('/api/tasks?status=pending&priority=high&sortBy=dueDate&order=asc')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.total).toBe(1);
    expect(res.body.items[0].title).toBe('C');

    const page1 = await request(app).get('/api/tasks?limit=2&page=1').set('Authorization', `Bearer ${token}`);
    const page2 = await request(app).get('/api/tasks?limit=2&page=2').set('Authorization', `Bearer ${token}`);
    expect(page1.body.items.length).toBeLessThanOrEqual(2);
    expect(page2.body.items.length).toBeLessThanOrEqual(2);
  });
});


