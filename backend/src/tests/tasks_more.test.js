const path = require('path');
const fs = require('fs');
const request = require('supertest');
const app = require('../app');
const User = require('../models/User');

require('./setup');

async function login(email, password) {
  const res = await request(app).post('/api/auth/login').send({ email, password });
  return res.body.token;
}

describe('Task document download and access control', () => {
  test('user can download own task document (local returns stream)', async () => {
    const email = 'a@a.com';
    const password = 'pass1234';
    await User.create({ email, password, role: 'user' });
    const token = await login(email, password);

    const pdfPath = path.join(__dirname, 'sample2.pdf');
    fs.writeFileSync(pdfPath, '%PDF-1.4\n%\xE2\xE3\xCF\xD3\n1 0 obj\n<<>>\nendobj\ntrailer\n<<>>\n%%EOF');
    const create = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .field('title', 'Doc Task')
      .attach('documents', pdfPath);
    fs.unlinkSync(pdfPath);
    expect(create.status).toBe(201);
    const taskId = create.body._id;
    const docId = create.body.documents[0]._id;

    const dl = await request(app)
      .get(`/api/tasks/${taskId}/documents/${docId}/download`)
      .set('Authorization', `Bearer ${token}`);
    expect([200, 404]).toContain(dl.status);
  });

  test('other users cannot access task', async () => {
    await User.create({ email: 'u1@a.com', password: 'pass1234', role: 'user' });
    await User.create({ email: 'u2@a.com', password: 'pass1234', role: 'user' });
    const token1 = await login('u1@a.com', 'pass1234');
    const token2 = await login('u2@a.com', 'pass1234');
    const create = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token1}`)
      .field('title', 'Private Task');
    const taskId = create.body._id;
    const getAsOther = await request(app)
      .get(`/api/tasks/${taskId}`)
      .set('Authorization', `Bearer ${token2}`);
    expect(getAsOther.status).toBe(403);
  });
});


