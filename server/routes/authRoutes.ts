import { Router } from 'express';
import { User } from '../models/User';
import jwt from 'jsonwebtoken';
import { hashPassword, comparePassword } from '../utils/password';

const router = Router();

// POST /register - Register an account to the db
router.post('/register', async (req, res) => {
  try {
    const { email, username, password } = req.body;

    // 1. Validate input
    if (!email || !username || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: 'Password must be at least 6 characters' });
    }

    // 2. Check for existing user
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(400).json({ error: 'Email already exists' });
      }
      return res.status(400).json({ error: 'Username already taken' });
    }

    // 3. Hash password
    const passwordHash = await hashPassword(password);

    // 4. Create user
    const user = new User({
      email,
      username,
      passwordHash,
    });

    await user.save();

    const token = jwt.sign(
      {
        exp: Math.floor(Date.now() / 1000) + 60 * 60,
        userId: user._id.toString(),
      },
      process.env.JWT_SECRET!
    );
    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        _id: user._id,
        email: user.email,
        username: user.username,
      },
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// POST /login - Loin a user with JWT verified
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username && !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // findOne user by his username ? or email eitherway ensure the uniqueness
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isPasswordValid = await comparePassword(password, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        exp: Math.floor(Date.now() / 1000) + 60 * 60,
        userId: user._id.toString(),
      },
      process.env.JWT_SECRET!
    );

    // return landing page and disappear login panel
    res.json({
      message: 'Login successful',
      token,
      user: {
        _id: user._id,
        email: user.email,
        username: user.username,
      },
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
