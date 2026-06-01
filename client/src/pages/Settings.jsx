import { useState } from 'react';
import AppLayout from '../components/AppLayout';
import TopBar from '../components/TopBar';

export default function Settings() {
  const [threshold, setThreshold] = useState(15);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(false);

  function handleSave() {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setToast(true);
      setTimeout(() => setToast(false), 3000);
    }, 800);
  }

  return (
    <AppLayout>
      <TopBar title="Settings" />

      <main className="flex-1 p-lg max-w-[800px] mx-auto w-full">
        <section className="space-y-lg">
          <div className="flex flex-col gap-1">
            <span className="text-primary text-label-md font-bold tracking-wider uppercase">System Preferences</span>
            <p className="text-on-surface-variant text-body-md">Configure global inventory thresholds and notification triggers for your warehouse.</p>
          </div>

          <div className="bg-white border border-outline-variant rounded-xl overflow-hidden">
            <div className="p-lg border-b border-outline-variant bg-surface-bright/50">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">inventory_2</span>
                <h3 className="text-headline-md text-on-surface">Inventory Rules</h3>
              </div>
            </div>

            <div className="p-lg space-y-xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-xl items-start">
                <div>
                  <label className="block text-label-md text-on-surface mb-xs" htmlFor="threshold">Default Low Stock Threshold</label>
                  <p className="text-on-surface-variant text-sm mb-md leading-relaxed">
                    Set the global quantity level that triggers a &ldquo;Low-stock&rdquo; status badge. You can override this value on individual products.
                  </p>
                </div>
                <div className="relative">
                  <input
                    id="threshold"
                    type="number"
                    value={threshold}
                    onChange={e => setThreshold(Number(e.target.value))}
                    className="w-full h-12 px-4 pr-14 bg-white border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-mono text-lg outline-none"
                    placeholder="Enter quantity..."
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-label-md pointer-events-none">units</span>
                </div>
              </div>

              <div className="p-md rounded-lg bg-surface-container flex items-center justify-between border border-outline-variant/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded bg-white flex items-center justify-center border border-outline-variant shadow-sm">
                    <span className="material-symbols-outlined text-secondary">box</span>
                  </div>
                  <div>
                    <span className="block text-label-md text-on-surface">Preview Badge</span>
                    <span className="text-xs text-on-surface-variant">Applied when stock ≤ {threshold}</span>
                  </div>
                </div>
                <span className="px-3 py-1 bg-[#FFFBEB] text-[#92400E] border border-[#FDE68A] rounded-full text-label-md text-xs uppercase tracking-tight">
                  Low-stock
                </span>
              </div>
            </div>

            <div className="p-lg bg-surface-bright border-t border-outline-variant flex justify-end gap-md">
              <button className="px-lg py-md text-on-surface-variant text-label-md hover:text-on-surface transition-colors">
                Discard Changes
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-lg py-md bg-primary text-white rounded-lg text-label-md hover:bg-primary-container transition-all active:scale-[0.98] shadow-sm flex items-center gap-2 disabled:opacity-70"
              >
                {saving ? (
                  <>
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Saving...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[18px]">save</span>
                    Save Settings
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="p-lg rounded-xl border-2 border-dashed border-outline-variant/40 flex flex-col items-center text-center">
            <span className="material-symbols-outlined text-outline-variant text-[48px] mb-md">info</span>
            <h4 className="text-headline-md text-on-surface-variant opacity-60">Global Synchronization</h4>
            <p className="max-w-md text-on-surface-variant text-body-md mt-2">
              Settings changed here will propagate to all integrated storefronts and warehouse scanners within 5 minutes.
            </p>
          </div>
        </section>
      </main>

      <div className={`fixed bottom-lg right-lg transition-all duration-300 bg-inverse-surface text-inverse-on-surface px-lg py-md rounded-xl shadow-xl flex items-center gap-3 z-[100] ${toast ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20 pointer-events-none'}`}>
        <span className="material-symbols-outlined text-emerald-400">check_circle</span>
        <span className="text-label-md">Settings updated successfully.</span>
      </div>
    </AppLayout>
  );
}
