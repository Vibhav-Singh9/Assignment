const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  process.env.MONGO_URI = uri;
  process.env.JWT_SECRET = 'test_secret';
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  if (mongoServer) await mongoServer.stop();
});

afterEach(async () => {
  const collections = await mongoose.connection.db.collections();
  // eslint-disable-next-line no-restricted-syntax
  for (const collection of collections) {
    // eslint-disable-next-line no-await-in-loop
    await collection.deleteMany({});
  }
});


