import express from 'express';
import { transfer, list, getById } from '../controllers/transaction.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(requireAuth);

router.post('/transfer', transfer);
router.get('/', list);
router.get('/:id', getById);

export default router;