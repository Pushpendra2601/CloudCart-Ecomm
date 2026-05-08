const http = require('node:http');
const { URL } = require('node:url');

const port = Number(process.env.API_PORT || process.env.PORT || 8080);
const startedAt = Date.now();

const products = [
  { id: 'sku-1001', name: 'Kubernetes Hoodie', price: 49.99, inventory: 42 },
  { id: 'sku-1002', name: 'Docker Bottle', price: 19.99, inventory: 80 },
  { id: 'sku-1003', name: 'Prometheus Mug', price: 14.99, inventory: 57 },
  { id: 'sku-1004', name: 'Grafana Sticker Pack', price: 7.99, inventory: 120 }
];

const orders = [];
const metrics = {
  requests: {},
  latencySeconds: []
};

function json(res, statusCode, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(statusCode, {
    'content-type': 'application/json',
    'content-length': Buffer.byteLength(body)
  });
  res.end(body);
}

function text(res, statusCode, body) {
  res.writeHead(statusCode, {
    'content-type': 'text/plain; version=0.0.4',
    'content-length': Buffer.byteLength(body)
  });
  res.end(body);
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', chunk => {
      raw += chunk;
      if (raw.length > 1024 * 1024) {
        reject(new Error('request body too large'));
        req.destroy();
      }
    });
    req.on('end', () => {
      if (!raw) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(raw));
      } catch (error) {
        reject(error);
      }
    });
    req.on('error', reject);
  });
}

function observe(method, path, statusCode, durationSeconds) {
  const route = path.startsWith('/api/products') ? '/api/products'
    : path.startsWith('/api/orders') ? '/api/orders'
    : path;
  const key = `${method}|${route}|${statusCode}`;
  metrics.requests[key] = (metrics.requests[key] || 0) + 1;
  metrics.latencySeconds.push({ method, route, statusCode, durationSeconds });
  if (metrics.latencySeconds.length > 500) {
    metrics.latencySeconds.shift();
  }
}

function prometheusMetrics() {
  const lines = [
    '# HELP cloudcart_up CloudCart backend availability.',
    '# TYPE cloudcart_up gauge',
    'cloudcart_up 1',
    '# HELP cloudcart_uptime_seconds CloudCart backend uptime in seconds.',
    '# TYPE cloudcart_uptime_seconds gauge',
    `cloudcart_uptime_seconds ${Math.floor((Date.now() - startedAt) / 1000)}`,
    '# HELP cloudcart_orders_total Total orders created.',
    '# TYPE cloudcart_orders_total counter',
    `cloudcart_orders_total ${orders.length}`,
    '# HELP http_requests_total Total HTTP requests.',
    '# TYPE http_requests_total counter'
  ];

  Object.entries(metrics.requests).forEach(([key, count]) => {
    const [method, route, status] = key.split('|');
    lines.push(`http_requests_total{method="${method}",route="${route}",status="${status}"} ${count}`);
  });

  lines.push('# HELP http_request_duration_seconds Recent HTTP request latency in seconds.');
  lines.push('# TYPE http_request_duration_seconds summary');
  metrics.latencySeconds.forEach(sample => {
    lines.push(`http_request_duration_seconds{method="${sample.method}",route="${sample.route}",status="${sample.statusCode}"} ${sample.durationSeconds.toFixed(6)}`);
  });

  return `${lines.join('\n')}\n`;
}

async function router(req, res) {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);

  if (req.method === 'GET' && url.pathname === '/healthz') {
    json(res, 200, { status: 'ok' });
    return;
  }

  if (req.method === 'GET' && url.pathname === '/readyz') {
    json(res, 200, {
      status: 'ready',
      postgresHost: process.env.POSTGRES_HOST || 'not-configured',
      redisHost: process.env.REDIS_HOST || 'not-configured'
    });
    return;
  }

  if (req.method === 'GET' && url.pathname === '/metrics') {
    text(res, 200, prometheusMetrics());
    return;
  }

  if (req.method === 'GET' && url.pathname === '/api/products') {
    json(res, 200, { products });
    return;
  }

  if (req.method === 'GET' && url.pathname === '/api/orders') {
    json(res, 200, { orders });
    return;
  }

  if (req.method === 'POST' && url.pathname === '/api/orders') {
    const body = await readJson(req);
    if (!Array.isArray(body.items) || body.items.length === 0) {
      json(res, 400, { error: 'items must be a non-empty array' });
      return;
    }
    const order = {
      id: `ord-${Date.now()}`,
      items: body.items,
      status: 'accepted',
      createdAt: new Date().toISOString()
    };
    orders.push(order);
    json(res, 201, { order });
    return;
  }

  json(res, 404, { error: 'not found' });
}

const server = http.createServer(async (req, res) => {
  const started = process.hrtime.bigint();
  let statusCode = 500;
  try {
    await router(req, res);
    statusCode = res.statusCode;
  } catch (error) {
    statusCode = error.message === 'request body too large' ? 413 : 500;
    json(res, statusCode, { error: error.message });
  } finally {
    const durationSeconds = Number(process.hrtime.bigint() - started) / 1e9;
    observe(req.method, new URL(req.url, `http://${req.headers.host || 'localhost'}`).pathname, statusCode, durationSeconds);
  }
});

if (require.main === module) {
  server.listen(port, '0.0.0.0', () => {
    console.log(`CloudCart backend listening on ${port}`);
  });
}

module.exports = { server, products, orders };
