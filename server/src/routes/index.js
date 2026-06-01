import { Router } from 'express';
import authRouter      from './auth.js';
import productsRouter  from './products.js';
import dashboardRouter from './dashboard.js';
import settingsRouter  from './settings.js';

const router = Router();

router.use('/auth',      authRouter);
router.use('/products',  productsRouter);
router.use('/dashboard', dashboardRouter);
router.use('/settings',  settingsRouter);

export default router;
