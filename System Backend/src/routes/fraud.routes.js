import express from 'express';
import { list, getById, review } from '../controllers/fraud.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';
import { ROLES } from '../constants/roles.js';

const router = express.Router();

router.use(requireAuth, requireRole(ROLES.ADMIN));

router.get('/alerts', list);
router.get('/alerts/:id', getById);
router.patch('/alerts/:id/review', review);

export default router;