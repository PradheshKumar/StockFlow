import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

import apiRouter from './routes/index.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

const app = express();

// ── Middleware ────────────────────────────────────────────
app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// ── Routes ────────────────────────────────────────────────
app.use('/api', apiRouter);

// Health check
app.get('/health', (_req, res) =>
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
);

// ── Error handling (keep last) ────────────────────────────
app.use(notFound);
app.use(errorHandler);

export default app;
