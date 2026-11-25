const test = require('node:test');
const assert = require('node:assert');
const app = require('../src/app');
const userModel = require('../src/models/userModel');
const authUtils = require('../src/utils/authUtils');
const sessionManager = require('../src/utils/sessionManager');
const { requireAuth, requireRole, requireAdmin } = require('../src/middlewares/authMiddleware');

test('Auth & Role-Based Access Control (RBAC) Test Suite', async (suite) => {
  let server;
  let baseUrl;

  suite.before(() => {
    server = app.listen(0);
    const port = server.address().port;
    baseUrl = `http://localhost:${port}`;
  });

  suite.after(() => {
    if (server) server.close();
  });

  suite.beforeEach(() => {
    userModel.clear();
    sessionManager.clearAll();
  });

  // ========================================================
  // 1. Unit Tests: Middleware Function Signatures & Guards
  // ========================================================
  await suite.test('1. requireAuth Unit: Unauthenticated browser request redirects to /login', () => {
    const req = {
      user: null,
      originalUrl: '/protected-resource',
      headers: { accept: 'text/html' }
    };
    let redirectUrl = null;
    let nextCalled = false;
    const res = {
      redirect(url) { redirectUrl = url; }
    };

    requireAuth(req, res, () => { nextCalled = true; });

    assert.strictEqual(nextCalled, false);
    assert.strictEqual(redirectUrl, '/login?redirect=%2Fprotected-resource');
  });

  await suite.test('2. requireAuth Unit: Unauthenticated API request returns 401 JSON', () => {
    const req = {
      user: null,
      path: '/api/protected',
      headers: { accept: 'application/json' }
    };
    let statusCode = null;
    let jsonBody = null;
    let nextCalled = false;
    const res = {
      status(code) { statusCode = code; return this; },
      json(body) { jsonBody = body; }
    };

    requireAuth(req, res, () => { nextCalled = true; });

    assert.strictEqual(nextCalled, false);
    assert.strictEqual(statusCode, 401);
    assert.strictEqual(jsonBody.success, false);
    assert.ok(jsonBody.error.includes('Authentication required'));
  });

  await suite.test('3. requireRole Unit: Disallows unauthorized role with 403 Forbidden HTML', () => {
    const req = {
      user: { id: 1, name: 'Normal Alum', role: 'alumni' },
      originalUrl: '/admin',
      headers: { accept: 'text/html' }
    };
    let statusCode = null;
    let sentBody = null;
    let nextCalled = false;
    const res = {
      status(code) { statusCode = code; return this; },
      send(body) { sentBody = body; }
    };

    const guard = requireRole('admin');
    guard(req, res, () => { nextCalled = true; });

    assert.strictEqual(nextCalled, false);
    assert.strictEqual(statusCode, 403);
    assert.ok(sentBody.includes('Access Denied'));
    assert.ok(sentBody.includes('403'));
    assert.ok(sentBody.includes('Normal Alum'));
  });

  await suite.test('4. requireRole Unit: Disallows unauthorized role with 403 Forbidden JSON for API', () => {
    const req = {
      user: { id: 2, name: 'Student User', role: 'student' },
      path: '/api/admin/metrics',
      headers: { accept: 'application/json' }
    };
    let statusCode = null;
    let jsonBody = null;
    let nextCalled = false;
    const res = {
      status(code) { statusCode = code; return this; },
      json(body) { jsonBody = body; }
    };

    const guard = requireRole('admin', 'faculty');
    guard(req, res, () => { nextCalled = true; });

    assert.strictEqual(nextCalled, false);
    assert.strictEqual(statusCode, 403);
    assert.strictEqual(jsonBody.success, false);
    assert.ok(jsonBody.error.includes('Insufficient privileges'));
  });

  await suite.test('5. requireRole Unit: Allows authorized role to call next()', () => {
    const req = {
      user: { id: 3, name: 'Site Admin', role: 'admin' },
      originalUrl: '/admin',
      headers: { accept: 'text/html' }
    };
    let nextCalled = false;
    const res = {};

    const guard = requireRole('admin');
    guard(req, res, () => { nextCalled = true; });

    assert.strictEqual(nextCalled, true);
  });

  // ========================================================
  // 2. Integration Tests: /admin Protected Route & RBAC
  // ========================================================
  await suite.test('6. Web Integration: Unauthenticated GET /admin redirects (302) to /login?redirect=%2Fadmin', async () => {
    const res = await fetch(`${baseUrl}/admin`, { redirect: 'manual' });
    assert.strictEqual(res.status, 302);
    assert.strictEqual(res.headers.get('location'), '/login?redirect=%2Fadmin');
  });

  await suite.test('7. Web Integration: Non-admin alumni GET /admin returns HTTP 403 Access Denied view', async () => {
    const alumUser = userModel.create({
      name: 'John Alumnus',
      email: 'john.alum@test.com',
      role: 'alumni'
    });
    const session = sessionManager.createSession(alumUser);

    const res = await fetch(`${baseUrl}/admin`, {
      headers: {
        Cookie: `alumni_session=${session.token}`,
        Accept: 'text/html'
      }
    });

    assert.strictEqual(res.status, 403);
    const body = await res.text();
    assert.ok(body.includes('Access Denied'));
    assert.ok(body.includes('HTTP 403 Forbidden'));
    assert.ok(body.includes('John Alumnus'));
    assert.ok(body.includes('alumni'));
  });

  await suite.test('8. Web Integration: Student GET /admin returns HTTP 403 Access Denied view', async () => {
    const studentUser = userModel.create({
      name: 'Jane Student',
      email: 'jane.student@test.com',
      role: 'student'
    });
    const session = sessionManager.createSession(studentUser);

    const res = await fetch(`${baseUrl}/admin`, {
      headers: {
        Cookie: `alumni_session=${session.token}`,
        Accept: 'text/html'
      }
    });

    assert.strictEqual(res.status, 403);
    const body = await res.text();
    assert.ok(body.includes('Access Denied'));
    assert.ok(body.includes('student'));
  });

  await suite.test('9. Web Integration: Authenticated Admin GET /admin returns HTTP 200 Admin Dashboard', async () => {
    const adminUser = userModel.create({
      name: 'Super Admin',
      email: 'admin@university.edu',
      role: 'admin'
    });
    const session = sessionManager.createSession(adminUser);

    const res = await fetch(`${baseUrl}/admin`, {
      headers: {
        Cookie: `alumni_session=${session.token}`,
        Accept: 'text/html'
      }
    });

    assert.strictEqual(res.status, 200);
    const body = await res.text();
    assert.ok(body.includes('Admin Control Center'));
    assert.ok(body.includes('Super Admin'));
    assert.ok(body.includes('User Role & Access Control Management'));
    assert.ok(body.includes('Total Users'));
  });

  // ========================================================
  // 3. Role Assignment & Last Admin Invariant Protection
  // ========================================================
  await suite.test('10. API Integration: PATCH /api/users/:id/role requires admin role (403 for non-admin)', async () => {
    const alumUser = userModel.create({
      name: 'Normal Alum',
      email: 'alum@test.com',
      role: 'alumni'
    });
    const session = sessionManager.createSession(alumUser);

    const res = await fetch(`${baseUrl}/api/users/${alumUser.id}/role`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${session.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ role: 'faculty' })
    });

    assert.strictEqual(res.status, 403);
    const data = await res.json();
    assert.strictEqual(data.success, false);
    assert.ok(data.error.includes('Insufficient privileges'));
  });

  await suite.test('11. API Integration: Admin can successfully assign new role to user', async () => {
    const adminUser = userModel.create({
      name: 'Chief Admin',
      email: 'chief@university.edu',
      role: 'admin'
    });
    const session = sessionManager.createSession(adminUser);

    const targetUser = userModel.create({
      name: 'Target Alumnus',
      email: 'target@alum.edu',
      role: 'alumni'
    });

    const res = await fetch(`${baseUrl}/api/users/${targetUser.id}/role`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${session.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ role: 'faculty' })
    });

    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.data.role, 'faculty');

    // Verify in model
    const updated = userModel.findById(targetUser.id);
    assert.strictEqual(updated.role, 'faculty');
  });

  await suite.test('12. Invariant Check: Demoting last remaining admin returns HTTP 422 Unprocessable Entity', async () => {
    // Only 1 admin in the system
    const soleAdmin = userModel.create({
      name: 'Sole Administrator',
      email: 'sole.admin@test.com',
      role: 'admin',
      status: 'ACTIVE'
    });
    const session = sessionManager.createSession(soleAdmin);

    assert.strictEqual(userModel.countAdmins(), 1);

    const res = await fetch(`${baseUrl}/api/users/${soleAdmin.id}/role`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${session.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ role: 'alumni' })
    });

    assert.strictEqual(res.status, 422, 'Must reject with 422 when demoting last admin');
    const data = await res.json();
    assert.strictEqual(data.success, false);
    assert.ok(data.error.includes('Cannot demote the last active system administrator'));

    // Verify role remains admin
    const check = userModel.findById(soleAdmin.id);
    assert.strictEqual(check.role, 'admin');
  });

  await suite.test('13. Invariant Check: Demoting an admin succeeds when multiple admins exist', async () => {
    const admin1 = userModel.create({ name: 'Admin 1', email: 'admin1@test.com', role: 'admin' });
    const admin2 = userModel.create({ name: 'Admin 2', email: 'admin2@test.com', role: 'admin' });
    const session = sessionManager.createSession(admin1);

    assert.strictEqual(userModel.countAdmins(), 2);

    const res = await fetch(`${baseUrl}/api/users/${admin2.id}/role`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${session.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ role: 'alumni' })
    });

    assert.strictEqual(res.status, 200);
    const updatedAdmin2 = userModel.findById(admin2.id);
    assert.strictEqual(updatedAdmin2.role, 'alumni');
    assert.strictEqual(userModel.countAdmins(), 1);
  });

  await suite.test('14. Web Form Integration: POST /admin/users/:id/role updates role and redirects (302)', async () => {
    const admin = userModel.create({ name: 'Web Admin', email: 'webadmin@test.com', role: 'admin' });
    const target = userModel.create({ name: 'Target User', email: 'user@test.com', role: 'alumni' });
    const session = sessionManager.createSession(admin);

    const params = new URLSearchParams({ role: 'student' });
    const res = await fetch(`${baseUrl}/admin/users/${target.id}/role`, {
      method: 'POST',
      headers: {
        Cookie: `alumni_session=${session.token}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params.toString(),
      redirect: 'manual'
    });

    assert.strictEqual(res.status, 302);
    assert.ok(res.headers.get('location').includes('/admin?success='));

    const updated = userModel.findById(target.id);
    assert.strictEqual(updated.role, 'student');
  });
});
