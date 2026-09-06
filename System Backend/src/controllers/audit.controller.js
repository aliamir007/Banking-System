import { listAuditLogs, getAuditLogById } from '../services/audit.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/apiResponse.js';

export const list = asyncHandler(async (req, res) => {
  const logs = await listAuditLogs();

  return sendSuccess(res, {
    statusCode: 200,
    message: 'Audit logs retrieved successfully',
    data: { logs },
  });
});

export const getById = asyncHandler(async (req, res) => {
  const log = await getAuditLogById(req.params.id);

  return sendSuccess(res, {
    statusCode: 200,
    message: 'Audit log retrieved successfully',
    data: { log },
  });
});