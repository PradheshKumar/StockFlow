import { db } from '../db/client.js';
import { products } from '../db/schema.js';
import { eq, sql } from 'drizzle-orm';

// GET /api/dashboard
export async function getSummary(req, res, next) {
  try {
    const { organizationId } = req.user;

    const allProducts = await db
      .select()
      .from(products)
      .where(eq(products.organizationId, organizationId));

    const totalProducts = allProducts.length;
    const totalInventory = allProducts.reduce((sum, p) => sum + (parseInt(p.quantity, 10) || 0), 0);
    const lowStockProducts = allProducts.filter(
      (p) => (parseInt(p.quantity, 10) || 0) <= p.lowStockThreshold
    );

    res.json({ success: true, data: { totalProducts, totalInventory, lowStockProducts } });
  } catch (err) { next(err); }
}
