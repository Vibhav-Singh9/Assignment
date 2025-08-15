const path = require('path');
const fs = require('fs');
const request = require('supertest');
const app = require('../app');
const User = require('../models/User');

require('./setup');

async function bootstrapUsers() {
  const admin = await User.create({ email: 'admin@example.com', password: 'pass1234', role: 'admin' });
  const user = await User.create({ email: 'user@example.com', password: 'pass1234', role: 'user' });
  const adminLogin = await request(app).post('/api/auth/login').send({ email: admin.email, password: 'pass1234' });
  const userLogin = await request(app).post('/api/auth/login').send({ email: user.email, password: 'pass1234' });
  return { adminToken: adminLogin.body.token, userToken: userLogin.body.token, userId: user._id, adminId: admin._id };
}

describe('Tasks', () => {
  test('user can CRUD own tasks and attach PDFs', async () => {
    const { userToken, userId } = await bootstrapUsers();

    const pdfPath = path.join(__dirname, 'sample.pdf');
    fs.writeFileSync(pdfPath, '%PDF-1.4\n%\xE2\xE3\xCF\xD3\n1 0 obj\n<<>>\nendobj\ntrailer\n<<>>\n%%EOF');

    const create = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${userToken}`)
      .field('title', 'Task A')
      .field('description', 'Desc')
      .field('priority', 'high')
      .attach('documents', pdfPath);
    expect(create.status).toBe(201);
    expect(create.body.documents.length).toBe(1);

    const taskId = create.body._id;
    const get = await request(app).get(`/api/tasks/${taskId}`).set('Authorization', `Bearer ${userToken}`);
    expect(get.status).toBe(200);

    const list = await request(app)
      .get('/api/tasks?status=pending&sortBy=priority&order=asc')
      .set('Authorization', `Bearer ${userToken}`);
    expect(list.status).toBe(200);
    expect(list.body.total).toBeGreaterThanOrEqual(1);

    const update = await request(app)
      .put(`/api/tasks/${taskId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .field('status', 'completed');
    expect(update.status).toBe(200);
    expect(update.body.status).toBe('completed');

    const del = await request(app)
      .delete(`/api/tasks/${taskId}`)
      .set('Authorization', `Bearer ${userToken}`);
    expect(del.status).toBe(204);

    fs.unlinkSync(pdfPath);
  });

  test('admin can view others tasks', async () => {
    const { userToken, userId, adminToken } = await bootstrapUsers();
    const create = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${userToken}`)
      .field('title', 'User Task')
      .field('assignedTo', String(userId));
    expect(create.status).toBe(201);

    const listAsAdmin = await request(app)
      .get(`/api/tasks?assignedTo=${userId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(listAsAdmin.status).toBe(200);
    expect(listAsAdmin.body.total).toBeGreaterThanOrEqual(1);
  });
});


