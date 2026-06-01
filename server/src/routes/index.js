import { Router } from 'express';
import usersRouter  from './users.js';
import stocksRouter from './stocks.js';

const router = Router();

router.use('/users',  usersRouter);
router.use('/stocks', stocksRouter);

/** Quick sanity check */
router.get('/', (_req, res) =>
  res.json({ message: 'StockFlow API v1', docs: '/api' })
);

export default router;
