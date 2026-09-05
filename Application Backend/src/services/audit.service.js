import { AuditLog } from '../models/AuditLog.js';
import { AppError } from '../utils/appError.js';

export const createAuditLog = async ({ userId, action, resource, resourceId, metadata, ipAddress, userAgent, session }) => {
  const [log] = await AuditLog.create(
    [
      {
        userId: userId || null,
        action,
        resource,
        resourceId: resourceId || null,
        metadata: metadata || {},
        ipAddress: ipAddress || null,
        userAgent: userAgent || null,
      },
    ],
    session ? { session } : {}
  );

  return log;
};

export const listAuditLogs = async () => {
  return AuditLog.find().sort({ createdAt: -1 }).populate('userId', 'name email role');
};

export const getAuditLogById = async (logId) => {
  const log = await AuditLog.findById(logId).populate('userId', 'name email role');

  if (!log) {
    throw new AppError('Audit log not found', 404, 'AUDIT_LOG_NOT_FOUND');
  }

  return log;
};