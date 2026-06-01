import { db } from '../db/client.js';
import { organizations } from '../db/schema.js';
import { eq } from 'drizzle-orm';

// GET /api/settings
export async function getSettings(req, res, next) {
  try {
    const [org] = await db
      .select()
      .from(organizations)
      .where(eq(organizations.id, req.user.organizationId));

    if (!org) return res.status(404).json({ success: false, message: 'Organization not found' });
    res.json({ success: true, data: org });
  } catch (err) { next(err); }
}

// PUT /api/settings
export async function updateSettings(req, res, next) {
  try {
    const { defaultLowStockThreshold } = req.body;
    const [updated] = await db
      .update(organizations)
      .set({
        ...(defaultLowStockThreshold !== undefined && { defaultLowStockThreshold }),
        updatedAt: new Date().toISOString(),
      })
      .where(eq(organizations.id, req.user.organizationId))
      .returning();

    if (!updated) return res.status(404).json({ success: false, message: 'Organization not found' });
    res.json({ success: true, data: updated });
  } catch (err) { next(err); }
}
