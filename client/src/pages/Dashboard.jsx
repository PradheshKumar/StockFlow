import { useState } from 'react';
import AppLayout from '../components/AppLayout';
import TopBar from '../components/TopBar';

const LOW_STOCK = [
  {
    id: 1,
    name: 'Vanguard Tech Runner',
    sku: 'VT-789-RED',
    qty: 12,
    threshold: 50,
    status: 'critical',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDZcCBl1egAdl7YA_Fmn8QDzzmWyzNv8NYSE2YREtXSzlKIQchgDw7DEROLAf_6WSKJDqIjJWQkv4xNlllGEmdCSYTYPNKGO4g8vC1S-MvmFJtog9iZQ_vEPCoTMNO4_mTc8dFnPD0dA7JbwA88xCH7sy4yR1HbtJABwfSn21HnyWc1D9Y3JqNQ0DAz_ZudEa4Wylf5ojt9ozR9wnqakUVC9punlDfqKCX-VU1V8_gA-Ed3L8JZxaQfcr6GFIfiSDQW3ILD9F1FnEAx',
  },
  {
    id: 2,
    name: 'Chronos Minimalist Watch',
    sku: 'CW-001-LHR',
    qty: 8,
    threshold: 25,
    status: 'critical',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCzRSQ-VLmHjRjCCKmP54kfhwq44k4ycFnypkTFMrXiL4XyucUtixqwuI0Se0Kwd1QL1PEq7jHwJqiV376-0a4M6WiJ9wEasWCACTV7zToHrGiZvP5aORbEbUb8P1jXS2xIc89LhcXp9HrdOvojlY8_RIpb1ZPhDfvFqH--fC-6p_TJKu-bvLAbxVcg3JRfAepNsctRZvG-1FbpMcoP3fTh3MUSx66T1xj6aivWMxc06fK2RJinDfV7_Ox176nUNZNgVsWVLQEyLJpz',
  },
  {
    id: 3,
    name: 'Aura Noise Cancelling',
    sku: 'ANC-X4-BLK',
    qty: 34,
    threshold: 40,
    status: 'low',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB-ynBVJLdcJJc_bm0uC3H3MfNGewKDgA2puhh09jplHLWnCx4vWoSKSiZKBwHacx4FxbAeNL0pBSQhHbQwMY3doGfGOuoNl17iVRj3c6gVkh0XMtgiogPIQFLyQxgebVOPeDU164fBnych_lL0oBi9nB_DNOl3bmF20qHsxzMXGTtbk-Z6w8kmcQVxWWX2zcOzuvLiOQy5qY_RdDjp9N6LhuKQT8-7KcaNt7zqaDAN0JpTCRUeBGYILW2t8Q06GiLExZWhrxhsBO5k',
  },
  {
    id: 4,
    name: 'Optic Prime 50mm',
    sku: 'OP-LENS-50',
    qty: 15,
    threshold: 20,
    status: 'low',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuARwXuKM5w54RdqFlhvjk9KbsG4tXkujftsvNqsgiyqdVjV3kvImYN6ZYtxB8HfBo9M6l-933CtVOgZgD8psLA1kCjqxkHiS2Q7dp437js1S1JwrAAkVYdWTt6aflUz5zDEoK3fI8Z4FSXVPftuXHdhSW5RVIZ8xpT6IfaaVmBbyEEupfcuiH-xnHWvsD3jNWGmZfWXg5ECZI5YffNst6xsIBBZeEJ5WIMX7NACLt73FIXsWQKNt1CI8EnKmdgGoEbUsFlAz9lsaxpe',
  },
];

function StatusBadge({ status }) {
  if (status === 'critical')
    return <span className="px-2 py-1 rounded-full bg-error-container text-on-error-container text-[11px] font-bold uppercase">Critical</span>;
  return <span className="px-2 py-1 rounded-full bg-amber-100 text-amber-800 text-[11px] font-bold uppercase">Low Stock</span>;
}

export default function Dashboard() {
  const [search, setSearch] = useState('');

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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
            <div className="bg-surface border border-outline-variant p-lg rounded-xl flex items-center gap-lg group hover:border-primary transition-colors">
              <div className="w-14 h-14 rounded-full bg-primary-fixed flex items-center justify-center text-on-primary-fixed-variant transition-transform group-hover:scale-110">
                <span className="material-symbols-outlined ms-filled text-[28px]">inventory</span>
              </div>
              <div>
                <p className="text-label-md text-on-surface-variant uppercase tracking-wider">Total Products</p>
                <h3 className="text-display font-bold text-on-surface leading-none mt-1">1,284</h3>
              </div>
            </div>

            <div className="bg-surface border border-outline-variant p-lg rounded-xl flex items-center gap-lg group hover:border-primary transition-colors">
              <div className="w-14 h-14 rounded-full bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed-variant transition-transform group-hover:scale-110">
                <span className="material-symbols-outlined ms-filled text-[28px]">package_2</span>
              </div>
              <div>
                <p className="text-label-md text-on-surface-variant uppercase tracking-wider">Total Inventory Units</p>
                <h3 className="text-display font-bold text-on-surface leading-none mt-1">14,920</h3>
              </div>
            </div>
          </div>

          <section className="bg-surface border border-outline-variant rounded-xl overflow-hidden">
            <div className="px-lg py-md border-b border-outline-variant flex justify-between items-center bg-surface-bright">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined ms-filled text-error">warning</span>
                <h4 className="text-headline-md text-on-surface">Low Stock Items</h4>
              </div>
              <button className="text-label-md text-primary font-bold hover:underline">View All Alerts</button>
            </div>

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
                  {LOW_STOCK.filter(p =>
                    !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase())
                  ).map(item => (
                    <tr key={item.id} className="hover:bg-surface-container-low transition-colors hover:translate-x-1">
                      <td className="px-lg py-md">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-surface-container overflow-hidden flex-shrink-0">
                            <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                          </div>
                          <span className="text-body-md text-on-surface font-semibold">{item.name}</span>
                        </div>
                      </td>
                      <td className="px-lg py-md font-mono text-mono-sm text-on-surface-variant">{item.sku}</td>
                      <td className="px-lg py-md">
                        <span className={item.status === 'critical' ? 'text-error font-bold' : 'text-amber-500 font-bold'}>{item.qty}</span>
                      </td>
                      <td className="px-lg py-md text-on-surface-variant">{item.threshold}</td>
                      <td className="px-lg py-md"><StatusBadge status={item.status} /></td>
                      <td className="px-lg py-md text-right">
                        <button className="px-4 py-2 bg-primary text-white rounded-lg text-label-md hover:bg-primary-container transition-colors">Restock</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="px-lg py-md bg-surface-container-low border-t border-outline-variant flex justify-between items-center">
              <p className="text-label-md text-on-surface-variant">Showing {LOW_STOCK.length} low stock items</p>
              <div className="flex gap-2">
                <button disabled className="p-1 hover:bg-surface-container-high rounded transition-colors disabled:opacity-30">
                  <span className="material-symbols-outlined">chevron_left</span>
                </button>
                <button className="p-1 hover:bg-surface-container-high rounded transition-colors">
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>

      <button className="fixed bottom-lg right-lg w-14 h-14 bg-primary text-white rounded-full shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-all group z-50">
        <span className="material-symbols-outlined text-[28px]">add</span>
        <span className="absolute right-full mr-4 px-3 py-1 bg-inverse-surface text-inverse-on-surface text-label-md rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">Add Item</span>
      </button>
    </AppLayout>
  );
}
