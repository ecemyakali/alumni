const test = require('node:test');
const assert = require('node:assert');
const userView = require('../src/views/userView');
const userModel = require('../src/models/userModel');
const app = require('../src/app');

test('View Layer (userView) All CRUD Operations Tests', async (t) => {
  t.beforeEach(() => {
    userModel.clear();
  });

  const sampleUsers = [
    { id: 1, name: 'Ece Yakali', email: 'ece@example.com', role: 'alumni', department: 'Computer Engineering' },
    { id: 2, name: 'John Doe', email: 'john@example.com', role: 'student', department: 'Software Engineering' }
  ];

  await t.test('1. View Unit: renderUsersList generates table with View, Edit, and Delete action buttons', () => {
    const html = userView.renderUsersList(sampleUsers, { successMessage: 'User created successfully' });

    assert.ok(html.includes('<!DOCTYPE html>'));
    assert.ok(html.includes('Alumni Users Directory'));
    assert.ok(html.includes('Ece Yakali'));
    assert.ok(html.includes('john@example.com'));
    assert.ok(html.includes('/users/1'));
    assert.ok(html.includes('/users/1/edit'));
    assert.ok(html.includes('/users/1/delete'));
    assert.ok(html.includes('<form method="POST" action="/users">'));
    assert.ok(html.includes('name="name"'));
    assert.ok(html.includes('name="email"'));
    assert.ok(html.includes('User created successfully'));
  });

  await t.test('2. View Unit: renderUserDetail generates single profile view with edit and delete links', () => {
    const html = userView.renderUserDetail(sampleUsers[0]);

    assert.ok(html.includes('User Profile: Ece Yakali'));
    assert.ok(html.includes('#1'));
    assert.ok(html.includes('ece@example.com'));
    assert.ok(html.includes('Computer Engineering'));
    assert.ok(html.includes('/users/1/edit'));
    assert.ok(html.includes('/users/1/delete'));
  });

  await t.test('3. View Unit: renderEditUserForm generates pre-filled edit form (UPDATE View)', () => {
    const html = userView.renderEditUserForm(sampleUsers[0]);

    assert.ok(html.includes('Edit User #1: Ece Yakali'));
    assert.ok(html.includes('action="/users/1/update"'));
    assert.ok(html.includes('value="Ece Yakali"'));
    assert.ok(html.includes('value="ece@example.com"'));
    assert.ok(html.includes('value="Computer Engineering"'));
    assert.ok(html.includes('Save Changes'));
  });

  await t.test('4. View Unit: renderError generates semantic error card', () => {
    const html = userView.renderError('User not found', 404);

    assert.ok(html.includes('404 Not Found'));
    assert.ok(html.includes('User not found'));
  });

  await t.test('5. Integration CRUD - READ ALL: GET /users renders View layer', async () => {
    const server = app.listen(0);
    const port = server.address().port;
    const baseUrl = `http://localhost:${port}`;

    try {
      userModel.create({ name: 'Alice Test', email: 'alice@example.com' });

      const res = await fetch(`${baseUrl}/users`, {
        headers: { 'Accept': 'text/html' }
      });

      assert.strictEqual(res.status, 200);
      const body = await res.text();
      assert.ok(body.includes('Alice Test'));
      assert.ok(body.includes('/users/1/edit'));
    } finally {
      server.close();
    }
  });

  await t.test('6. Integration CRUD - CREATE: POST /users via form renders View layer with success feedback', async () => {
    const server = app.listen(0);
    const port = server.address().port;
    const baseUrl = `http://localhost:${port}`;

    try {
      const formParams = new URLSearchParams();
      formParams.append('name', 'Created Via Form');
      formParams.append('email', 'form@example.com');
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
      assert.ok(body.includes('Created Via Form'));
      assert.ok(body.includes('registered successfully'));
    } finally {
      server.close();
    }
  });

  await t.test('7. Integration CRUD - READ ONE: GET /users/:id renders profile card View', async () => {
    const server = app.listen(0);
    const port = server.address().port;
    const baseUrl = `http://localhost:${port}`;

    try {
      const u = userModel.create({ name: 'Bob Read', email: 'bob@example.com' });

      const res = await fetch(`${baseUrl}/users/${u.id}`, {
        headers: { 'Accept': 'text/html' }
      });

      assert.strictEqual(res.status, 200);
      const body = await res.text();
      assert.ok(body.includes('User Profile: Bob Read'));
      assert.ok(body.includes('bob@example.com'));
    } finally {
      server.close();
    }
  });

  await t.test('8. Integration CRUD - UPDATE Form: GET /users/:id/edit renders edit form View', async () => {
    const server = app.listen(0);
    const port = server.address().port;
    const baseUrl = `http://localhost:${port}`;

    try {
      const u = userModel.create({ name: 'Charlie Edit', email: 'charlie@example.com', department: 'CS' });

      const res = await fetch(`${baseUrl}/users/${u.id}/edit`, {
        headers: { 'Accept': 'text/html' }
      });

      assert.strictEqual(res.status, 200);
      const body = await res.text();
      assert.ok(body.includes('Edit User'));
      assert.ok(body.includes('Charlie Edit'));
      assert.ok(body.includes('action="/users/1/update"'));
    } finally {
      server.close();
    }
  });

  await t.test('9. Integration CRUD - UPDATE Action: POST /users/:id/update updates and renders profile View', async () => {
    const server = app.listen(0);
    const port = server.address().port;
    const baseUrl = `http://localhost:${port}`;

    try {
      const u = userModel.create({ name: 'Old Name', email: 'old@example.com' });

      const updateParams = new URLSearchParams();
      updateParams.append('name', 'Updated Name View');
      updateParams.append('email', 'updated@example.com');

      const res = await fetch(`${baseUrl}/users/${u.id}/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'text/html'
        },
        body: updateParams.toString()
      });

      assert.strictEqual(res.status, 200);
      const body = await res.text();
      assert.ok(body.includes('Updated Name View'));
      assert.ok(body.includes('updated successfully'));
    } finally {
      server.close();
    }
  });

  await t.test('10. Integration CRUD - DELETE Action: POST /users/:id/delete deletes and renders directory View', async () => {
    const server = app.listen(0);
    const port = server.address().port;
    const baseUrl = `http://localhost:${port}`;

    try {
      const u = userModel.create({ name: 'To Be Deleted', email: 'delview@example.com' });

      const res = await fetch(`${baseUrl}/users/${u.id}/delete`, {
        method: 'POST',
        headers: { 'Accept': 'text/html' }
      });

      assert.strictEqual(res.status, 200);
      const body = await res.text();
      assert.ok(body.includes('deleted successfully'));
      assert.strictEqual(userModel.getById(u.id), null);
    } finally {
      server.close();
    }
  });
});
