const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const path = require('path');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./docs/swagger');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const taskRoutes = require('./routes/taskRoutes');

const app = express();

// Security & logging
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));

// Body parsing
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting (basic)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use('/api', apiLimiter);

// Static serve uploads when local storage
const { storageType, uploadDir } = require('./config/storage');
if (storageType === 'local') {
  app.use('/uploads', express.static(path.join(process.cwd(), uploadDir)));
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);

// Swagger docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Health
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Global error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  const details = process.env.NODE_ENV === 'development' ? err.stack : undefined;
  res.status(status).json({ message, details });
});

// Database connection is handled in server.js for runtime, and in tests via setup

module.exports = app;


