import { Router } from 'express';
import { validate } from '../middleware/validate.js';
import * as stocksController from '../controllers/stocksController.js';

const router = Router();

// GET  /api/stocks
router.get('/', stocksController.getAll);

// GET  /api/stocks/:id
router.get('/:id', stocksController.getById);

// POST /api/stocks
router.post(
  '/',
  validate({
    body: {
      symbol: (v) => !v?.trim() && 'Symbol is required',
      name:   (v) => !v?.trim() && 'Name is required',
      price:  (v) => {
        if (v === undefined || v === null || v === '') return 'Price is required';
        if (isNaN(Number(v)) || Number(v) < 0) return 'Price must be a non-negative number';
      },
    },
  }),
  stocksController.create
);

// PUT  /api/stocks/:id
router.put('/:id', stocksController.update);

// DELETE /api/stocks/:id
router.delete('/:id', stocksController.remove);

export default router;
