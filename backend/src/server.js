require('dotenv').config();
const app = require('./app');
const { connectToDatabase, disconnectFromDatabase } = require('./config/db');

const PORT = process.env.PORT || 4000;

let server;

async function startServer() {
  try {
    // Connect to MongoDB
    await connectToDatabase();
    console.log('✅ MongoDB connected successfully');
    
    // Start the server
    server = app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📱 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🌐 URL: http://localhost:${PORT}`);
    });

    // Handle server errors
    server.on('error', (error) => {
      console.error('❌ Server error:', error);
      process.exit(1);
    });

  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error.message);
    
    // For development, allow server to start without MongoDB
    if (process.env.NODE_ENV === 'development' || !process.env.NODE_ENV) {
      console.log('⚠️ Starting server in development mode without MongoDB...');
      console.log('💡 Some features may not work properly');
      
      server = app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT} (MongoDB not connected)`);
        console.log(`📱 Environment: ${process.env.NODE_ENV || 'development'}`);
        console.log(`🌐 URL: http://localhost:${PORT}`);
        console.log('⚠️ Create a .env file with valid MONGO_URI to enable full functionality');
      });

      // Handle server errors
      server.on('error', (error) => {
        console.error('❌ Server error:', error);
        process.exit(1);
      });
    } else {
      console.error('❌ Production mode requires MongoDB connection');
      process.exit(1);
    }
  }
}

// Graceful shutdown handling
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

async function gracefulShutdown() {
  console.log('\n🛑 Received shutdown signal, closing server gracefully...');
  
  if (server) {
    server.close(() => {
      console.log('✅ HTTP server closed');
      disconnectFromDatabase()
        .then(() => {
          console.log('✅ MongoDB connection closed');
          process.exit(0);
        })
        .catch((error) => {
          console.error('❌ Error closing MongoDB connection:', error);
          process.exit(1);
        });
    });

    // Force close after 10 seconds
    setTimeout(() => {
      console.error('❌ Could not close connections in time, forcefully shutting down');
      process.exit(1);
    }, 10000);
  } else {
    await disconnectFromDatabase();
    process.exit(0);
  }
}

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  gracefulShutdown();
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  gracefulShutdown();
});

// Start the server
startServer();


