import { Router } from 'express';
import usersRouter         from './users.js';
import productsRouter      from './products.js';
import organizationsRouter from './organizations.js';

const router = Router();

router.use('/users',         usersRouter);
router.use('/products',      productsRouter);
router.use('/organizations', organizationsRouter);

/** Quick sanity check */
router.get('/', (_req, res) =>
  res.json({ message: 'StockFlow API v1', docs: '/api' })
);

export default router;
