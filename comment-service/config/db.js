import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Create connection pool with proper environment variables
export const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelayMs: 0
});

// Test connection on startup with retry logic
export const connectDB = async (retries = 5, delay = 2000) => {
  for (let i = 0; i < retries; i++) {
    try {
      const connection = await pool.getConnection();
      console.log('[✅] MySQL Database connected successfully');
      connection.release();
      return;
    } catch (error) {
      if (i < retries - 1) {
        console.warn(`[⚠️] MySQL connection attempt ${i + 1} failed, retrying in ${delay / 1000}s...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        console.error('[❌] MySQL connection failed after retries:', error.message);
        throw error;
      }
    }
  }
};

// Get connection from pool
export const getConnection = async () => {
  return await pool.getConnection();
};
