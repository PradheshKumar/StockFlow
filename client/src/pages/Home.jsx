import { useEffect, useState } from 'react';
import './Home.css';

export default function Home() {
  const [apiStatus, setApiStatus] = useState('checking…');

  useEffect(() => {
    fetch('/health')
      .then((r) => r.json())
      .then(() => setApiStatus('🟢 Connected'))
      .catch(() => setApiStatus('🔴 Unreachable'));
  }, []);

  return (
    <div className="home">
      {/* Hero */}
      <section className="hero">
        <div className="hero__badge">Boilerplate Ready</div>
        <h1 className="hero__title">
          Hello, <span className="gradient-text">StockFlow</span> 👋
        </h1>
        <p className="hero__sub">
          A fullstack starter — <strong>Express</strong> · <strong>SQLite</strong> ·{' '}
          <strong>Drizzle ORM</strong> · <strong>React&nbsp;+&nbsp;Vite</strong>
        </p>

        <div className="status-pill">
          <span className="status-pill__label">API Status</span>
          <span className="status-pill__value">{apiStatus}</span>
        </div>
      </section>

      {/* Quick-start cards */}
      <section className="cards">
        {CARDS.map((c) => (
          <div className="card" key={c.title}>
            <span className="card__icon">{c.icon}</span>
            <h2 className="card__title">{c.title}</h2>
            <p  className="card__desc">{c.desc}</p>
            <code className="card__cmd">{c.cmd}</code>
          </div>
        ))}
      </section>
    </div>
  );
}

const CARDS = [
  {
    icon: '🗄️',
    title: 'Generate Migration',
    desc:  'Create SQL migration files from your Drizzle schema.',
    cmd:   'npm run db:generate',
  },
  {
    icon: '⚡',
    title: 'Apply Migration',
    desc:  'Push pending migrations to the SQLite database.',
    cmd:   'npm run db:migrate',
  },
  {
    icon: '🌱',
    title: 'Seed Database',
    desc:  'Insert sample users and stocks for development.',
    cmd:   'node server/src/db/seed.js',
  },
  {
    icon: '🔭',
    title: 'Drizzle Studio',
    desc:  'Open the visual DB browser for your SQLite data.',
    cmd:   'npm run db:studio',
  },
];
