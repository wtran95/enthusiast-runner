import { request, response, Router } from 'express';
import connectDB from '../config/database';
import { User } from '../models/User';

const router = Router();

// /api/users
router.get('/', async (req, res) => {
  const users = await User.find();
  res.json({ count: users.length, users });
  try {
    res.send('done create new user');
  } catch (error) {
    res.status(500).json(`error: ${error}`);
  }
});

export default router;
