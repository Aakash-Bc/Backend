// routermiddleware.js
// Practice Router Middleware: Logs route access, attaches metadata, and does basic request sanitization
// Compatible with Express.js routers

module.exports = function routerMiddleware(req, res, next) {
  const start = Date.now();
  const route = req.path || req.url;
  const method = req.method;

  console.log(`[Router] → ${method} ${route}`);

  // Practice: Basic request body sanitization
  if (req.body && typeof req.body === 'object' && !Array.isArray(req.body)) {
    const unsafeKeys = ['__proto__', 'constructor', 'prototype'];
    unsafeKeys.forEach(key => {
      if (Object.prototype.hasOwnProperty.call(req.body, key)) {
        delete req.body[key];
        console.warn(`[Router] ⚠️ Stripped unsafe key: ${key}`);
      }
    });
  }

  // Attach route metadata for downstream controllers/middleware
  req.routerMeta = {
    accessedAt: new Date().toISOString(),
    method,
    route,
    ip: req.ip || req.socket?.remoteAddress || 'unknown'
  };

  // Log response timing after the request finishes
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[Router] ← ${method} ${route} → ${res.statusCode} (${duration}ms)`);
  });

  next();
};