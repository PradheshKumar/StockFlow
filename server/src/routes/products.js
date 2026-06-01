import { Router } from 'express';
import { validate } from '../middleware/validate.js';
import { authenticate } from '../middleware/authenticate.js';
import * as productsController from '../controllers/productsController.js';

const router = Router();

router.use(authenticate);

// GET /api/products
router.get('/', productsController.getAll);

// GET /api/products/:id
router.get('/:id', productsController.getById);

// POST /api/products
router.post(
  '/',
  validate({
    body: {
      name: (v) => !v?.trim() && 'Name is required',
      sku:  (v) => !v?.trim() && 'SKU is required',
      costPrice: (v) => {
        if (v === undefined || v === null || v === '') return 'Cost price is required';
        if (isNaN(Number(v)) || Number(v) < 0) return 'Cost price must be a non-negative number';
      },
      sellPrice: (v) => {
        if (v === undefined || v === null || v === '') return 'Sell price is required';
        if (isNaN(Number(v)) || Number(v) < 0) return 'Sell price must be a non-negative number';
      },
    },
  }),
  productsController.create
);

// PUT /api/products/:id
router.put('/:id', productsController.update);

// DELETE /api/products/:id
router.delete('/:id', productsController.remove);

// POST /api/products/:id/adjust-stock
router.post(
  '/:id/adjust-stock',
  validate({
    body: {
      adjustment: (v) => {
        if (v === undefined || v === null) return 'adjustment is required';
        if (isNaN(Number(v))) return 'adjustment must be a number';
      },
    },
  }),
  productsController.adjustStock
);

export default router;
