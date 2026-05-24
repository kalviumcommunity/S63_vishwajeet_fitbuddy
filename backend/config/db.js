const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const connectDB = async () => {
  try {
    console.log('Connecting to MongoDB...');
    // We set a small timeout for connection so it doesn't hang forever if Atlas is down
    await mongoose.connect(process.env.MONGO_URL, { serverSelectionTimeoutMS: 5000 });
    console.log('MongoDB Connected to Atlas/Configured database');
  } catch (error) {
    console.error('MongoDB Connection to Atlas/Configured DB Failed:', error.message);
    console.log('Starting in-memory MongoDB server as fallback...');
    try {
      const mongoServer = await MongoMemoryServer.create();
      const mongoUri = mongoServer.getUri();
      await mongoose.connect(mongoUri);
      console.log('MongoDB Connected to in-memory database');
    } catch (memError) {
      console.error('Failed to start in-memory MongoDB server:', memError.message);
      process.exit(1);
    }
  }
};

module.exports = connectDB;