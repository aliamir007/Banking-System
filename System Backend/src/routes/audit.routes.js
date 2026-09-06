import express from 'express';
import { list, getById } from '../controllers/audit.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';
import { ROLES } from '../constants/roles.js';

const router = express.Router();

router.use(requireAuth, requireRole(ROLES.ADMIN));

router.get('/', list);
router.get('/:id', getById);

export default router;