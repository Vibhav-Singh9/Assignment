const mongoose = require('mongoose');

let isConnected = false;
let connectionRetries = 0;
const MAX_RETRIES = 1; // Reduced from 5 to 1 for faster fallback
const RETRY_DELAY = 2000; // Reduced from 5 seconds to 2 seconds

async function connectToDatabase() {
  if (isConnected) return mongoose.connection;
  
  let mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/task_forge';
  
  // For development/testing, try to use MongoDB Memory Server if main connection fails
  if (process.env.NODE_ENV === 'development' && !process.env.MONGO_URI) {
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongoServer = await MongoMemoryServer.create();
      mongoUri = mongoServer.getUri();
      console.log('🧪 Using MongoDB Memory Server for development');
    } catch (error) {
      console.log('⚠️ MongoDB Memory Server not available, using localhost');
    }
  }
  
  try {
    // Configure mongoose options
    mongoose.set('strictQuery', false);
    
    // Connection options
    const options = {
      autoIndex: true,
      serverSelectionTimeoutMS: 5000, // 5 seconds
      socketTimeoutMS: 45000, // 45 seconds
      maxPoolSize: 10,
      minPoolSize: 1,
      maxIdleTimeMS: 30000,
      retryWrites: true
    };

    console.log('🔌 Attempting to connect to MongoDB...');
    console.log('📍 Connection URI:', mongoUri.replace(/\/\/.*@/, '//***:***@')); // Hide credentials
    
    // Connect to MongoDB
    await mongoose.connect(mongoUri, options);
    
    // Set connection status
    isConnected = true;
    connectionRetries = 0;
    
    // Set up connection event listeners
    mongoose.connection.on('connected', () => {
      console.log('✅ MongoDB connection established');
    });

    mongoose.connection.on('error', (error) => {
      console.error('❌ MongoDB connection error:', error);
      isConnected = false;
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ MongoDB connection disconnected');
      isConnected = false;
    });

    mongoose.connection.on('reconnected', () => {
      console.log('🔄 MongoDB connection reestablished');
      isConnected = true;
    });

    // Handle process termination
    process.on('SIGINT', async () => {
      await disconnectFromDatabase();
      process.exit(0);
    });

    return mongoose.connection;
    
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error.message);
    console.log('\n💡 Solutions:');
    console.log('   1. Install MongoDB locally: https://www.mongodb.com/try/download/community');
    console.log('   2. Use MongoDB Atlas (cloud): https://www.mongodb.com/atlas');
    console.log('   3. Check if MongoDB service is running');
    console.log('   4. Verify your MONGO_URI in .env file');
    
    // Implement retry logic
    if (connectionRetries < MAX_RETRIES) {
      connectionRetries++;
      console.log(`\n🔄 Retrying connection (${connectionRetries}/${MAX_RETRIES}) in ${RETRY_DELAY/1000} seconds...`);
      
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      return connectToDatabase();
    } else {
      console.error('\n❌ Max connection retries reached. Please fix MongoDB connection and restart.');
      console.log('💡 Quick fix: Create a .env file in backend folder with valid MONGO_URI');
      throw error;
    }
  }
}

async function disconnectFromDatabase() {
  if (!isConnected) return;
  
  try {
    await mongoose.disconnect();
    isConnected = false;
    console.log('✅ MongoDB connection closed successfully');
  } catch (error) {
    console.error('❌ Error closing MongoDB connection:', error);
    throw error;
  }
}

// Health check function
async function checkDatabaseHealth() {
  try {
    if (mongoose.connection.readyState === 1) {
      return { status: 'healthy', connection: 'connected' };
    } else {
      return { status: 'unhealthy', connection: 'disconnected' };
    }
  } catch (error) {
    return { status: 'error', error: error.message };
  }
}

module.exports = {
  connectToDatabase,
  disconnectFromDatabase,
  checkDatabaseHealth
};


