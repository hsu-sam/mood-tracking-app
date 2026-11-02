import mongoose from 'mongoose';

async function connectDB() {
  const { DATABASE, DATABASE_PASSWORD } = process.env;

  if (!DATABASE) {
    throw new Error('DATABASE is not set in the environment');
  }

  if (!DATABASE_PASSWORD) {
    throw new Error('DATABASE_PASSWORD is not set in the environment');
  }

  const uri = DATABASE.replace(
    '<PASSWORD>',
    encodeURIComponent(DATABASE_PASSWORD),
  );

  await mongoose.connect(uri);
  console.log('MongoDB connected');
}

export default connectDB;
