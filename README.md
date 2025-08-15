# Task Forge 🚀

A modern, full-stack task management system built with React, Node.js, and MongoDB. Task Forge helps teams collaborate, organize tasks, and track project progress efficiently.

## ✨ Features

- **User Management**: Secure authentication with JWT tokens
- **Task Management**: Create, update, delete, and assign tasks
- **Role-based Access Control**: Different permissions for users and admins
- **File Uploads**: Support for file attachments to tasks
- **Real-time Updates**: Live task status updates
- **Responsive Design**: Works seamlessly on desktop and mobile
- **API Documentation**: Built-in Swagger documentation
- **Testing**: Comprehensive test suite with Jest

## 🏗️ Architecture

```
Task_Forge/
├── backend/                 # Node.js + Express API
│   ├── src/
│   │   ├── controllers/    # Business logic
│   │   ├── models/         # MongoDB schemas
│   │   ├── routes/         # API endpoints
│   │   ├── middleware/     # Authentication & validation
│   │   └── config/         # Database & JWT configuration
│   └── uploads/            # File storage
└── taskforge-teamwork/      # React + TypeScript Frontend
    ├── src/
    │   ├── components/     # Reusable UI components
    │   ├── pages/          # Application pages
    │   └── hooks/          # Custom React hooks
    └── public/             # Static assets
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **MongoDB** (local installation or MongoDB Atlas account)

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file:**
   Create a `.env` file in the `backend` directory with:
   ```env
   PORT=4000
   NODE_ENV=development
   MONGO_URI=mongodb://localhost:27017/task_forge
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
   JWT_EXPIRES_IN=1d
   MAX_FILE_SIZE=10485760
   UPLOAD_PATH=./uploads
   ```

4. **Start the backend:**
   ```bash
   npm run dev
   ```

   The server will start on `http://localhost:4000`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd taskforge-teamwork
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the frontend:**
   ```bash
   npm run dev
   ```

   The application will open on `http://localhost:8080`

## 🔧 Configuration Options

### MongoDB Connection

**Option 1: Local MongoDB**
```env
MONGO_URI=mongodb://localhost:27017/task_forge
```

**Option 2: MongoDB Atlas (Cloud)**
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/task_forge
```

**Option 3: Docker (if available)**
```bash
cd backend
docker-compose up -d mongo
```

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `4000` |
| `NODE_ENV` | Environment mode | `development` |
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/task_forge` |
| `JWT_SECRET` | JWT signing secret | `dev_secret_change_me` |
| `JWT_EXPIRES_IN` | JWT token expiration | `1d` |
| `MAX_FILE_SIZE` | Maximum file upload size (bytes) | `10485760` (10MB) |
| `UPLOAD_PATH` | File upload directory | `./uploads` |

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get user profile

### Tasks
- `GET /api/tasks` - Get all tasks (with filters)
- `POST /api/tasks` - Create new task
- `GET /api/tasks/:id` - Get task by ID
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### API Documentation
Visit `http://localhost:4000/api-docs` for interactive Swagger documentation.

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm test                    # Run all tests
npm run test:coverage      # Run tests with coverage
```

### Frontend Tests
```bash
cd taskforge-teamwork
npm test                   # Run all tests
```

## 🐳 Docker Support

### Using Docker Compose
```bash
cd backend
docker-compose up -d       # Start MongoDB and backend
docker-compose down        # Stop services
```

### Docker Compose Services
- **MongoDB**: Database service on port 27017
- **Backend**: Node.js API on port 4000

## 📁 Project Structure

### Backend Structure
```
backend/
├── src/
│   ├── controllers/       # Request handlers
│   │   ├── authController.js
│   │   ├── taskController.js
│   │   └── userController.js
│   ├── models/           # Database schemas
│   │   ├── Task.js
│   │   └── User.js
│   ├── routes/           # API route definitions
│   │   ├── authRoutes.js
│   │   ├── taskRoutes.js
│   │   └── userRoutes.js
│   ├── middleware/       # Custom middleware
│   │   ├── auth.js       # JWT authentication
│   │   ├── roles.js      # Role-based access control
│   │   └── upload.js     # File upload handling
│   ├── config/           # Configuration files
│   │   ├── db.js         # Database connection
│   │   └── jwt.js        # JWT configuration
│   └── tests/            # Test files
├── uploads/              # File storage directory
└── package.json          # Dependencies and scripts
```

### Frontend Structure
```
taskforge-teamwork/
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── layout/       # Layout components
│   │   ├── tasks/        # Task-related components
│   │   └── ui/           # Base UI components
│   ├── pages/            # Application pages
│   │   ├── Dashboard.tsx
│   │   ├── Index.tsx
│   │   └── NotFound.tsx
│   ├── hooks/            # Custom React hooks
│   └── lib/              # Utility functions
├── public/               # Static assets
└── package.json          # Dependencies and scripts
```

## 🚀 Available Scripts

### Backend Scripts
```bash
npm run dev          # Start development server with nodemon
npm start            # Start production server
npm test             # Run test suite
npm run test:coverage # Run tests with coverage report
```

### Frontend Scripts
```bash
npm run dev          # Start development server (Vite)
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Bcrypt password encryption
- **Role-based Access Control**: Different permission levels
- **Input Validation**: Request data validation
- **Rate Limiting**: API request rate limiting
- **CORS Protection**: Cross-origin resource sharing configuration
- **Helmet Security**: Security headers middleware

## 📱 Frontend Technologies

- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn/ui** - Beautiful, accessible UI components
- **React Router** - Client-side routing
- **React Hook Form** - Form handling
- **Zod** - Schema validation

## 🔧 Backend Technologies

- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Token authentication
- **Multer** - File upload middleware
- **Swagger** - API documentation
- **Jest** - Testing framework
- **Nodemon** - Development server with auto-reload

## 🐛 Troubleshooting

### Common Issues

**1. MongoDB Connection Failed**
- Ensure MongoDB is running locally or use MongoDB Atlas
- Check your `.env` file for correct `MONGO_URI`
- Verify network connectivity

**2. Port Already in Use**
- Change the port in `.env` file
- Kill processes using the port: `netstat -ano | findstr :4000`

**3. Frontend Build Errors**
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Check Node.js version compatibility

**4. File Upload Issues**
- Ensure `uploads` directory exists in backend
- Check file size limits in `.env`
- Verify file permissions

### Development Mode
The backend can run in development mode without MongoDB for basic testing:
```bash
NODE_ENV=development npm run dev
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Issues**: Create an issue on GitHub
- **Documentation**: Check the API docs at `/api-docs`
- **Questions**: Open a discussion on GitHub

## 🔄 Updates

- **v1.0.0**: Initial release with core task management features
- **v1.1.0**: Added file uploads and enhanced security
- **v1.2.0**: Improved error handling and MongoDB connection management

---

**Happy Task Forging! 🎯**
