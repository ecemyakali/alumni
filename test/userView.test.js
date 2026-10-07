const test = require('node:test');
const assert = require('node:assert');
const userView = require('../src/views/userView');
const app = require('../src/app');

test('View Layer (userView) Unit & Integration Tests', async (t) => {
  const sampleUsers = [
    { id: 1, name: 'Ece Yakali', email: 'ece@example.com', role: 'alumni', department: 'Computer Engineering' },
    { id: 2, name: 'John Doe', email: 'john@example.com', role: 'student', department: 'Software Engineering' }
  ];

  await t.test('View Unit: renderUsersList generates HTML with table and form (GET & POST /users)', () => {
    const html = userView.renderUsersList(sampleUsers, { successMessage: 'User created successfully' });

    assert.ok(html.includes('<!DOCTYPE html>'));
    assert.ok(html.includes('Alumni Users Directory'));
    assert.ok(html.includes('Ece Yakali'));
    assert.ok(html.includes('john@example.com'));
    assert.ok(html.includes('<form method="POST" action="/users">'));
    assert.ok(html.includes('name="name"'));
    assert.ok(html.includes('name="email"'));
    assert.ok(html.includes('User created successfully'));
  });

  await t.test('View Unit: renderUserDetail generates single profile view', () => {
    const html = userView.renderUserDetail(sampleUsers[0]);

    assert.ok(html.includes('User Profile: Ece Yakali'));
    assert.ok(html.includes('#1'));
    assert.ok(html.includes('ece@example.com'));
    assert.ok(html.includes('Computer Engineering'));
  });

  await t.test('View Unit: renderError generates semantic error card', () => {
    const html = userView.renderError('User not found', 404);

    assert.ok(html.includes('404 Not Found'));
    assert.ok(html.includes('User not found'));
  });

  await t.test('Integration: GET /users with Accept: text/html serves View layer HTML', async () => {
    const server = app.listen(0);
    const port = server.address().port;
    const baseUrl = `http://localhost:${port}`;

    try {
      const res = await fetch(`${baseUrl}/users`, {
        headers: { 'Accept': 'text/html' }
      });

      assert.strictEqual(res.status, 200);
      const body = await res.text();
      assert.ok(body.includes('<!DOCTYPE html>'));
      assert.ok(body.includes('Alumni Users Directory'));
      assert.ok(body.includes('<form method="POST" action="/users">'));
    } finally {
      server.close();
    }
  });

  await t.test('Integration: POST /users via form-urlencoded submits to View layer', async () => {
    const server = app.listen(0);
    const port = server.address().port;
    const baseUrl = `http://localhost:${port}`;

    try {
      const formParams = new URLSearchParams();
      formParams.append('name', 'View Form User');
      formParams.append('email', 'viewform@example.com');
      formParams.append('role', 'alumni');

      const res = await fetch(`${baseUrl}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'text/html'
        },
        body: formParams.toString()
      });

      assert.strictEqual(res.status, 201);
      const body = await res.text();
      assert.ok(body.includes('<!DOCTYPE html>'));
      assert.ok(body.includes('View Form User'));
      assert.ok(body.includes('registered successfully'));
    } finally {
      server.close();
    }
  });
});
