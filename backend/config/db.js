import mongoose from 'mongoose';

export async function connectDB() {
  const uri = process.env.MONGO_URI?.trim();
  if (!uri) {
    console.warn('MONGO_URI not set — skipping MongoDB');
    return;
  }
  try {
    await mongoose.connect(uri);
    console.log('MongoDB connected');
  } catch (err) {
    console.warn('MongoDB failed:', err.message);
  }
}
