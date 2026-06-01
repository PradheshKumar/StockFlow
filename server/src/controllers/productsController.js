import { db } from '../db/client.js';
import { products } from '../db/schema.js';
import { eq, like } from 'drizzle-orm';

// GET /api/products?search=mouse
export async function getAll(req, res, next) {
  try {
    const { search } = req.query;
    let query = db.select().from(products);
    if (search) {
      query = query.where(like(products.name, `%${search}%`));
    }
    const rows = await query.orderBy(products.name);
    res.json({ success: true, data: rows });
  } catch (err) { next(err); }
}

// GET /api/products/:id
export async function getById(req, res, next) {
  try {
    const [product] = await db.select().from(products).where(eq(products.id, req.params.id));
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, data: product });
  } catch (err) { next(err); }
}

// POST /api/products
export async function create(req, res, next) {
  try {
    const { name, sku, description, quantity, lowStockThreshold, costPrice, sellPrice, organizationId, updatedBy } = req.body;
    const [created] = await db
      .insert(products)
      .values({ name, sku, description, quantity, lowStockThreshold, costPrice, sellPrice, organizationId, updatedBy })
      .returning();
    res.status(201).json({ success: true, data: created });
  } catch (err) {
    if (err.message?.includes('UNIQUE')) {
      return res.status(409).json({ success: false, message: 'SKU already exists' });
    }
    next(err);
  }
}

// PUT /api/products/:id
export async function update(req, res, next) {
  try {
    const { name, sku, description, quantity, lowStockThreshold, costPrice, sellPrice, updatedBy } = req.body;
    const [updated] = await db
      .update(products)
      .set({
        ...(name              !== undefined && { name }),
        ...(sku               !== undefined && { sku }),
        ...(description       !== undefined && { description }),
        ...(quantity          !== undefined && { quantity }),
        ...(lowStockThreshold !== undefined && { lowStockThreshold }),
        ...(costPrice         !== undefined && { costPrice }),
        ...(sellPrice         !== undefined && { sellPrice }),
        ...(updatedBy         !== undefined && { updatedBy }),
        updatedAt: new Date().toISOString(),
      })
      .where(eq(products.id, req.params.id))
      .returning();

    if (!updated) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, data: updated });
  } catch (err) { next(err); }
}

// DELETE /api/products/:id
export async function remove(req, res, next) {
  try {
    const [deleted] = await db
      .delete(products)
      .where(eq(products.id, req.params.id))
      .returning();

    if (!deleted) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, message: 'Product deleted', data: deleted });
  } catch (err) { next(err); }
}
