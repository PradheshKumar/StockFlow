import 'dotenv/config';
import { migrate } from 'drizzle-orm/libsql/migrator';
import { db, client } from './client.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const migrationsFolder = path.resolve(__dirname, '../../drizzle');

console.log('🔄 Running migrations from:', migrationsFolder);

await migrate(db, { migrationsFolder });
client.close();

console.log('✅ Migrations complete.');
