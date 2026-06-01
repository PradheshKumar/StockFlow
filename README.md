# StockFlow

Inventory management app — **Express · SQLite · Drizzle ORM · React + Vite**

---

## Project Structure

```
StockFlow/
├── client/                  # React SPA (Vite)
│   ├── src/
│   │   ├── lib/api.js       # Fetch wrapper for all API calls
│   │   ├── pages/           # Page components
│   │   ├── App.jsx
│   │   └── index.css        # Global design tokens
│   └── vite.config.js       # Dev proxy → Express :3001
│
├── server/                  # Express REST API
│   ├── src/
│   │   ├── db/
│   │   │   ├── client.js    # Drizzle + libsql setup
│   │   │   ├── schema.js    # Table definitions (organizations, users, products)
│   │   │   ├── migrate.js   # Migration runner
│   │   │   └── seed.js      # Dev seed data
│   │   ├── middleware/
│   │   │   ├── authenticate.js  # JWT guard
│   │   │   ├── errorHandler.js
│   │   │   └── validate.js      # Lightweight validation factory
│   │   ├── routes/          # auth, products, dashboard, settings
│   │   ├── controllers/
│   │   ├── app.js
│   │   └── index.js
│   ├── drizzle/             # Generated SQL migrations (git-tracked)
│   ├── data/                # SQLite .db file (git-ignored)
│   ├── drizzle.config.js
│   └── .env
│
├── docs/
│   └── api.md               # Full API reference (request & response schemas)
├── package.json             # Root workspace + concurrently scripts
└── .gitignore
```

---

## Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment

Copy the example and set a strong `JWT_SECRET`:
```bash
cp server/.env.example server/.env
```

```
PORT=3001
NODE_ENV=development
DATABASE_URL=./data/stockflow.db
JWT_SECRET=your_long_random_secret_here
JWT_EXPIRES_IN=7d
```

### 3. Apply DB migrations
```bash
npm run db:migrate
```

### 4. (Optional) Seed sample data
```bash
node server/src/db/seed.js
```

### 5. Start both servers
```bash
npm run dev
```

| Service | URL |
|---------|-----|
| React   | http://localhost:5173 |
| Express | http://localhost:3001 |
| Health  | http://localhost:3001/health |

---

## API Overview

Full request/response documentation → **[docs/api.md](docs/api.md)**

| Group | Method | Endpoint | Auth | Description |
|-------|--------|----------|------|-------------|
| Auth | POST | `/api/auth/signup` | — | Create organization + user, get JWT |
| Auth | POST | `/api/auth/login` | — | Login, get JWT |
| Auth | POST | `/api/auth/logout` | — | Stateless logout |
| Auth | GET | `/api/auth/me` | ✓ | Current user |
| Dashboard | GET | `/api/dashboard` | ✓ | Totals + low-stock list |
| Products | GET | `/api/products` | ✓ | List products (`?search=`) |
| Products | GET | `/api/products/:id` | ✓ | Product detail |
| Products | POST | `/api/products` | ✓ | Create product |
| Products | PUT | `/api/products/:id` | ✓ | Update product |
| Products | DELETE | `/api/products/:id` | ✓ | Delete product |
| Inventory | POST | `/api/products/:id/adjust-stock` | ✓ | Adjust quantity |
| Settings | GET | `/api/settings` | ✓ | Get org settings |
| Settings | PUT | `/api/settings` | ✓ | Update org settings |

Protected endpoints (✓) require `Authorization: Bearer <token>`.

---

## Other Scripts

| Command | Description |
|---------|-------------|
| `npm run db:generate` | Regenerate SQL migrations from schema changes |
| `npm run db:migrate` | Apply pending migrations |
| `npm run db:studio` | Open Drizzle Studio (visual DB browser) |
| `npm run dev:server` | Run only the Express server |
| `npm run dev:client` | Run only the Vite dev server |
| `npm run build` | Build the React SPA for production |
