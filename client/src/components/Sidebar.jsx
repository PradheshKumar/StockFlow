import { NavLink, useNavigate } from 'react-router-dom';

const NAV_ITEMS = [
  { to: '/dashboard', icon: 'dashboard',   label: 'Dashboard' },
  { to: '/products',  icon: 'inventory_2', label: 'Products'  },
  { to: '/settings',  icon: 'settings',    label: 'Settings'  },
];

export default function Sidebar() {
  const navigate = useNavigate();

  return (
    <aside className="w-[240px] h-screen fixed left-0 top-0 flex flex-col py-lg px-md bg-surface border-r border-outline-variant z-50">
      <div className="mb-xl flex items-center gap-3 px-1">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white flex-shrink-0">
          <span className="material-symbols-outlined ms-filled text-[18px]">inventory_2</span>
        </div>
        <div>
          <h1 className="text-headline-md font-bold text-primary leading-none">StockFlow</h1>
          <p className="text-label-md text-on-surface-variant opacity-70 mt-0.5">Inventory Management</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1">
        {NAV_ITEMS.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-label-md font-medium ${
                isActive
                  ? 'bg-secondary-container text-on-secondary-container'
                  : 'text-on-surface-variant hover:bg-surface-container-high'
              }`
            }
          >
            <span className="material-symbols-outlined text-[22px]">{icon}</span>
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto border-t border-outline-variant pt-md">
        <button
          onClick={() => navigate('/login')}
          className="w-full flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-high transition-colors rounded-xl text-label-md"
        >
          <span className="material-symbols-outlined text-[22px]">logout</span>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
