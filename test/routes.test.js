const test = require('node:test');
const assert = require('node:assert');
const app = require('../src/app');

test('Whiteboard Routes Test Suite', async (t) => {
  // Start server on an ephemeral port for testing
  const server = app.listen(0);
  const port = server.address().port;
  const baseUrl = `http://localhost:${port}`;

  t.after(() => {
    server.close();
  });

  await t.test('1. GET / responds with "ok"', async () => {
    const res = await fetch(`${baseUrl}/`);
    assert.strictEqual(res.status, 200);
    const body = await res.text();
    assert.strictEqual(body, 'ok');
  });

  await t.test('2. GET /hello responds with "Hello, World!"', async () => {
    const res = await fetch(`${baseUrl}/hello`);
    assert.strictEqual(res.status, 200);
    const body = await res.text();
    assert.strictEqual(body, 'Hello, World!');
  });

  await t.test('3. GET /hello/emre responds with "Hello, Emre!"', async () => {
    const res = await fetch(`${baseUrl}/hello/emre`);
    assert.strictEqual(res.status, 200);
    const body = await res.text();
    assert.strictEqual(body, 'Hello, Emre!');
  });

  await t.test('4. GET /sum/5/10 responds with "15"', async () => {
    const res = await fetch(`${baseUrl}/sum/5/10`);
    assert.strictEqual(res.status, 200);
    const body = await res.text();
    assert.strictEqual(body, '15');
  });

  await t.test('5. GET /main responds with "temporary one main page"', async () => {
    const res = await fetch(`${baseUrl}/main`);
    assert.strictEqual(res.status, 200);
    const body = await res.text();
    assert.strictEqual(body, 'temporary one main page');
  });

  await t.test('5b. GET / with browser Accept header responds with "temporary one main page"', async () => {
    const res = await fetch(`${baseUrl}/`, {
      headers: { 'Accept': 'text/html' }
    });
    assert.strictEqual(res.status, 200);
    const body = await res.text();
    assert.strictEqual(body, 'temporary one main page');
  });

  await t.test('6. GET /about responds with "temp. about page"', async () => {
    const res = await fetch(`${baseUrl}/about`);
    assert.strictEqual(res.status, 200);
    const body = await res.text();
    assert.strictEqual(body, 'temp. about page');
  });

  await t.test('Extra: GET /alumni responds with "ok"', async () => {
    const res = await fetch(`${baseUrl}/alumni`);
    assert.strictEqual(res.status, 200);
    const body = await res.text();
    assert.strictEqual(body, 'ok');
  });
});
