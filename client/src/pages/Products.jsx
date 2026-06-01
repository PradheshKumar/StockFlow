import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import TopBar from '../components/TopBar';
import { productsApi } from '../lib/api';

function getStatus(product) {
  const qty = parseInt(product.quantity, 10) || 0;
  if (qty === 0) return 'out';
  if (qty <= product.lowStockThreshold) return 'low-stock';
  return 'in-stock';
}

function StatusBadge({ product }) {
  const status = getStatus(product);
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
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');
  const [search, setSearch]     = useState('');
  const [deleting, setDeleting] = useState(null);

  const load = useCallback((q = '') => {
    setLoading(true);
    productsApi.getAll(q)
      .then(res => setProducts(res.data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => load(search), 300);
    return () => clearTimeout(t);
  }, [search, load]);

  async function handleDelete(id) {
    if (!confirm('Delete this product? This cannot be undone.')) return;
    setDeleting(id);
    try {
      await productsApi.remove(id);
      setProducts(ps => ps.filter(p => p.id !== id));
    } catch (err) {
      alert(err.message);
    } finally {
      setDeleting(null);
    }
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

        {error && (
          <div className="px-lg py-md bg-error-container text-on-error-container rounded-xl flex items-center gap-2">
            <span className="material-symbols-outlined">error</span>
            {error}
          </div>
        )}

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
              {loading && (
                <tr>
                  <td colSpan={6} className="px-md py-xl text-center text-on-surface-variant">
                    <div className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Loading products…
                    </div>
                  </td>
                </tr>
              )}
              {!loading && products.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-md py-xl text-center text-on-surface-variant text-body-md">
                    {search ? 'No products match your search.' : 'No products yet. Add your first one!'}
                  </td>
                </tr>
              )}
              {!loading && products.map(p => (
                <tr key={p.id} className="hover:bg-surface-bright transition-colors group">
                  <td className="px-md py-4 text-body-md font-semibold">{p.name}</td>
                  <td className="px-md py-4 font-mono text-mono-sm text-on-surface-variant">{p.sku}</td>
                  <td className="px-md py-4 text-body-md text-right">{parseInt(p.quantity, 10).toLocaleString()}</td>
                  <td className="px-md py-4 text-body-md text-right">${Number(p.sellPrice).toFixed(2)}</td>
                  <td className="px-md py-4"><StatusBadge product={p} /></td>
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
                        disabled={deleting === p.id}
                        className="p-1.5 text-on-surface-variant hover:text-error transition-colors disabled:opacity-50"
                        title="Delete"
                      >
                        {deleting === p.id
                          ? <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>
                          : <span className="material-symbols-outlined text-[20px]">delete</span>
                        }
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {!loading && (
          <div className="flex items-center justify-between text-label-md text-on-surface-variant/60 px-sm">
            <span>Showing {products.length} product{products.length !== 1 ? 's' : ''}{search ? ` matching "${search}"` : ''}</span>
            <span className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px]">info</span>
              Last updated: Just now
            </span>
          </div>
        )}
      </main>
    </AppLayout>
  );
}
