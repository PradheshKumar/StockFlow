import { useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import AppLayout from '../components/AppLayout';
import TopBar from '../components/TopBar';

const DEFAULTS = {
  name: 'Ergonomic Steel Bench',
  sku: 'SF-BENCH-004',
  description: 'Heavy-duty industrial grade steel bench with integrated tool storage and ergonomic height adjustment. Finished in powder-coated matte slate.',
  qty: 124,
  threshold: 20,
  costPrice: '450.00',
  sellPrice: '899.99',
};

export default function ProductForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isNew = id === 'new';

  const [form, setForm] = useState(isNew ? { name: '', sku: '', description: '', qty: 0, threshold: 10, costPrice: '', sellPrice: '' } : DEFAULTS);

  function set(field) {
    return e => setForm(f => ({ ...f, [field]: e.target.value }));
  }

  const stockStatus = Number(form.qty) === 0 ? 'Out-of-Stock' : Number(form.qty) <= Number(form.threshold) ? 'Low-Stock' : 'In-Stock';
  const statusColor = stockStatus === 'In-Stock' ? 'bg-emerald-500' : stockStatus === 'Low-Stock' ? 'bg-amber-500' : 'bg-red-500';

  return (
    <AppLayout>
      <TopBar title={isNew ? 'Add Product' : 'Edit Product'} />

      <main className="pt-0 min-h-screen">
        <div className="max-w-4xl mx-auto p-lg">
          <nav className="flex items-center gap-sm mb-lg">
            <button onClick={() => navigate('/products')} className="text-primary text-label-md hover:underline flex items-center gap-xs">
              <span className="material-symbols-outlined text-[16px]">arrow_back</span>
              Back to Inventory
            </button>
          </nav>

          <div className="bg-white border border-outline-variant rounded-xl p-lg space-y-lg shadow-sm">
            <div className="border-b border-outline-variant pb-md">
              <h2 className="text-headline-md text-on-surface">General Information</h2>
              <p className="text-body-md text-on-surface-variant mt-xs">Update the core details of your inventory item.</p>
            </div>

            <form className="grid grid-cols-1 gap-lg" onSubmit={e => { e.preventDefault(); navigate('/products'); }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
                <div className="space-y-xs">
                  <label className="text-label-md text-on-surface-variant">Product Name</label>
                  <input
                    value={form.name}
                    onChange={set('name')}
                    placeholder="e.g. Industrial Drill"
                    className="w-full rounded-lg px-md py-sm text-body-md bg-white border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all"
                  />
                </div>
                <div className="space-y-xs">
                  <label className="text-label-md text-on-surface-variant">SKU</label>
                  <input
                    value={form.sku}
                    onChange={set('sku')}
                    placeholder="e.g. STK-12345"
                    className="w-full rounded-lg px-md py-sm font-mono text-mono-sm bg-surface-container-low border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-xs">
                <label className="text-label-md text-on-surface-variant">Description</label>
                <textarea
                  value={form.description}
                  onChange={set('description')}
                  rows={4}
                  placeholder="Provide detailed specifications of the product..."
                  className="w-full rounded-lg px-md py-sm text-body-md bg-white border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-lg pt-md border-t border-outline-variant">
                <div className="space-y-xs">
                  <label className="text-label-md text-on-surface-variant">Quantity On Hand</label>
                  <input
                    type="number"
                    value={form.qty}
                    onChange={set('qty')}
                    className="w-full rounded-lg px-md py-sm text-body-md bg-white border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all"
                  />
                </div>
                <div className="space-y-xs">
                  <label className="text-label-md text-on-surface-variant">Low Stock Threshold</label>
                  <input
                    type="number"
                    value={form.threshold}
                    onChange={set('threshold')}
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
                  <label className="text-label-md text-on-surface-variant">Cost Price</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-body-md">$</span>
                    <input
                      type="text"
                      value={form.costPrice}
                      onChange={set('costPrice')}
                      className="w-full rounded-lg pl-8 pr-md py-sm text-body-md bg-white border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-xs">
                  <label className="text-label-md text-on-surface-variant">Selling Price</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-body-md">$</span>
                    <input
                      type="text"
                      value={form.sellPrice}
                      onChange={set('sellPrice')}
                      className="w-full rounded-lg pl-8 pr-md py-sm text-body-md bg-white border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-xl flex flex-col md:flex-row items-center justify-between gap-lg border-t border-outline-variant">
                {!isNew && (
                  <button type="button" className="order-3 md:order-1 flex items-center gap-sm px-lg py-sm border border-error text-error hover:bg-error-container/20 transition-all rounded-lg text-label-md">
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                    Delete Product
                  </button>
                )}
                <div className="order-2 flex items-center gap-md w-full md:w-auto ml-auto">
                  <button type="button" onClick={() => navigate('/products')} className="flex-1 md:flex-none px-xl py-sm border border-outline text-on-surface-variant hover:bg-surface-container-low transition-all rounded-lg text-label-md">
                    Cancel
                  </button>
                  <button type="submit" className="flex-1 md:flex-none px-xl py-sm bg-primary text-on-primary hover:bg-primary-container transition-all rounded-lg text-label-md shadow-md hover:shadow-lg active:scale-95">
                    Save Product
                  </button>
                </div>
              </div>
            </form>
          </div>

          {!isNew && (
            <div className="mt-lg grid grid-cols-1 md:grid-cols-3 gap-lg">
              <div className="md:col-span-2 bg-white border border-outline-variant rounded-xl p-md flex items-center justify-between">
                <div className="flex items-center gap-md">
                  <div className="p-2 bg-surface-container-highest rounded-full">
                    <span className="material-symbols-outlined text-primary">history</span>
                  </div>
                  <div>
                    <p className="text-label-md text-on-surface">Last Edited</p>
                    <p className="text-body-md text-on-surface-variant">Oct 24, 2023 by Sarah Jenkins</p>
                  </div>
                </div>
                <button className="text-primary hover:underline text-label-md">View History</button>
              </div>
              <div className="bg-white border border-primary/10 rounded-xl p-md bg-primary-fixed/20">
                <div className="flex items-center gap-sm mb-xs">
                  <span className="material-symbols-outlined text-primary text-[18px]">info</span>
                  <p className="text-label-md text-primary font-bold">Auto-Sync Enabled</p>
                </div>
                <p className="text-[11px] text-on-surface-variant leading-relaxed">Changes are automatically broadcasted to connected warehouse terminals.</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </AppLayout>
  );
}
