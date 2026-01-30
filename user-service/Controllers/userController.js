import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../config/db.js";
import { getChannel } from "../config/rabbitmq.js";
import dotenv from 'dotenv';
dotenv.config();


export const signup = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // 1. Validate input
    if (!name || !email || !password) {
      return res.status(400).json({
        message: 'Name, email, and password are required'
      });
    }

    // 1a. Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: 'Invalid email format'
      });
    }

    // 1b. Validate password strength (8+ chars, uppercase, lowercase, number, special char)
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message: 'Password must be at least 8 characters with uppercase, lowercase, number, and special character'
      });
    }

    // 2. Check if user already exists
    const existingUser = await pool.query(
      'SELECT id FROM authschema.users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        message: 'Email already registered'
      });
    }

    // 3. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Insert new user with default role
    const insertResult = await pool.query(
      `
      INSERT INTO authschema.users (name, email, password, role)
      VALUES ($1, $2, $3, $4)
      RETURNING id, name, email, role
      `,
      [name, email, hashedPassword, 'user'] // Default role is 'user'
    );

    const user = insertResult.rows[0];

    // 5. Generate JWT token with role
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    // 🔔 Publish user_created event
    const channel = getChannel();
    channel.sendToQueue(
      'user_created',
      Buffer.from(JSON.stringify({
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: new Date()
      })),
      { persistent: true }
    );

    console.log('[📤] user_created event published');

    // 6. Response
    return res.status(201).json({
      message: 'User registered successfully',
      user,
      token
    });

  } catch (error) {
    console.error('Signup Error:', error);
    return res.status(500).json({
      message: 'Internal server error'
    });
  }
};


export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const result = await pool.query(
      'SELECT id, name, email, password, role FROM authschema.users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = result.rows[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    // 🔔 Publish user_logged_in event
    const channel = getChannel();
    channel.sendToQueue(
      'user_logged_in',
      Buffer.from(JSON.stringify({
        userId: user.id,
        email: user.email,
        loggedInAt: new Date()
      })),
      { persistent: true }
    );

    console.log('[📤] user_logged_in event published');


    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const userResult = await pool.query(
      'SELECT id, name, email, role, created_at FROM authschema.users WHERE id = $1',
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: 'User Not Found.' });
    }

    return res.status(200).json({ user: userResult.rows[0] });

  } catch (error) {
    console.error('Get Profile Error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
