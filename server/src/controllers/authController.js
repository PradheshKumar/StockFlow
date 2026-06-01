import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../db/client.js';
import { users, organizations } from '../db/schema.js';
import { eq } from 'drizzle-orm';

// Used to keep login timing constant whether or not the email exists,
// preventing timing-based user enumeration.
const DUMMY_HASH = '$2a$10$abcdefghijklmnopqrstuuABCDEFGHIJKLMNOPQRSTUVWXYZ012345';

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
    const { name, password, organizationName } = req.body;
    const email = req.body.email.trim().toLowerCase();

    const [existingUser] = await db.select().from(users).where(eq(users.email, email));
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'Email already in use' });
    }

    const orgName = organizationName.trim();
    let [org] = await db.select().from(organizations).where(eq(organizations.name, orgName));
    if (!org) {
      [org] = await db.insert(organizations).values({ name: orgName }).returning();
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const [user] = await db
      .insert(users)
      .values({ name: name.trim(), email, passwordHash, organizationId: org.id })
      .returning();

    const token = signToken(user.id, org.id);
    const { passwordHash: _, ...safeUser } = user;
    res.status(201).json({ success: true, token, user: safeUser });
  } catch (err) { next(err); }
}

// POST /api/auth/login
export async function login(req, res, next) {
  try {
    const email = req.body.email.trim().toLowerCase();
    const { password } = req.body;

    const [user] = await db.select().from(users).where(eq(users.email, email));

    // Always run bcrypt to prevent timing-based email enumeration
    const hashToCompare = user ? user.passwordHash : DUMMY_HASH;
    const match = await bcrypt.compare(password, hashToCompare);

    if (!user || !match) {
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
