import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// ── Organizations ─────────────────────────────────────────
export const organizations = sqliteTable('organizations', {
  id:                     text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  name:                   text('name').notNull(),
  defaultLowStockThreshold: integer('default_low_stock_threshold').notNull().default(10),
  createdAt:              text('created_at').notNull().default(sql`(datetime('now'))`),
  updatedAt:              text('updated_at').notNull().default(sql`(datetime('now'))`),
});

// ── Users ─────────────────────────────────────────────────
export const users = sqliteTable('users', {
  id:             text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  name:           text('name').notNull(),
  email:          text('email').notNull().unique(),
  passwordHash:   text('password_hash').notNull(),
  organizationId: text('organization_id').notNull().references(() => organizations.id),
  createdAt:      text('created_at').notNull().default(sql`(datetime('now'))`),
  updatedAt:      text('updated_at').notNull().default(sql`(datetime('now'))`),
});

// ── Products ──────────────────────────────────────────────
export const products = sqliteTable('products', {
  id:                  text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  name:                text('name').notNull(),
  sku:                 text('sku').notNull().unique(),
  description:         text('description').notNull().default(''),
  quantity:            text('quantity').notNull().default('0'),
  lowStockThreshold:   integer('low_stock_threshold').notNull().default(10),
  costPrice:           real('cost_price').notNull().default(0),
  sellPrice:           real('sell_price').notNull().default(0),
  organizationId:      text('organization_id').notNull().references(() => organizations.id),
  createdAt:           text('created_at').notNull().default(sql`(datetime('now'))`),
  updatedAt:           text('updated_at').notNull().default(sql`(datetime('now'))`),
  updatedBy:           text('updated_by').references(() => users.id),
});
