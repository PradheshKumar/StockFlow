import { Router } from 'express';
import { validate } from '../middleware/validate.js';
import * as usersController from '../controllers/usersController.js';

const router = Router();

// GET  /api/users
router.get('/', usersController.getAll);

// GET  /api/users/:id
router.get('/:id', usersController.getById);

// POST /api/users
router.post(
  '/',
  validate({
    body: {
      name:  (v) => !v?.trim() && 'Name is required',
      email: (v) => {
        if (!v?.trim()) return 'Email is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return 'Email is invalid';
      },
    },
  }),
  usersController.create
);

// PUT  /api/users/:id
router.put('/:id', usersController.update);

// DELETE /api/users/:id
router.delete('/:id', usersController.remove);

export default router;
