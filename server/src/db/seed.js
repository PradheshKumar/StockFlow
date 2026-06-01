/**
 * seed.js — Populate the DB with sample data for development.
 *
 * Run with:  node src/db/seed.js  (from the server workspace)
 */

import 'dotenv/config';
import { db, sqlite } from './client.js';
import { users, stocks } from './schema.js';

async function seed() {
  console.log('🌱 Seeding database...');

  await db.delete(users);
  await db.delete(stocks);

  await db.insert(users).values([
    { name: 'Alice Trader', email: 'alice@stockflow.dev' },
    { name: 'Bob Investor', email: 'bob@stockflow.dev' },
  ]);

  await db.insert(stocks).values([
    { symbol: 'AAPL',  name: 'Apple Inc.',        price: 189.30 },
    { symbol: 'MSFT',  name: 'Microsoft Corp.',    price: 415.20 },
    { symbol: 'GOOGL', name: 'Alphabet Inc.',      price: 175.50 },
    { symbol: 'TSLA',  name: 'Tesla Inc.',         price: 177.80 },
    { symbol: 'NVDA',  name: 'NVIDIA Corporation', price: 875.00 },
  ]);

  console.log('✅ Seed complete.');
  sqlite.close();
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  sqlite.close();
  process.exit(1);
});
