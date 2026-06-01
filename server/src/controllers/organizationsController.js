import { db } from '../db/client.js';
import { organizations } from '../db/schema.js';
import { eq } from 'drizzle-orm';

// GET /api/organizations
export async function getAll(_req, res, next) {
  try {
    const rows = await db.select().from(organizations).orderBy(organizations.name);
    res.json({ success: true, data: rows });
  } catch (err) { next(err); }
}

// GET /api/organizations/:id
export async function getById(req, res, next) {
  try {
    const [org] = await db.select().from(organizations).where(eq(organizations.id, req.params.id));
    if (!org) return res.status(404).json({ success: false, message: 'Organization not found' });
    res.json({ success: true, data: org });
  } catch (err) { next(err); }
}

// POST /api/organizations
export async function create(req, res, next) {
  try {
    const { name, defaultLowStockThreshold } = req.body;
    const [created] = await db
      .insert(organizations)
      .values({ name, ...(defaultLowStockThreshold !== undefined && { defaultLowStockThreshold }) })
      .returning();
    res.status(201).json({ success: true, data: created });
  } catch (err) { next(err); }
}

// PUT /api/organizations/:id
export async function update(req, res, next) {
  try {
    const { name, defaultLowStockThreshold } = req.body;
    const [updated] = await db
      .update(organizations)
      .set({
        ...(name                       && { name }),
        ...(defaultLowStockThreshold !== undefined && { defaultLowStockThreshold }),
        updatedAt: new Date().toISOString(),
      })
      .where(eq(organizations.id, req.params.id))
      .returning();

    if (!updated) return res.status(404).json({ success: false, message: 'Organization not found' });
    res.json({ success: true, data: updated });
  } catch (err) { next(err); }
}

// DELETE /api/organizations/:id
export async function remove(req, res, next) {
  try {
    const [deleted] = await db
      .delete(organizations)
      .where(eq(organizations.id, req.params.id))
      .returning();

    if (!deleted) return res.status(404).json({ success: false, message: 'Organization not found' });
    res.json({ success: true, message: 'Organization deleted', data: deleted });
  } catch (err) { next(err); }
}
