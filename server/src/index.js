import 'dotenv/config';

if (!process.env.JWT_SECRET) {
  console.error('FATAL: JWT_SECRET environment variable is not set. Refusing to start.');
  process.exit(1);
}

import app from './app.js';

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`\nStockFlow API running on http://localhost:${PORT}`);
  console.log(`  Environment : ${process.env.NODE_ENV}`);
  console.log(`  Database    : ${process.env.DATABASE_URL}\n`);
});
