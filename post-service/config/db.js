import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async (retries = 5, delay = 2000) => {
  for (let i = 0; i < retries; i++) {
    try {
      await mongoose.connect(process.env.MONGO_URI);
      console.log('[✅] MongoDB connected successfully');
      return;
    } catch (error) {
      if (i < retries - 1) {
        console.warn(`[⚠️] MongoDB connection attempt ${i + 1} failed, retrying in ${delay / 1000}s...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        console.error('[❌] MongoDB connection failed after retries:', error.message);
        throw error;
      }
    }
  }
};

export default connectDB;