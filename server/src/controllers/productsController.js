import { db } from '../db/client.js';
import { products } from '../db/schema.js';
import { eq, like, or, and } from 'drizzle-orm';

// GET /api/products?search=term
export async function getAll(req, res, next) {
  try {
    const { search } = req.query;
    const { organizationId } = req.user;

    let query = db.select().from(products).where(eq(products.organizationId, organizationId));
    if (search) {
      query = db
        .select()
        .from(products)
        .where(
          and(
            eq(products.organizationId, organizationId),
            or(like(products.name, `%${search}%`), like(products.sku, `%${search}%`))
          )
        );
    }
    const rows = await query.orderBy(products.name);
    res.json({ success: true, data: rows });
  } catch (err) { next(err); }
}

// GET /api/products/:id
export async function getById(req, res, next) {
  try {
    const [product] = await db
      .select()
      .from(products)
      .where(and(eq(products.id, req.params.id), eq(products.organizationId, req.user.organizationId)));
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, data: product });
  } catch (err) { next(err); }
}

// POST /api/products
export async function create(req, res, next) {
  try {
    const { name, sku, description, quantity, lowStockThreshold, costPrice, sellPrice } = req.body;
    const { organizationId, userId } = req.user;

    const [created] = await db
      .insert(products)
      .values({ name, sku, description, quantity, lowStockThreshold, costPrice, sellPrice, organizationId, updatedBy: userId })
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
    const { name, sku, description, quantity, lowStockThreshold, costPrice, sellPrice } = req.body;
    const { organizationId, userId } = req.user;

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
        updatedBy: userId,
        updatedAt: new Date().toISOString(),
      })
      .where(and(eq(products.id, req.params.id), eq(products.organizationId, organizationId)))
      .returning();

    if (!updated) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, data: updated });
  } catch (err) {
    if (err.message?.includes('UNIQUE')) {
      return res.status(409).json({ success: false, message: 'SKU already exists' });
    }
    next(err);
  }
}

// DELETE /api/products/:id
export async function remove(req, res, next) {
  try {
    const [deleted] = await db
      .delete(products)
      .where(and(eq(products.id, req.params.id), eq(products.organizationId, req.user.organizationId)))
      .returning();

    if (!deleted) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, message: 'Product deleted', data: deleted });
  } catch (err) { next(err); }
}

// POST /api/products/:id/adjust-stock
export async function adjustStock(req, res, next) {
  try {
    const { adjustment } = req.body;
    const { organizationId, userId } = req.user;

    const [product] = await db
      .select()
      .from(products)
      .where(and(eq(products.id, req.params.id), eq(products.organizationId, organizationId)));

    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    const currentQty = parseInt(product.quantity, 10) || 0;
    const newQty = Math.max(0, currentQty + adjustment);

    const [updated] = await db
      .update(products)
      .set({ quantity: String(newQty), updatedBy: userId, updatedAt: new Date().toISOString() })
      .where(eq(products.id, req.params.id))
      .returning();

    res.json({ success: true, data: updated });
  } catch (err) { next(err); }
}
