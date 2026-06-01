import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../db/client.js';
import { users, organizations } from '../db/schema.js';
import { eq } from 'drizzle-orm';

function signToken(userId, organizationId) {
  return jwt.sign(
    { userId, organizationId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

// POST /api/auth/signup
export async function signup(req, res, next) {
  try {
    const { name, email, password, organizationName } = req.body;

    const [existingUser] = await db.select().from(users).where(eq(users.email, email));
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'Email already in use' });
    }

    const [org] = await db
      .insert(organizations)
      .values({ name: organizationName })
      .returning();

    const passwordHash = await bcrypt.hash(password, 10);
    const [user] = await db
      .insert(users)
      .values({ name, email, passwordHash, organizationId: org.id })
      .returning();

    const token = signToken(user.id, org.id);
    const { passwordHash: _, ...safeUser } = user;
    res.status(201).json({ success: true, token, user: safeUser });
  } catch (err) { next(err); }
}

// POST /api/auth/login
export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    const [user] = await db.select().from(users).where(eq(users.email, email));
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = signToken(user.id, user.organizationId);
    const { passwordHash: _, ...safeUser } = user;
    res.json({ success: true, token, user: safeUser });
  } catch (err) { next(err); }
}

// POST /api/auth/logout
export function logout(_req, res) {
  res.json({ success: true, message: 'Logged out' });
}

// GET /api/auth/me
export async function me(req, res, next) {
  try {
    const [user] = await db.select().from(users).where(eq(users.id, req.user.userId));
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    const { passwordHash: _, ...safeUser } = user;
    res.json({ success: true, user: safeUser });
  } catch (err) { next(err); }
}
