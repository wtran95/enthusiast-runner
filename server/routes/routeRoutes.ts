import { Router } from 'express';
import { Route } from '../models/Route';

const router = Router();

// GET /api//routes - List all users
router.get('/', async (req, res) => {
  try {
    const routes = await Route.find();
    res.json({ count: routes.length, routes });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/routes/create - Test route creation
router.post('/create', async (req, res) => {
  try {
    const route = new Route(req.body);
    await route.save();
    res.status(201).json({ message: 'Route created!', route });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
