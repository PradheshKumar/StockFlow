import { Router } from 'express';
import { validate } from '../middleware/validate.js';
import { authenticate } from '../middleware/authenticate.js';
import * as authController from '../controllers/authController.js';

const router = Router();

// POST /api/auth/signup
router.post(
  '/signup',
  validate({
    body: {
      name:             (v) => !v?.trim() && 'Name is required',
      email:            (v) => !v?.trim() && 'Email is required',
      password:         (v) => (!v || v.length < 6) && 'Password must be at least 6 characters',
      organizationName: (v) => !v?.trim() && 'Organization name is required',
    },
  }),
  authController.signup
);

// POST /api/auth/login
router.post(
  '/login',
  validate({
    body: {
      email:    (v) => !v?.trim() && 'Email is required',
      password: (v) => !v && 'Password is required',
    },
  }),
  authController.login
);

// POST /api/auth/logout
router.post('/logout', authController.logout);

// GET /api/auth/me
router.get('/me', authenticate, authController.me);

export default router;
