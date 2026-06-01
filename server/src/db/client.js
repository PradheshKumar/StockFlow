import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from './schema.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Resolve absolute path for the SQLite file
const dbPath = path.resolve(
  __dirname, '../../',
  process.env.DATABASE_URL || './data/stockflow.db'
);

// Ensure the data directory exists
fs.mkdirSync(path.dirname(dbPath), { recursive: true });

const client = createClient({ url: `file:${dbPath}` });

export const db = drizzle(client, { schema });
export { client };
