import { Router } from 'express';
import { User } from '../models/User';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

// GET /api/users/me - Get current authenticated user
router.get('/me', authenticate, async (req: AuthRequest, res) => {
  try {
    const user = await User.findById(req.user?.userId).select('-passwordHash');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      _id: user._id,
      email: user.email,
      username: user.username,
      createdAt: user.createdAt,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/users - List all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.json({ count: users.length, users });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/users/create - Test user creation
router.post('/create', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json({ message: 'User created!', user });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
