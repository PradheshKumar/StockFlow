/**
 * errorHandler.js — Centralised Express error middleware.
 */

/** 404 catch-all — must be placed after all valid routes */
export function notFound(req, res, next) {
  const err = new Error(`Not Found — ${req.originalUrl}`);
  err.status = 404;
  next(err);
}

/** Global error handler */
export function errorHandler(err, _req, res, _next) {
  const status  = err.status || err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  if (process.env.NODE_ENV !== 'production') {
    console.error(`[Error ${status}]`, err.stack ?? err);
  }

  res.status(status).json({
    success: false,
    status,
    message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
}
