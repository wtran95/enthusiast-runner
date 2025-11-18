import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database';
import usersRouter from './routes/userRoutes';
import routesRouter from './routes/routeRoutes';
import authRouter from './routes/authRoutes';
import { authenticate } from './middleware/auth';

// Load environment variables
dotenv.config();

// Connect to database
await connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: 'http://localhost:5173', // Your Vite frontend URL
    credentials: true, // Allow cookies to be sent
  })
);
app.use(express.json());

// User Routes
app.use('/api/users', authenticate, usersRouter);

// Route Routes
app.use('/api/routes', authenticate, routesRouter);
// Auth Routes
app.use('/auth', authRouter);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

export default app;
