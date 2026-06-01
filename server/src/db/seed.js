import 'dotenv/config';
import { db, client } from './client.js';
import { organizations, users, products } from './schema.js';

async function seed() {
  console.log('🌱 Seeding database...');

  await db.delete(products);
  await db.delete(users);
  await db.delete(organizations);

  const [org] = await db
    .insert(organizations)
    .values({ name: 'Acme Corp', defaultLowStockThreshold: 10 })
    .returning();

  const [admin] = await db
    .insert(users)
    .values({
      name:           'Admin User',
      email:          'admin@stockflow.dev',
      passwordHash:   '$2b$10$placeholder_hash',
      organizationId: org.id,
    })
    .returning();

  await db.insert(products).values([
    {
      name:              'Wireless Mouse',
      sku:               'WM-001',
      description:       'Ergonomic wireless mouse',
      quantity:          '50',
      lowStockThreshold: 10,
      costPrice:         15.00,
      sellPrice:         29.99,
      organizationId:    org.id,
      updatedBy:         admin.id,
    },
    {
      name:              'USB-C Cable',
      sku:               'UC-002',
      description:       'High-speed USB-C charging cable',
      quantity:          '200',
      lowStockThreshold: 20,
      costPrice:         5.00,
      sellPrice:         12.99,
      organizationId:    org.id,
      updatedBy:         admin.id,
    },
    {
      name:              'Mechanical Keyboard',
      sku:               'MK-003',
      description:       'Tenkeyless mechanical keyboard',
      quantity:          '8',
      lowStockThreshold: 10,
      costPrice:         45.00,
      sellPrice:         99.99,
      organizationId:    org.id,
      updatedBy:         admin.id,
    },
  ]);

  console.log('✅ Seed complete.');
  client.close();
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  client.close();
  process.exit(1);
});
