import { useAuth } from '../context/AuthContext';


export default function TopBar({ title, children }) {
  const { user } = useAuth();
  const initials = user?.name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || 'U';

  return (
    <header className="flex justify-between items-center h-16 px-lg bg-surface border-b border-outline-variant sticky top-0 z-40">
      <div className="flex items-center gap-md">
        <h2 className="text-headline-lg font-black text-on-surface">{title}</h2>
        {children}
      </div>
      <div className="flex items-center gap-md">
        <div
          className="w-8 h-8 rounded-full bg-primary flex items-center justify-center border border-outline-variant overflow-hidden"
          title={user?.name || 'User'}
        >
          <span className="text-on-primary text-xs font-bold select-none">{initials}</span>
        </div>
      </div>
    </header>
  );
}
