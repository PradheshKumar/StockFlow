import { db } from '../db/client.js';
import { users } from '../db/schema.js';
import { eq } from 'drizzle-orm';

// GET /api/users
export async function getAll(_req, res, next) {
  try {
    const rows = await db.select().from(users).orderBy(users.createdAt);
    res.json({ success: true, data: rows });
  } catch (err) { next(err); }
}

// GET /api/users/:id
export async function getById(req, res, next) {
  try {
    const [user] = await db.select().from(users).where(eq(users.id, req.params.id));
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, data: user });
  } catch (err) { next(err); }
}

// POST /api/users
export async function create(req, res, next) {
  try {
    const { name, email, passwordHash, organizationId } = req.body;
    const [created] = await db
      .insert(users)
      .values({ name, email, passwordHash, organizationId })
      .returning();
    res.status(201).json({ success: true, data: created });
  } catch (err) {
    if (err.message?.includes('UNIQUE')) {
      return res.status(409).json({ success: false, message: 'Email already exists' });
    }
    next(err);
  }
}

// PUT /api/users/:id
export async function update(req, res, next) {
  try {
    const { name, email, passwordHash } = req.body;
    const [updated] = await db
      .update(users)
      .set({
        ...(name         && { name }),
        ...(email        && { email }),
        ...(passwordHash && { passwordHash }),
        updatedAt: new Date().toISOString(),
      })
      .where(eq(users.id, req.params.id))
      .returning();

    if (!updated) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, data: updated });
  } catch (err) { next(err); }
}

// DELETE /api/users/:id
export async function remove(req, res, next) {
  try {
    const [deleted] = await db
      .delete(users)
      .where(eq(users.id, req.params.id))
      .returning();

    if (!deleted) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, message: 'User deleted', data: deleted });
  } catch (err) { next(err); }
}
