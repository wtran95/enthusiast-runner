// Import Express
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
  };
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    //  Extract JWT token from Authorization header
    const authHeader = req.headers.authorization;

    //  Verify token using `jsonwebtoken` library
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1]; // Remove Bearer prefix
    //  Decode user ID from token payload

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };
    //  Attach user to request object

    req.user = { userId: decoded.userId };
    //  Handle invalid/expired tokens
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};
