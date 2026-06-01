import { defineConfig } from 'drizzle-kit';
import 'dotenv/config';
import path from 'path';

export default defineConfig({
  schema:    './src/db/schema.js',
  out:       './drizzle',
  dialect:   'sqlite',
  dbCredentials: {
    url: path.resolve(process.env.DATABASE_URL || './data/stockflow.db'),
  },
  verbose: true,
  strict:  true,
});
