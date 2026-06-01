import { Router } from 'express';
import { validate } from '../middleware/validate.js';
import * as productsController from '../controllers/productsController.js';

const router = Router();

// GET  /api/products
router.get('/', productsController.getAll);

// GET  /api/products/:id
router.get('/:id', productsController.getById);

// POST /api/products
router.post(
  '/',
  validate({
    body: {
      name:           (v) => !v?.trim() && 'Name is required',
      sku:            (v) => !v?.trim() && 'SKU is required',
      organizationId: (v) => !v?.trim() && 'Organization ID is required',
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

// PUT  /api/products/:id
router.put('/:id', productsController.update);

// DELETE /api/products/:id
router.delete('/:id', productsController.remove);

export default router;
