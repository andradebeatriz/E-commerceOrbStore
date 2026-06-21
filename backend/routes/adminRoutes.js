import express from 'express';
import { getDashboardSummary } from '../controllers/adminController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/summary').get(protect, admin, getDashboardSummary);

export default router;
