import { defineConfig } from 'drizzle-kit';
import 'dotenv/config';
import path from 'path';

const dbPath = path.resolve(process.env.DATABASE_URL || './data/stockflow.db');

export default defineConfig({
  schema:  './src/db/schema.js',
  out:     './drizzle',
  dialect: 'sqlite',
  dbCredentials: {
    url: `file:${dbPath}`,
  },
  verbose: true,
  strict:  true,
});
