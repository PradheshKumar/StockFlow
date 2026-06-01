import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Signup() {
  const navigate = useNavigate();
  const [showPw, setShowPw] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    navigate('/dashboard');
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-md text-body-md text-on-surface"
      style={{
        backgroundColor: '#F8FAFC',
        backgroundImage: 'radial-gradient(at 0% 0%, hsla(210,100%,98%,1) 0, transparent 50%), radial-gradient(at 50% 0%, hsla(220,100%,97%,1) 0, transparent 50%), radial-gradient(at 100% 0%, hsla(215,100%,98%,1) 0, transparent 50%)',
      }}
    >
      <main className="w-full max-w-[440px]">
        <div className="flex flex-col items-center mb-lg">
          <div className="w-12 h-12 bg-primary flex items-center justify-center rounded-xl mb-md">
            <span className="material-symbols-outlined ms-filled text-on-primary text-3xl">inventory_2</span>
          </div>
          <h1 className="text-headline-lg text-on-surface">StockFlow</h1>
          <p className="text-on-surface-variant text-body-md mt-xs">Professional Inventory Management</p>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg">
          <header className="mb-lg">
            <h2 className="text-headline-md text-on-surface">Create your account</h2>
            <p className="text-on-surface-variant text-body-md mt-xs">Start managing your organization&apos;s stock today.</p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-md">
            <div className="space-y-xs">
              <label className="text-label-md text-on-surface-variant block" htmlFor="org_name">Organization Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-outline text-[20px]">corporate_fare</span>
                </div>
                <input
                  id="org_name"
                  type="text"
                  placeholder="Acme Corp"
                  className="block w-full pl-10 pr-md py-2.5 bg-surface-container-lowest border border-outline-variant rounded-lg text-on-surface placeholder:text-outline/50 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
            </div>

            <div className="space-y-xs">
              <label className="text-label-md text-on-surface-variant block" htmlFor="email">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-outline text-[20px]">mail</span>
                </div>
                <input
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  className="block w-full pl-10 pr-md py-2.5 bg-surface-container-lowest border border-outline-variant rounded-lg text-on-surface placeholder:text-outline/50 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
            </div>

            <div className="space-y-xs">
              <label className="text-label-md text-on-surface-variant block" htmlFor="password">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-outline text-[20px]">lock</span>
                </div>
                <input
                  id="password"
                  type={showPw ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="block w-full pl-10 pr-10 py-2.5 bg-surface-container-lowest border border-outline-variant rounded-lg text-on-surface placeholder:text-outline/50 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-outline hover:text-primary transition-colors">
                  <span className="material-symbols-outlined text-[20px]">{showPw ? 'visibility_off' : 'visibility'}</span>
                </button>
              </div>
            </div>

            <div className="space-y-xs">
              <label className="text-label-md text-on-surface-variant block" htmlFor="confirm_password">Confirm Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-outline text-[20px]">lock_reset</span>
                </div>
                <input
                  id="confirm_password"
                  type="password"
                  placeholder="••••••••"
                  className="block w-full pl-10 pr-md py-2.5 bg-surface-container-lowest border border-outline-variant rounded-lg text-on-surface placeholder:text-outline/50 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
            </div>

            <div className="pt-sm">
              <button
                type="submit"
                className="w-full bg-primary text-on-primary py-3 px-md rounded-lg text-body-lg font-semibold hover:bg-primary-container hover:shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                Create Account
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>
          </form>

          <footer className="mt-lg pt-lg border-t border-outline-variant text-center">
            <p className="text-on-surface-variant text-body-md">
              Already have an account?{' '}
              <Link to="/login" className="text-primary font-semibold hover:underline decoration-2 underline-offset-4">Login</Link>
            </p>
          </footer>
        </div>
      </main>
    </div>
  );
}
