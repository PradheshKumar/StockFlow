import Sidebar from './Sidebar';

export default function AppLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="ml-[240px] flex-1 flex flex-col min-h-screen">
        {children}
      </div>
    </div>
  );
}
