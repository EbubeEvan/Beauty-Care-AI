import mongoose from 'mongoose';

const connection: { isConnected: number } = { isConnected: 0 };

const dbConnect = async () => {
  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    throw new Error('Please define MONGODB_URI in your .env file');
  }

  // If already connected, return immediately
  if (connection.isConnected === 1) {
    console.log('Using existing database connection');
    return;
  }

  // If connection is in progress, wait
  if (mongoose.connection.readyState === 2) {
    console.log('Database connection in progress, waiting...');
    await new Promise(resolve => {
      mongoose.connection.once('connected', resolve);
    });
    return;
  }

  try {
    console.log('Attempting to connect to MongoDB...');
    
    const db = await mongoose.connect(MONGODB_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
    });

    connection.isConnected = db.connections[0].readyState;
    console.log('✅ Database connected successfully');
    
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    connection.isConnected = 0;
    
    // Provide more helpful error messages
    if (error instanceof Error) {
      if (error.message.includes('ENOTFOUND')) {
        console.error('DNS lookup failed. Check your internet connection and MongoDB URI.');
      } else if (error.message.includes('authentication failed')) {
        console.error('Authentication failed. Check your MongoDB username and password.');
      }
    }
    
    throw error;
  }
};

export default dbConnect;