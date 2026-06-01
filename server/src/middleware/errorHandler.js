export function notFound(req, res, next) {
  const err = new Error(`Not Found — ${req.originalUrl}`);
  err.status = 404;
  next(err);
}

export function errorHandler(err, _req, res, _next) {
  const status = err.status || err.statusCode || 500;
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    console.error(`[Error ${status}]`, err.stack ?? err);
  }

  // Never expose raw DB or internal error messages in production
  const message = status >= 500 && isProd
    ? 'Internal Server Error'
    : err.message || 'Internal Server Error';

  res.status(status).json({
    success: false,
    status,
    message,
    ...(!isProd && { stack: err.stack }),
  });
}
