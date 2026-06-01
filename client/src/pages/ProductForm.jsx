import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import TopBar from '../components/TopBar';
import { productsApi } from '../lib/api';

const EMPTY = { name: '', sku: '', description: '', quantity: '0', lowStockThreshold: 10, costPrice: '', sellPrice: '' };

export default function ProductForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isNew = id === undefined || id === 'new';

  const [form, setForm]         = useState(EMPTY);
  const [loading, setLoading]   = useState(!isNew);
  const [saving, setSaving]     = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError]       = useState('');

  useEffect(() => {
    if (isNew) return;
    productsApi.getById(id)
      .then(res => {
        const p = res.data;
        setForm({
          name:              p.name,
          sku:               p.sku,
          description:       p.description || '',
          quantity:          p.quantity,
          lowStockThreshold: p.lowStockThreshold,
          costPrice:         String(p.costPrice),
          sellPrice:         String(p.sellPrice),
        });
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [id, isNew]);

  function set(field) {
    return e => setForm(f => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const payload = {
        name:              form.name.trim(),
        sku:               form.sku.trim(),
        description:       form.description.trim(),
        quantity:          String(parseInt(form.quantity, 10) || 0),
        lowStockThreshold: parseInt(form.lowStockThreshold, 10) || 0,
        costPrice:         Number(form.costPrice),
        sellPrice:         Number(form.sellPrice),
      };
      if (isNew) {
        await productsApi.create(payload);
      } else {
        await productsApi.update(id, payload);
      }
      navigate('/products');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm('Permanently delete this product? This cannot be undone.')) return;
    setDeleting(true);
    try {
      await productsApi.remove(id);
      navigate('/products');
    } catch (err) {
      setError(err.message);
      setDeleting(false);
    }
  }

  const qty = parseInt(form.quantity, 10) || 0;
  const threshold = parseInt(form.lowStockThreshold, 10) || 0;
  const stockStatus = qty === 0 ? 'Out-of-Stock' : qty <= threshold ? 'Low-Stock' : 'In-Stock';
  const statusColor = stockStatus === 'In-Stock' ? 'bg-emerald-500' : stockStatus === 'Low-Stock' ? 'bg-amber-500' : 'bg-red-500';

  if (loading) {
    return (
      <AppLayout>
        <TopBar title={isNew ? 'Add Product' : 'Edit Product'} />
        <div className="flex items-center justify-center py-xl text-on-surface-variant">
          <svg className="animate-spin h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Loading product…
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <TopBar title={isNew ? 'Add Product' : 'Edit Product'} />

      <main className="min-h-screen">
        <div className="max-w-4xl mx-auto p-lg">
          <nav className="flex items-center gap-sm mb-lg">
            <button onClick={() => navigate('/products')} className="text-primary text-label-md hover:underline flex items-center gap-xs">
              <span className="material-symbols-outlined text-[16px]">arrow_back</span>
              Back to Inventory
            </button>
          </nav>

          {error && (
            <div className="mb-lg px-lg py-md bg-error-container text-on-error-container rounded-xl flex items-center gap-2">
              <span className="material-symbols-outlined">error</span>
              {error}
            </div>
          )}

          <div className="bg-white border border-outline-variant rounded-xl p-lg space-y-lg shadow-sm">
            <div className="border-b border-outline-variant pb-md">
              <h2 className="text-headline-md text-on-surface">General Information</h2>
              <p className="text-body-md text-on-surface-variant mt-xs">
                {isNew ? 'Add a new product to your inventory.' : 'Update the core details of your inventory item.'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
                <div className="space-y-xs">
                  <label className="text-label-md text-on-surface-variant">Product Name *</label>
                  <input value={form.name} onChange={set('name')} required placeholder="e.g. Industrial Drill"
                    className="w-full rounded-lg px-md py-sm text-body-md bg-white border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all"
                  />
                </div>
                <div className="space-y-xs">
                  <label className="text-label-md text-on-surface-variant">SKU *</label>
                  <input value={form.sku} onChange={set('sku')} required placeholder="e.g. STK-12345"
                    className="w-full rounded-lg px-md py-sm font-mono text-mono-sm bg-surface-container-low border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-xs">
                <label className="text-label-md text-on-surface-variant">Description</label>
                <textarea value={form.description} onChange={set('description')} rows={4}
                  placeholder="Provide detailed specifications of the product..."
                  className="w-full rounded-lg px-md py-sm text-body-md bg-white border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-lg pt-md border-t border-outline-variant">
                <div className="space-y-xs">
                  <label className="text-label-md text-on-surface-variant">Quantity On Hand</label>
                  <input type="number" min="0" value={form.quantity} onChange={set('quantity')}
                    className="w-full rounded-lg px-md py-sm text-body-md bg-white border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all"
                  />
                </div>
                <div className="space-y-xs">
                  <label className="text-label-md text-on-surface-variant">Low Stock Threshold</label>
                  <input type="number" min="0" value={form.lowStockThreshold} onChange={set('lowStockThreshold')}
                    className="w-full rounded-lg px-md py-sm text-body-md bg-white border border-error/30 text-error focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all"
                  />
                  <p className="text-[10px] text-error font-medium">Alerts triggered below this level</p>
                </div>
                <div className="space-y-xs">
                  <label className="text-label-md text-on-surface-variant">Stock Status</label>
                  <div className="h-[42px] flex items-center px-md bg-secondary-fixed/30 rounded-lg border border-outline-variant/30">
                    <span className={`w-2 h-2 rounded-full mr-2 ${statusColor}`} />
                    <span className="text-label-md text-on-secondary-fixed-variant uppercase tracking-wider">{stockStatus}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
                <div className="space-y-xs">
                  <label className="text-label-md text-on-surface-variant">Cost Price *</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-body-md">$</span>
                    <input type="number" min="0" step="0.01" value={form.costPrice} onChange={set('costPrice')} required placeholder="0.00"
                      className="w-full rounded-lg pl-8 pr-md py-sm text-body-md bg-white border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-xs">
                  <label className="text-label-md text-on-surface-variant">Selling Price *</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-body-md">$</span>
                    <input type="number" min="0" step="0.01" value={form.sellPrice} onChange={set('sellPrice')} required placeholder="0.00"
                      className="w-full rounded-lg pl-8 pr-md py-sm text-body-md bg-white border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-xl flex flex-col md:flex-row items-center justify-between gap-lg border-t border-outline-variant">
                {!isNew && (
                  <button type="button" onClick={handleDelete} disabled={deleting}
                    className="order-3 md:order-1 flex items-center gap-sm px-lg py-sm border border-error text-error hover:bg-error-container/20 transition-all rounded-lg text-label-md disabled:opacity-50"
                  >
                    {deleting
                      ? <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>
                      : <span className="material-symbols-outlined text-[18px]">delete</span>
                    }
                    Delete Product
                  </button>
                )}
                <div className="order-2 flex items-center gap-md w-full md:w-auto ml-auto">
                  <button type="button" onClick={() => navigate('/products')}
                    className="flex-1 md:flex-none px-xl py-sm border border-outline text-on-surface-variant hover:bg-surface-container-low transition-all rounded-lg text-label-md"
                  >
                    Cancel
                  </button>
                  <button type="submit" disabled={saving}
                    className="flex-1 md:flex-none px-xl py-sm bg-primary text-on-primary hover:bg-primary-container transition-all rounded-lg text-label-md shadow-md hover:shadow-lg active:scale-95 disabled:opacity-70 flex items-center justify-center gap-2"
                  >
                    {saving
                      ? <><svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg> Saving…</>
                      : isNew ? 'Add Product' : 'Save Product'
                    }
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </main>
    </AppLayout>
  );
}
