import { db } from '../db/client.js';
import { stocks } from '../db/schema.js';
import { eq, like } from 'drizzle-orm';

// GET /api/stocks?search=AAPL
export async function getAll(req, res, next) {
  try {
    const { search } = req.query;
    let query = db.select().from(stocks);
    if (search) {
      query = query.where(like(stocks.symbol, `%${search.toUpperCase()}%`));
    }
    const rows = await query.orderBy(stocks.symbol);
    res.json({ success: true, data: rows });
  } catch (err) { next(err); }
}

// GET /api/stocks/:id
export async function getById(req, res, next) {
  try {
    const [stock] = await db.select().from(stocks).where(eq(stocks.id, Number(req.params.id)));
    if (!stock) return res.status(404).json({ success: false, message: 'Stock not found' });
    res.json({ success: true, data: stock });
  } catch (err) { next(err); }
}

// POST /api/stocks
export async function create(req, res, next) {
  try {
    const { symbol, name, price } = req.body;
    const [created] = await db
      .insert(stocks)
      .values({ symbol: symbol.toUpperCase(), name, price: Number(price) })
      .returning();
    res.status(201).json({ success: true, data: created });
  } catch (err) {
    if (err.message?.includes('UNIQUE')) {
      return res.status(409).json({ success: false, message: 'Stock symbol already exists' });
    }
    next(err);
  }
}

// PUT /api/stocks/:id
export async function update(req, res, next) {
  try {
    const { name, price } = req.body;
    const [updated] = await db
      .update(stocks)
      .set({
        ...(name  && { name }),
        ...(price !== undefined && { price: Number(price) }),
        updatedAt: new Date().toISOString(),
      })
      .where(eq(stocks.id, Number(req.params.id)))
      .returning();

    if (!updated) return res.status(404).json({ success: false, message: 'Stock not found' });
    res.json({ success: true, data: updated });
  } catch (err) { next(err); }
}

// DELETE /api/stocks/:id
export async function remove(req, res, next) {
  try {
    const [deleted] = await db
      .delete(stocks)
      .where(eq(stocks.id, Number(req.params.id)))
      .returning();

    if (!deleted) return res.status(404).json({ success: false, message: 'Stock not found' });
    res.json({ success: true, message: 'Stock deleted', data: deleted });
  } catch (err) { next(err); }
}
