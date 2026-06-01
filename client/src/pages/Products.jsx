import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import TopBar from '../components/TopBar';

const MOCK_PRODUCTS = [
  { id: 1, name: 'Wireless Headphones Pro', sku: 'WH-PRO-001', qty: 1240, price: 249.00, status: 'in-stock' },
  { id: 2, name: 'Mechanical Keyboard RGB',  sku: 'KB-MECH-99', qty: 12,   price: 129.50, status: 'low-stock' },
  { id: 3, name: 'Ergonomic Mouse Z',         sku: 'MS-ERG-042', qty: 0,    price: 89.00,  status: 'out' },
  { id: 4, name: '4K Monitor 27"',            sku: 'MN-4K-27V2', qty: 45,   price: 499.00, status: 'in-stock' },
  { id: 5, name: 'Thunderbolt Dock Hub',      sku: 'HB-TB3-X1',  qty: 8,    price: 199.99, status: 'low-stock' },
  { id: 6, name: 'Webcam Ultra HD',           sku: 'WC-UHD-500', qty: 312,  price: 159.00, status: 'in-stock' },
];

function StatusBadge({ status }) {
  const map = {
    'in-stock':  'bg-green-100 text-green-800 border-green-200',
    'low-stock': 'bg-amber-100 text-amber-800 border-amber-200',
    'out':       'bg-red-100   text-red-800   border-red-200',
  };
  const labels = { 'in-stock': 'In-stock', 'low-stock': 'Low-stock', 'out': 'Out' };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${map[status]}`}>
      {labels[status]}
    </span>
  );
}

export default function Products() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [products, setProducts] = useState(MOCK_PRODUCTS);

  const filtered = products.filter(p =>
    !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase())
  );

  function handleDelete(id) {
    setProducts(ps => ps.filter(p => p.id !== id));
  }

  return (
    <AppLayout>
      <TopBar title="Products" />

      <main className="p-lg flex flex-col gap-lg max-w-[1440px] mx-auto w-full">
        <div className="flex items-center justify-between gap-md">
          <div className="relative flex-1 max-w-md group">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors">search</span>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-surface border border-outline-variant rounded-xl text-body-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-on-surface-variant/50"
              placeholder="Search by product name or SKU"
              type="text"
            />
          </div>
          <button
            onClick={() => navigate('/products/new')}
            className="bg-primary text-on-primary py-3 px-6 rounded-xl text-label-md flex items-center gap-2 hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-95"
          >
            <span className="material-symbols-outlined ms-filled text-[20px]">add_circle</span>
            Add Product
          </button>
        </div>

        <div className="bg-white border border-outline-variant rounded-xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-bright border-b border-outline-variant">
                <th className="px-md py-4 text-label-md text-on-surface-variant uppercase tracking-wider">Name</th>
                <th className="px-md py-4 text-label-md text-on-surface-variant uppercase tracking-wider">SKU</th>
                <th className="px-md py-4 text-label-md text-on-surface-variant uppercase tracking-wider text-right">Quantity</th>
                <th className="px-md py-4 text-label-md text-on-surface-variant uppercase tracking-wider text-right">Selling Price</th>
                <th className="px-md py-4 text-label-md text-on-surface-variant uppercase tracking-wider">Status</th>
                <th className="px-md py-4 text-label-md text-on-surface-variant uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/30">
              {filtered.map(p => (
                <tr key={p.id} className="hover:bg-surface-bright transition-colors group">
                  <td className="px-md py-4 text-body-md font-semibold">{p.name}</td>
                  <td className="px-md py-4 font-mono text-mono-sm text-on-surface-variant">{p.sku}</td>
                  <td className="px-md py-4 text-body-md text-right">{p.qty.toLocaleString()}</td>
                  <td className="px-md py-4 text-body-md text-right">${p.price.toFixed(2)}</td>
                  <td className="px-md py-4"><StatusBadge status={p.status} /></td>
                  <td className="px-md py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => navigate(`/products/${p.id}/edit`)}
                        className="p-1.5 text-on-surface-variant hover:text-primary transition-colors"
                        title="Edit"
                      >
                        <span className="material-symbols-outlined text-[20px]">edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="p-1.5 text-on-surface-variant hover:text-error transition-colors"
                        title="Delete"
                      >
                        <span className="material-symbols-outlined text-[20px]">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-md py-12 text-center text-on-surface-variant text-body-md">
                    No products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between text-label-md text-on-surface-variant/60 px-sm">
          <span>Showing 1–{filtered.length} of {products.length} products</span>
          <span className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px]">info</span>
            Last updated: Just now
          </span>
        </div>
      </main>
    </AppLayout>
  );
}
