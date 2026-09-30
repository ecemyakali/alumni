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

  await t.test('Task 1: GET /api/health responds with JSON system health', async () => {
    const res = await fetch(`${baseUrl}/api/health`);
    assert.strictEqual(res.status, 200);
    assert.match(res.headers.get('content-type'), /application\/json/);
    const data = await res.json();
    assert.strictEqual(data.status, 'ok');
    assert.strictEqual(data.message, 'System is healthy');
    assert.ok(typeof data.uptime === 'number');
    assert.ok(data.timestamp);
  });

  await t.test('Task 2: POST /api/users adds a user via form-urlencoded', async () => {
    const formParams = new URLSearchParams();
    formParams.append('name', 'Ece Yakali');
    formParams.append('email', 'ece@example.com');
    formParams.append('role', 'alumni');

    const res = await fetch(`${baseUrl}/api/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formParams.toString()
    });

    assert.strictEqual(res.status, 201);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.user.name, 'Ece Yakali');
    assert.strictEqual(data.user.email, 'ece@example.com');
    assert.ok(data.user.id);
  });

  await t.test('Task 2b: GET /api/users returns list of users', async () => {
    const res = await fetch(`${baseUrl}/api/users`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.ok(Array.isArray(data.data));
    assert.ok(data.data.length >= 1);
  });

  await t.test('Task 3: PUT /api/users/:id updates user details', async () => {
    const updateParams = new URLSearchParams();
    updateParams.append('name', 'Ece Yakali Updated');
    updateParams.append('email', 'ece.updated@example.com');
    updateParams.append('department', 'Software Engineering');

    const res = await fetch(`${baseUrl}/api/users/1`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: updateParams.toString()
    });

    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.user.name, 'Ece Yakali Updated');
    assert.strictEqual(data.user.department, 'Software Engineering');
    assert.ok(data.user.updatedAt);
  });

  await t.test('Task 3b: PATCH /api/users/:id partially updates user details', async () => {
    const res = await fetch(`${baseUrl}/api/users/1`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ role: 'senior_alumni' })
    });

    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.user.role, 'senior_alumni');
    assert.strictEqual(data.user.name, 'Ece Yakali Updated'); // preserved
  });

  await t.test('Task 3c: PUT /api/users/999 returns 404 for non-existent user', async () => {
    const res = await fetch(`${baseUrl}/api/users/999`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name: 'Ghost' })
    });

    assert.strictEqual(res.status, 404);
    const data = await res.json();
    assert.strictEqual(data.success, false);
  });

  await t.test('Task 4: DELETE /api/users/:id deletes user', async () => {
    const res = await fetch(`${baseUrl}/api/users/1`, {
      method: 'DELETE'
    });

    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.deletedUser.id, 1);

    // Verify it is really gone
    const verifyRes = await fetch(`${baseUrl}/api/users/1`);
    assert.strictEqual(verifyRes.status, 404);
  });

  await t.test('Task 4b: DELETE /api/users/999 returns 404 for non-existent user', async () => {
    const res = await fetch(`${baseUrl}/api/users/999`, {
      method: 'DELETE'
    });

    assert.strictEqual(res.status, 404);
    const data = await res.json();
    assert.strictEqual(data.success, false);
  });
});
