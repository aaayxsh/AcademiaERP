import prisma from '../config/database';
import { AuthenticatedRequest } from './auth';

export const logAuditEvent = async (
  req: AuthenticatedRequest,
  action: string,
  entityType: string,
  entityId?: string,
  details?: Record<string, any>
): Promise<void> => {
  try {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const userAgent = req.headers['user-agent'] || 'unknown';

    await prisma.auditLog.create({
      data: {
        userId: req.user?.userId || null,
        role: req.user?.role || 'SYSTEM',
        action,
        entityType,
        entityId: entityId || null,
        detailsJson: details ? JSON.stringify(details) : null,
        ipAddress: ip,
        userAgent,
      },
    });
  } catch (error) {
    console.error('Failed to record audit log:', error);
  }
};
