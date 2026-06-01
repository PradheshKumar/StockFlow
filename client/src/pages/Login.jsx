import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../lib/api';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { storeAuth } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { email, password } = Object.fromEntries(new FormData(e.target));
    try {
      const { token, user } = await authApi.login(email, password);
      storeAuth(token, user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-background text-on-surface flex items-center justify-center min-h-screen p-md">
      <main className="w-full max-w-[440px] flex flex-col items-center">
        <div className="mb-xl flex flex-col items-center gap-sm">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-on-primary shadow-sm mb-xs">
            <span className="material-symbols-outlined ms-filled text-[28px]">inventory_2</span>
          </div>
          <h1 className="text-headline-lg text-on-surface tracking-tight">StockFlow</h1>
          <p className="text-body-md text-on-surface-variant">Inventory management, simplified.</p>
        </div>

        <div className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-[0px_4px_12px_rgba(0,0,0,0.05)]">
          <header className="mb-lg">
            <h2 className="text-headline-md text-on-surface mb-xs">Login to your account</h2>
            <p className="text-body-md text-on-surface-variant">Enter your credentials to access the dashboard.</p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-lg">
            {error && (
              <div className="px-md py-sm bg-error-container text-on-error-container rounded-lg text-body-md flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">error</span>
                {error}
              </div>
            )}

            <div className="space-y-sm">
              <label className="block text-label-md text-on-surface-variant uppercase tracking-wider" htmlFor="email">
                Email Address
              </label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px] group-focus-within:text-primary transition-colors">mail</span>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@company.com"
                  required
                  autoComplete="email"
                  className="w-full pl-10 pr-md py-3 bg-surface border border-outline-variant rounded-lg text-body-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
            </div>

            <div className="space-y-sm">
              <label className="block text-label-md text-on-surface-variant uppercase tracking-wider" htmlFor="password">
                Password
              </label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px] group-focus-within:text-primary transition-colors">lock</span>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  className="w-full pl-10 pr-10 py-3 bg-surface border border-outline-variant rounded-lg text-body-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface transition-colors"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-primary text-on-primary text-headline-md rounded-lg hover:bg-primary-container active:scale-[0.98] transition-all shadow-sm disabled:opacity-70"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Authenticating...
                </span>
              ) : 'Login'}
            </button>
          </form>

          <footer className="mt-lg pt-lg border-t border-outline-variant text-center">
            <p className="text-body-md text-on-surface-variant">
              Don&apos;t have an account?{' '}
              <Link to="/signup" className="text-primary font-semibold hover:underline decoration-2 underline-offset-4">
                Create Account
              </Link>
            </p>
          </footer>
        </div>

      </main>
    </div>
  );
}
