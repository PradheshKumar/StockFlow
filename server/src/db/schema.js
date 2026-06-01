import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// ── Users ─────────────────────────────────────────────────
export const users = sqliteTable('users', {
  id:        integer('id').primaryKey({ autoIncrement: true }),
  name:      text('name').notNull(),
  email:     text('email').notNull().unique(),
  createdAt: text('created_at').notNull().default(sql`(datetime('now'))`),
  updatedAt: text('updated_at').notNull().default(sql`(datetime('now'))`),
});

// ── Stocks ────────────────────────────────────────────────
export const stocks = sqliteTable('stocks', {
  id:        integer('id').primaryKey({ autoIncrement: true }),
  symbol:    text('symbol').notNull().unique(),
  name:      text('name').notNull(),
  price:     real('price').notNull().default(0),
  createdAt: text('created_at').notNull().default(sql`(datetime('now'))`),
  updatedAt: text('updated_at').notNull().default(sql`(datetime('now'))`),
});

// ── Portfolio ─────────────────────────────────────────────
export const portfolio = sqliteTable('portfolio', {
  id:        integer('id').primaryKey({ autoIncrement: true }),
  userId:    integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  stockId:   integer('stock_id').notNull().references(() => stocks.id, { onDelete: 'cascade' }),
  quantity:  real('quantity').notNull().default(0),
  avgCost:   real('avg_cost').notNull().default(0),
  createdAt: text('created_at').notNull().default(sql`(datetime('now'))`),
  updatedAt: text('updated_at').notNull().default(sql`(datetime('now'))`),
});
