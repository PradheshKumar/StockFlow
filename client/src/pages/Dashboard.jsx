import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import TopBar from '../components/TopBar';
import { dashboardApi } from '../lib/api';

function StatusBadge({ qty, threshold }) {
  const n = parseInt(qty, 10) || 0;
  const isCritical = n === 0 || n / threshold < 0.4;
  return isCritical
    ? <span className="px-2 py-1 rounded-full bg-error-container text-on-error-container text-[11px] font-bold uppercase">Critical</span>
    : <span className="px-2 py-1 rounded-full bg-amber-100 text-amber-800 text-[11px] font-bold uppercase">Low Stock</span>;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');
  const [search, setSearch]   = useState('');

  useEffect(() => {
    dashboardApi.getSummary()
      .then(res => setData(res.data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = (data?.lowStockProducts ?? []).filter(p =>
    !search ||
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.sku.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppLayout>
      <TopBar title="Dashboard">
        <div className="ml-4 relative group">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant text-[20px]">search</span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2 bg-surface-container-low border border-outline-variant rounded-full text-body-md focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all w-64 focus:w-80"
            placeholder="Search inventory..."
            type="text"
          />
        </div>
      </TopBar>

      <main className="p-lg">
        <div className="max-w-[1440px] mx-auto space-y-lg">

          {loading && (
            <div className="flex items-center justify-center py-xl text-on-surface-variant">
              <svg className="animate-spin h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Loading dashboard…
            </div>
          )}

          {error && (
            <div className="px-lg py-md bg-error-container text-on-error-container rounded-xl flex items-center gap-2">
              <span className="material-symbols-outlined">error</span>
              {error}
            </div>
          )}

          {data && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
                <div className="bg-surface border border-outline-variant p-lg rounded-xl flex items-center gap-lg group hover:border-primary transition-colors">
                  <div className="w-14 h-14 rounded-full bg-primary-fixed flex items-center justify-center text-on-primary-fixed-variant transition-transform group-hover:scale-110">
                    <span className="material-symbols-outlined ms-filled text-[28px]">inventory</span>
                  </div>
                  <div>
                    <p className="text-label-md text-on-surface-variant uppercase tracking-wider">Total Products</p>
                    <h3 className="text-display font-bold text-on-surface leading-none mt-1">{data.totalProducts.toLocaleString()}</h3>
                  </div>
                </div>

                <div className="bg-surface border border-outline-variant p-lg rounded-xl flex items-center gap-lg group hover:border-primary transition-colors">
                  <div className="w-14 h-14 rounded-full bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed-variant transition-transform group-hover:scale-110">
                    <span className="material-symbols-outlined ms-filled text-[28px]">package_2</span>
                  </div>
                  <div>
                    <p className="text-label-md text-on-surface-variant uppercase tracking-wider">Total Inventory Units</p>
                    <h3 className="text-display font-bold text-on-surface leading-none mt-1">{data.totalInventory.toLocaleString()}</h3>
                  </div>
                </div>
              </div>

              <section className="bg-surface border border-outline-variant rounded-xl overflow-hidden">
                <div className="px-lg py-md border-b border-outline-variant flex justify-between items-center bg-surface-bright">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined ms-filled text-error">warning</span>
                    <h4 className="text-headline-md text-on-surface">Low Stock Items</h4>
                  </div>
                  <button onClick={() => navigate('/products')} className="text-label-md text-primary font-bold hover:underline">View All Products</button>
                </div>

                {data.lowStockProducts.length === 0 ? (
                  <div className="px-lg py-xl text-center text-on-surface-variant">
                    <span className="material-symbols-outlined text-[48px] mb-md block">check_circle</span>
                    <p className="text-body-md">All products are well stocked!</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-surface-container-low">
                          {['Product Name', 'SKU', 'Quantity', 'Threshold', 'Status', 'Action'].map((h, i) => (
                            <th key={h} className={`px-lg py-3 text-label-md text-on-surface-variant uppercase tracking-wider ${i === 5 ? 'text-right' : 'text-left'}`}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-outline-variant">
                        {filtered.map(item => (
                          <tr key={item.id} className="hover:bg-surface-container-low transition-colors">
                            <td className="px-lg py-md">
                              <span className="text-body-md text-on-surface font-semibold">{item.name}</span>
                            </td>
                            <td className="px-lg py-md font-mono text-mono-sm text-on-surface-variant">{item.sku}</td>
                            <td className="px-lg py-md">
                              <span className={parseInt(item.quantity, 10) === 0 || parseInt(item.quantity, 10) / item.lowStockThreshold < 0.4 ? 'text-error font-bold' : 'text-amber-500 font-bold'}>
                                {item.quantity}
                              </span>
                            </td>
                            <td className="px-lg py-md text-on-surface-variant">{item.lowStockThreshold}</td>
                            <td className="px-lg py-md">
                              <StatusBadge qty={item.quantity} threshold={item.lowStockThreshold} />
                            </td>
                            <td className="px-lg py-md text-right">
                              <button
                                onClick={() => navigate(`/products/${item.id}/edit`)}
                                className="px-4 py-2 bg-primary text-white rounded-lg text-label-md hover:bg-primary-container transition-colors"
                              >
                                Restock
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                <div className="px-lg py-md bg-surface-container-low border-t border-outline-variant flex justify-between items-center">
                  <p className="text-label-md text-on-surface-variant">
                    Showing {filtered.length} of {data.lowStockProducts.length} low stock item{data.lowStockProducts.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </section>
            </>
          )}
        </div>
      </main>

      <button
        onClick={() => navigate('/products/new')}
        className="fixed bottom-lg right-lg w-14 h-14 bg-primary text-white rounded-full shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-all group z-50"
      >
        <span className="material-symbols-outlined text-[28px]">add</span>
        <span className="absolute right-full mr-4 px-3 py-1 bg-inverse-surface text-inverse-on-surface text-label-md rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">Add Item</span>
      </button>
    </AppLayout>
  );
}
