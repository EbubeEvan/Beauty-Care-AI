import mongoose from 'mongoose';

const connection: { isConnected: number } = { isConnected: 0 };

const dbConnect = async () => {
  // Move the URI check inside the function
  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    throw new Error('Please define MONGODB_URI in your .env file');
  }

  if (connection.isConnected) {
    console.log('Using existing database connection');
    return;
  }

  try {
    const db = await mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });

    connection.isConnected = db.connections[0].readyState;
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Database connection failed:', error);
    throw error;
  }
};

export default dbConnect;