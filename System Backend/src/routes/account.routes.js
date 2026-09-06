import express from 'express';
import { create, list, getById, getBalance } from '../controllers/account.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(requireAuth);

router.post('/', create);
router.get('/', list);
router.get('/:id', getById);
router.get('/:id/balance', getBalance);

export default router;