# StockFlow

A minimal multi-tenant SaaS inventory management app — sign up, manage products, track stock levels, and catch low-stock items at a glance.

**Stack:** Express · SQLite · Drizzle ORM · React · Vite · Tailwind CSS

---

## Features

- **Auth** — Email/password signup (creates an organization), login, JWT-protected sessions
- **Products** — Full CRUD with name, SKU (unique per org), quantity, cost/sell price, low-stock threshold
- **Inventory** — Inline stock adjustment (+/- units with optional note) directly from the product list
- **Dashboard** — Total product count, total inventory units, and a live low-stock table
- **Settings** — Organization-wide default low-stock threshold
- **Multi-tenant** — All data is scoped to the user's organization; no cross-tenant data leakage

---

## Project Structure

```
StockFlow/
├── client/                  # React SPA (Vite)
│   ├── src/
│   │   ├── context/         # AuthContext (JWT + user state)
│   │   ├── components/      # AppLayout, Sidebar, TopBar, ProtectedRoute
│   │   ├── pages/           # Dashboard, Products, ProductForm, Settings, Login, Signup
│   │   ├── lib/api.js       # Fetch wrapper for all API calls
│   │   ├── App.jsx          # Routes
│   │   └── index.css        # Tailwind + design tokens
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

> The server will refuse to start if `JWT_SECRET` is not set.

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
| Inventory | POST | `/api/products/:id/adjust-stock` | ✓ | Adjust stock (+/- units) |
| Settings | GET | `/api/settings` | ✓ | Get org settings |
| Settings | PUT | `/api/settings` | ✓ | Update org settings |

Protected endpoints (✓) require `Authorization: Bearer <token>`.

---

## Security

| Area | Measure |
|------|---------|
| **Security headers** | `helmet` sets `X-Content-Type-Options`, `X-Frame-Options`, `Strict-Transport-Security`, removes `X-Powered-By` |
| **Brute-force protection** | `express-rate-limit` caps `/api/auth/login` and `/api/auth/signup` at 20 requests per 15 minutes per IP |
| **JWT authentication** | All non-auth endpoints require a signed JWT. Server refuses to start if `JWT_SECRET` is unset. |
| **Password hashing** | bcrypt (cost factor 10); hash never returned in any response |
| **Timing-safe login** | bcrypt always runs regardless of whether the email exists — prevents user enumeration via timing |
| **SQL injection** | All queries use Drizzle ORM's parameterized query builder — no raw SQL with user input |
| **Tenant isolation** | Every product/settings query is scoped to `organizationId` from the JWT |
| **Input validation** | Required fields, email format, non-negative numbers, and integer-only stock adjustments validated before DB ops |
| **Email normalization** | Emails are lowercased and trimmed on signup and login |
| **Mass assignment** | Controllers destructure only whitelisted fields — extra body keys are ignored |
| **Request size limit** | JSON bodies capped at 10 KB |
| **CORS** | Origin restricted to `CLIENT_ORIGIN` env var; methods and headers explicitly whitelisted |
| **Error leakage** | 5xx messages replaced with generic string in production; stack traces only in development |

---

## AI Usage Declaration

This project was built with AI assistance. The tools used and their roles:

| Tool | Role |
|------|------|
| **[Stitch](https://stitch.withgoogle.com)** | UI design — used to design and generate the initial screen layouts, component structure, and visual design system |
| **[Claude Code](https://claude.ai/code)** | Frontend development — used to build and iterate on the React frontend: pages, components, routing, API integration, and state management |
| **[Claude Code](https://claude.ai/code)** | Backend development — used as a development assistant for the Express API: endpoint design, JWT authentication, security hardening, Drizzle schema, and database migrations |

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
