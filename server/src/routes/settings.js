import { Router } from 'express';
import { authenticate } from '../middleware/authenticate.js';
import { validate } from '../middleware/validate.js';
import * as settingsController from '../controllers/settingsController.js';

const router = Router();

router.use(authenticate);

// GET /api/settings
router.get('/', settingsController.getSettings);

// PUT /api/settings
router.put(
  '/',
  validate({
    body: {
      defaultLowStockThreshold: (v) => {
        if (v === undefined) return;
        if (isNaN(Number(v)) || Number(v) < 0) return 'defaultLowStockThreshold must be a non-negative number';
      },
    },
  }),
  settingsController.updateSettings
);

export default router;
