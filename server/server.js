const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = process.env.DATABASE.replace(
      '<PASSWORD>',
      encodeURIComponent(process.env.DATABASE_PASSWORD),
    );

    await mongoose.connect(uri);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
