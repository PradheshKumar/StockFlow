import { Router } from 'express';
import { authenticate } from '../middleware/authenticate.js';
import * as dashboardController from '../controllers/dashboardController.js';

const router = Router();

// GET /api/dashboard
router.get('/', authenticate, dashboardController.getSummary);

export default router;
