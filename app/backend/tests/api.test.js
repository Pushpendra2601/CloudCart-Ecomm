const assert = require('node:assert/strict');
const { server } = require('../src/server');

function startServer() {
  return new Promise(resolve => {
    const instance = server.listen(0, '127.0.0.1', () => {
      resolve(instance);
    });
  });
}

async function testHealthAndProducts() {
  const instance = await startServer();
  const baseUrl = `http://127.0.0.1:${instance.address().port}`;

  try {
    const health = await fetch(`${baseUrl}/healthz`);
    assert.equal(health.status, 200);

    const products = await fetch(`${baseUrl}/api/products`);
    assert.equal(products.status, 200);
    const body = await products.json();
    assert.equal(Array.isArray(body.products), true);
    assert.equal(body.products.length > 0, true);
  } finally {
    await new Promise(resolve => instance.close(resolve));
  }
}

async function testOrderCreation() {
  const instance = await startServer();
  const baseUrl = `http://127.0.0.1:${instance.address().port}`;

  try {
    const badOrder = await fetch(`${baseUrl}/api/orders`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({})
    });
    assert.equal(badOrder.status, 400);

    const goodOrder = await fetch(`${baseUrl}/api/orders`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ items: [{ productId: 'sku-1001', quantity: 1 }] })
    });
    assert.equal(goodOrder.status, 201);
  } finally {
    await new Promise(resolve => instance.close(resolve));
  }
}

async function main() {
  await testHealthAndProducts();
  await testOrderCreation();
  console.log('Backend API smoke tests passed');
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
