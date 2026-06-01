import { Router } from 'express';
import { validate } from '../middleware/validate.js';
import * as organizationsController from '../controllers/organizationsController.js';

const router = Router();

// GET  /api/organizations
router.get('/', organizationsController.getAll);

// GET  /api/organizations/:id
router.get('/:id', organizationsController.getById);

// POST /api/organizations
router.post(
  '/',
  validate({
    body: {
      name: (v) => !v?.trim() && 'Name is required',
    },
  }),
  organizationsController.create
);

// PUT  /api/organizations/:id
router.put('/:id', organizationsController.update);

// DELETE /api/organizations/:id
router.delete('/:id', organizationsController.remove);

export default router;
