import { Request, Response, NextFunction } from 'express';
import { verifyToken, TokenPayload } from '../utils/tokens';
import prisma from '../config/database';

export interface AuthenticatedRequest extends Request {
  user?: TokenPayload & {
    firstName?: string;
    lastName?: string;
  };
}

export const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    let token: string | undefined;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }

    if (!token) {
      res.status(401).json({ success: false, message: 'Authentication required. No token provided.' });
      return;
    }

    const decoded = verifyToken(token);
    
    // Check if user still exists and is active
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, status: true, role: true, firstName: true, lastName: true },
    });

    if (!user || user.status !== 'ACTIVE') {
      res.status(401).json({ success: false, message: 'User account is inactive or no longer exists.' });
      return;
    }

    req.user = {
      ...decoded,
      role: user.role, // Always use DB authoritative role
      firstName: user.firstName,
      lastName: user.lastName,
    };

    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid or expired authentication token.' });
  }
};
