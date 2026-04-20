const mongoose = require('mongoose');

let dbConnected = false;

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/pow_predictor';
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000
    });
    dbConnected = true;
    console.log('✅ MongoDB connected successfully');
  } catch (err) {
    console.warn('⚠️  MongoDB not available — using in-memory data store');
    console.warn(`   Reason: ${err.message}`);
    console.warn('   💡 Install MongoDB or the app will use built-in dummy data\n');
    dbConnected = false;
  }
};

const isDBConnected = () => dbConnected;

module.exports = { connectDB, isDBConnected };
