import { Router } from 'express';
import { User } from '../models/User';

const router = Router();

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
