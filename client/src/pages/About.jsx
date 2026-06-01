export default function About() {
  return (
    <div className="about">
      <h1 className="gradient-text" style={{ fontSize: '2rem', marginBottom: '1rem' }}>
        About StockFlow
      </h1>
      <p style={{ color: 'var(--clr-muted)', maxWidth: '560px', lineHeight: '1.8' }}>
        StockFlow is a fullstack boilerplate built to get you productive fast.
        Swap out the sample domain (stocks/users) for your own models and ship.
      </p>

      <ul className="stack-list">
        {STACK.map(({ label, detail, icon }) => (
          <li className="stack-item" key={label}>
            <span className="stack-item__icon">{icon}</span>
            <div>
              <strong>{label}</strong>
              <span className="stack-item__detail"> — {detail}</span>
            </div>
          </li>
        ))}
      </ul>

      <style>{`
        .about { padding-top: 1rem; }
        .stack-list { list-style: none; margin-top: 2.5rem; display: flex; flex-direction: column; gap: 1rem; }
        .stack-item { display: flex; align-items: center; gap: 1rem; padding: 1rem 1.25rem;
          background: var(--clr-surface); border: 1px solid var(--clr-border); border-radius: var(--radius); }
        .stack-item__icon { font-size: 1.5rem; }
        .stack-item__detail { color: var(--clr-muted); font-size: 0.9rem; }
      `}</style>
    </div>
  );
}

const STACK = [
  { icon: '🟢', label: 'Node.js + Express',  detail: 'REST API with CORS, morgan, and centralised error handling' },
  { icon: '🗄️', label: 'SQLite',             detail: 'Zero-config embedded database with WAL mode + FK enforcement' },
  { icon: '🔷', label: 'Drizzle ORM',         detail: 'Type-safe schema, migrations, and Drizzle Studio support' },
  { icon: '⚛️', label: 'React 18 + Vite',    detail: 'Lightning-fast HMR dev server with /api proxy built in' },
  { icon: '🛣️', label: 'React Router v6',    detail: 'Client-side SPA routing with active link highlighting' },
];
