/**
 * validate.js — Lightweight request-validation middleware factory.
 * Usage: router.post('/', validate(schema), controller)
 *
 * `schema` is a plain object where each key maps to a validator fn
 * that returns a string (error message) or null/undefined (valid).
 *
 * Example schema:
 *   { body: { email: (v) => !v && 'Email is required' } }
 */

export function validate(schema) {
  return (req, res, next) => {
    const errors = [];

    for (const [source, fields] of Object.entries(schema)) {
      const data = req[source];       // req.body | req.params | req.query
      for (const [field, validator] of Object.entries(fields)) {
        const msg = validator(data?.[field], data);
        if (msg) errors.push({ field: `${source}.${field}`, message: msg });
      }
    }

    if (errors.length) {
      return res.status(422).json({ success: false, errors });
    }
    next();
  };
}
