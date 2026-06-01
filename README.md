# StockFlow

> Fullstack boilerplate — **Express · SQLite · Drizzle ORM · React + Vite**

---

## Project Structure

```
StockFlow/
├── client/                  # React SPA (Vite)
│   ├── public/
│   ├── src/
│   │   ├── lib/api.js       # Fetch wrapper for all API calls
│   │   ├── pages/           # Page components (Home, About)
│   │   ├── App.jsx / App.css
│   │   ├── main.jsx
│   │   └── index.css        # Global design tokens
│   ├── index.html
│   └── vite.config.js       # Dev proxy → Express :3001
│
├── server/                  # Express REST API
│   ├── src/
│   │   ├── db/
│   │   │   ├── client.js    # Drizzle + better-sqlite3 setup
│   │   │   ├── schema.js    # Table definitions (users, stocks, portfolio)
│   │   │   ├── migrate.js   # Migration runner
│   │   │   └── seed.js      # Dev seed data
│   │   ├── middleware/
│   │   │   ├── errorHandler.js
│   │   │   └── validate.js  # Lightweight validation factory
│   │   ├── routes/          # users.js, stocks.js, index.js
│   │   ├── controllers/     # usersController.js, stocksController.js
│   │   ├── app.js
│   │   └── index.js
│   ├── drizzle/             # Generated SQL migrations (git-tracked)
│   ├── data/                # SQLite .db file (git-ignored)
│   ├── drizzle.config.js
│   └── .env
│
├── package.json             # Root workspace + concurrently scripts
└── .gitignore
```

---

## Quick Start

### 1. Install all dependencies
```bash
npm install
```

### 2. Generate & apply DB migrations
```bash
npm run db:generate   # creates SQL files in server/drizzle/
npm run db:migrate    # applies them to server/data/stockflow.db
```

### 3. (Optional) Seed sample data
```bash
node server/src/db/seed.js
```

### 4. Start both servers
```bash
npm run dev
```

| Service  | URL                           |
|----------|-------------------------------|
| React    | http://localhost:5173          |
| Express  | http://localhost:3001          |
| Health   | http://localhost:3001/health   |

---

## API Reference

### Stocks
| Method | Endpoint            | Description              |
|--------|---------------------|--------------------------|
| GET    | `/api/stocks`       | List all (supports `?search=`) |
| GET    | `/api/stocks/:id`   | Get by ID                |
| POST   | `/api/stocks`       | Create stock             |
| PUT    | `/api/stocks/:id`   | Update stock             |
| DELETE | `/api/stocks/:id`   | Delete stock             |

### Users
| Method | Endpoint           | Description   |
|--------|--------------------|---------------|
| GET    | `/api/users`       | List all      |
| GET    | `/api/users/:id`   | Get by ID     |
| POST   | `/api/users`       | Create user   |
| PUT    | `/api/users/:id`   | Update user   |
| DELETE | `/api/users/:id`   | Delete user   |

---

## Other Scripts

| Command              | Description                        |
|----------------------|------------------------------------|
| `npm run db:studio`  | Open Drizzle Studio (visual DB UI) |
| `npm run dev:server` | Run only the Express server        |
| `npm run dev:client` | Run only the Vite dev server       |
| `npm run build`      | Build the React SPA for production |
