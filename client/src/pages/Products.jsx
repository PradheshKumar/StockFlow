import { useEffect, useState, useCallback, useRef } from 'react';
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

function QuantityCell({ product, onSaved }) {
  const [pendingDelta, setPendingDelta] = useState(0);
  const [saving, setSaving] = useState(false);
  const onSavedRef = useRef(onSaved);
  onSavedRef.current = onSaved;

  const baseQty = parseInt(product.quantity, 10) || 0;

  useEffect(() => {
    if (pendingDelta === 0) return;
    const delta = pendingDelta;
    const timer = setTimeout(async () => {
      setSaving(true);
      try {
        const res = await productsApi.adjustStock(product.id, delta);
        setPendingDelta(0);
        onSavedRef.current(res.data, null);
      } catch (err) {
        setPendingDelta(0);
        onSavedRef.current(null, err.message);
      } finally {
        setSaving(false);
      }
    }, 800);
    return () => clearTimeout(timer);
  }, [pendingDelta, product.id]);

  const displayedQty = Math.max(0, baseQty + pendingDelta);

  return (
    <div className="flex items-center justify-end gap-1">
      <button
        type="button"
        onClick={() => setPendingDelta(d => d - 1)}
        disabled={saving}
        className="w-6 h-6 flex items-center justify-center rounded-md border border-outline-variant text-on-surface-variant hover:bg-surface-bright hover:text-primary transition-colors disabled:opacity-40"
      >
        <span className="material-symbols-outlined text-[14px]">remove</span>
      </button>
      <span className={`w-12 text-center text-body-md tabular-nums inline-flex items-center justify-center ${pendingDelta !== 0 ? 'text-primary font-semibold' : ''}`}>
        {saving
          ? <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>
          : displayedQty.toLocaleString()
        }
      </span>
      <button
        type="button"
        onClick={() => setPendingDelta(d => d + 1)}
        disabled={saving}
        className="w-6 h-6 flex items-center justify-center rounded-md border border-outline-variant text-on-surface-variant hover:bg-surface-bright hover:text-primary transition-colors disabled:opacity-40"
      >
        <span className="material-symbols-outlined text-[14px]">add</span>
      </button>
    </div>
  );
}

export default function Products() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');
  const [search, setSearch]     = useState('');
  const [deleting, setDeleting] = useState(null);
  const [adjustTarget, setAdjustTarget] = useState(null);
  const [adjustValue,  setAdjustValue]  = useState('');
  const [adjustNote,   setAdjustNote]   = useState('');
  const [adjusting,    setAdjusting]    = useState(false);
  const [toast, setToast] = useState(null);
  const toastTimerRef = useRef(null);

  function handleQuantitySaved(updatedProduct, errorMsg) {
    if (errorMsg) {
      setToast({ message: 'Failed to update quantity', type: 'error' });
    } else {
      setProducts(ps => ps.map(p => p.id === updatedProduct.id ? updatedProduct : p));
      setToast({ message: `Quantity updated to ${parseInt(updatedProduct.quantity, 10).toLocaleString()}` });
    }
    clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setToast(null), 3000);
  }

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

  async function handleAdjustStock(e) {
    e.preventDefault();
    const delta = parseInt(adjustValue, 10);
    if (!delta) return;
    setAdjusting(true);
    try {
      const res = await productsApi.adjustStock(adjustTarget.id, delta, adjustNote.trim() || undefined);
      setProducts(ps => ps.map(p => p.id === adjustTarget.id ? res.data : p));
      setAdjustTarget(null);
    } catch (err) {
      alert(err.message);
    } finally {
      setAdjusting(false);
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
                  <td className="px-md py-4">
                    <QuantityCell product={p} onSaved={handleQuantitySaved} />
                  </td>
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
                        onClick={() => { setAdjustTarget(p); setAdjustValue(''); setAdjustNote(''); }}
                        className="p-1.5 text-on-surface-variant hover:text-primary transition-colors"
                        title="Adjust stock"
                      >
                        <span className="material-symbols-outlined text-[20px]">swap_vert</span>
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

      {adjustTarget && (
        <div
          className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center"
          onClick={() => setAdjustTarget(null)}
        >
          <div className="bg-white rounded-2xl shadow-xl p-lg w-full max-w-sm" onClick={e => e.stopPropagation()}>
            <h2 className="text-title-md font-semibold mb-1">{adjustTarget.name}</h2>
            <p className="text-body-sm text-on-surface-variant mb-lg">
              Current quantity: {parseInt(adjustTarget.quantity, 10).toLocaleString()}
            </p>
            <form onSubmit={handleAdjustStock} className="flex flex-col gap-md">
              <div>
                <label className="text-label-md text-on-surface-variant mb-1 block">Adjustment</label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setAdjustValue(v => String((parseInt(v, 10) || 0) - 1))}
                    className="w-10 h-10 flex items-center justify-center rounded-xl border border-outline-variant text-on-surface-variant hover:bg-surface-bright hover:text-primary transition-colors text-xl font-medium"
                  >−</button>
                  <input
                    type="number"
                    value={adjustValue}
                    onChange={e => setAdjustValue(e.target.value)}
                    className="flex-1 px-4 py-3 bg-surface border border-outline-variant rounded-xl text-body-md text-center focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    placeholder="0"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setAdjustValue(v => String((parseInt(v, 10) || 0) + 1))}
                    className="w-10 h-10 flex items-center justify-center rounded-xl border border-outline-variant text-on-surface-variant hover:bg-surface-bright hover:text-primary transition-colors text-xl font-medium"
                  >+</button>
                </div>
              </div>
              <div>
                <label className="text-label-md text-on-surface-variant mb-1 block">Note (optional)</label>
                <input
                  type="text"
                  value={adjustNote}
                  onChange={e => setAdjustNote(e.target.value)}
                  className="w-full px-4 py-3 bg-surface border border-outline-variant rounded-xl text-body-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  placeholder="Reason for adjustment"
                />
              </div>
              <div className="flex gap-sm justify-end mt-sm">
                <button
                  type="button"
                  onClick={() => setAdjustTarget(null)}
                  className="px-5 py-2.5 rounded-xl text-label-md text-on-surface-variant hover:bg-surface-bright transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!adjustValue || isNaN(parseInt(adjustValue, 10)) || parseInt(adjustValue, 10) === 0 || adjusting}
                  className="bg-primary text-on-primary px-5 py-2.5 rounded-xl text-label-md flex items-center gap-2 hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
                >
                  {adjusting
                    ? <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>
                    : null}
                  Apply
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-label-md text-white pointer-events-none
          ${toast.type === 'error' ? 'bg-red-600' : 'bg-primary'}`}>
          <span className="material-symbols-outlined text-[18px]">
            {toast.type === 'error' ? 'error' : 'check_circle'}
          </span>
          {toast.message}
        </div>
      )}
    </AppLayout>
  );
}
