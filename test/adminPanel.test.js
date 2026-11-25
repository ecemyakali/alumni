const test = require('node:test');
const assert = require('node:assert');
const app = require('../src/app');
const userModel = require('../src/models/userModel');
const authUtils = require('../src/utils/authUtils');
const sessionManager = require('../src/utils/sessionManager');

test('Admin Panel & Role Management Test Suite', async (suite) => {
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

  // Helper to create an active user and return their session cookie
  function createLoggedInUser({ name, email, role = 'alumni', status = 'ACTIVE' }) {
    const passwordHash = authUtils.hashPassword('Password123!');
    const user = userModel.create({
      name,
      email,
      department: 'Computer Engineering',
      graduationYear: 2024,
      role,
      status,
      currentRole: 'Software Engineer',
      company: 'TechCorp',
      passwordHash
    });

    const session = sessionManager.createSession(user);
    const token = session.token;
    const cookie = `alumni_session=${token}`;
    return { user, token, cookie };
  }

  // ========================================================
  // 1. Authentication & RBAC Route Protection
  // ========================================================
  await suite.test('1. Unauthenticated access to /admin redirects to login with redirect param', async () => {
    const res = await fetch(`${baseUrl}/admin`, {
      redirect: 'manual',
      headers: { Accept: 'text/html' }
    });

    assert.strictEqual(res.status, 302);
    const location = res.headers.get('location');
    assert.strictEqual(location, '/login?redirect=%2Fadmin');
  });

  await suite.test('2. Non-admin user access to /admin returns 403 Forbidden', async () => {
    const { cookie } = createLoggedInUser({
      name: 'Regular Alum',
      email: 'alum@example.com',
      role: 'alumni'
    });

    const res = await fetch(`${baseUrl}/admin`, {
      headers: { Cookie: cookie, Accept: 'text/html' }
    });

    assert.strictEqual(res.status, 403);
    const html = await res.text();
    assert.ok(html.includes('403') || html.includes('Forbidden') || html.includes('Access Denied'));
  });

  await suite.test('3. Authenticated Admin receives 200 OK and Mintlify Aurora dashboard', async () => {
    const { cookie } = createLoggedInUser({
      name: 'Ece Yakali',
      email: 'ece@example.com',
      role: 'admin'
    });

    const res = await fetch(`${baseUrl}/admin`, {
      headers: { Cookie: cookie, Accept: 'text/html' }
    });

    assert.strictEqual(res.status, 200);
    const html = await res.text();
    assert.ok(html.includes('Admin Control Center'));
    assert.ok(html.includes('Total Users'));
    assert.ok(html.includes('Ece Yakali'));
    assert.ok(html.includes('badge-role-admin'));
  });

  // ========================================================
  // 2. Search & Filtering Operations
  // ========================================================
  await suite.test('4. Search query (?q=...) filters users by name, email, department, or company', async () => {
    const { cookie } = createLoggedInUser({
      name: 'Ece Yakali',
      email: 'ece@example.com',
      role: 'admin'
    });

    userModel.create({
      name: 'Alice Johnson',
      email: 'alice@google.com',
      department: 'Electrical Engineering',
      company: 'Google',
      role: 'alumni',
      status: 'ACTIVE'
    });

    userModel.create({
      name: 'Bob Smith',
      email: 'bob@microsoft.com',
      department: 'Industrial Engineering',
      company: 'Microsoft',
      role: 'student',
      status: 'ACTIVE'
    });

    // Search for Alice
    const resAlice = await fetch(`${baseUrl}/admin?q=Alice`, {
      headers: { Cookie: cookie, Accept: 'text/html' }
    });
    const htmlAlice = await resAlice.text();
    assert.ok(htmlAlice.includes('Alice Johnson'));
    assert.ok(!htmlAlice.includes('Bob Smith'));

    // Search by company
    const resCompany = await fetch(`${baseUrl}/admin?q=Microsoft`, {
      headers: { Cookie: cookie, Accept: 'text/html' }
    });
    const htmlCompany = await resCompany.text();
    assert.ok(htmlCompany.includes('Bob Smith'));
    assert.ok(!htmlCompany.includes('Alice Johnson'));

    // Search with no results
    const resEmpty = await fetch(`${baseUrl}/admin?q=NonExistentUserXYZ`, {
      headers: { Cookie: cookie, Accept: 'text/html' }
    });
    const htmlEmpty = await resEmpty.text();
    assert.ok(htmlEmpty.includes('No users found matching your search criteria'));
  });

  await suite.test('5. Role filter (?role=...) isolates specific role entities', async () => {
    const { cookie } = createLoggedInUser({
      name: 'Admin Ece',
      email: 'admin@alumni.edu',
      role: 'admin'
    });

    userModel.create({
      name: 'Student Sam',
      email: 'sam@student.edu',
      role: 'student',
      status: 'ACTIVE'
    });

    const res = await fetch(`${baseUrl}/admin?role=student`, {
      headers: { Cookie: cookie, Accept: 'text/html' }
    });
    const html = await res.text();
    assert.ok(html.includes('Student Sam'));
    assert.ok(!html.includes('admin@alumni.edu'));
  });

  // ========================================================
  // 3. Edit User Form & Update Handling
  // ========================================================
  await suite.test('6. GET /admin/users/:id/edit serves pre-filled edit form', async () => {
    const { cookie } = createLoggedInUser({
      name: 'Ece Admin',
      email: 'ece@example.com',
      role: 'admin'
    });

    const target = userModel.create({
      name: 'Charlie Brown',
      email: 'charlie@example.com',
      department: 'Architecture',
      graduationYear: 2022,
      role: 'alumni',
      status: 'ACTIVE',
      company: 'DesignWorks',
      currentRole: 'Lead Architect'
    });

    const res = await fetch(`${baseUrl}/admin/users/${target.id}/edit`, {
      headers: { Cookie: cookie, Accept: 'text/html' }
    });

    assert.strictEqual(res.status, 200);
    const html = await res.text();
    assert.ok(html.includes('Edit User: Charlie Brown'));
    assert.ok(html.includes('value="Charlie Brown"'));
    assert.ok(html.includes('value="charlie@example.com"'));
    assert.ok(html.includes('DesignWorks'));
  });

  await suite.test('7. POST /admin/users/:id/update updates profile and redirects to dashboard', async () => {
    const { cookie } = createLoggedInUser({
      name: 'Ece Admin',
      email: 'ece@example.com',
      role: 'admin'
    });

    const target = userModel.create({
      name: 'David Miller',
      email: 'david@oldcorp.com',
      department: 'Mechanical',
      role: 'alumni',
      status: 'ACTIVE'
    });

    const formParams = new URLSearchParams();
    formParams.append('name', 'David Miller Updated');
    formParams.append('email', 'david@newcorp.com');
    formParams.append('department', 'Aerospace Engineering');
    formParams.append('graduationYear', '2023');
    formParams.append('role', 'faculty');
    formParams.append('status', 'ACTIVE');
    formParams.append('company', 'NASA');
    formParams.append('currentRole', 'Flight Dynamics Engineer');
    formParams.append('linkedinUrl', 'https://linkedin.com/in/davidmiller');

    const res = await fetch(`${baseUrl}/admin/users/${target.id}/update`, {
      method: 'POST',
      headers: {
        Cookie: cookie,
        Accept: 'text/html',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formParams.toString(),
      redirect: 'manual'
    });

    assert.strictEqual(res.status, 302);
    const location = res.headers.get('location');
    assert.ok(location.includes('/admin?success='));

    const updated = userModel.findById(target.id);
    assert.strictEqual(updated.name, 'David Miller Updated');
    assert.strictEqual(updated.email, 'david@newcorp.com');
    assert.strictEqual(updated.role, 'faculty');
    assert.strictEqual(updated.company, 'NASA');
  });

  await suite.test('8. POST /admin/users/:id/update prevents demoting the last active administrator', async () => {
    // Single admin in the system
    const { user: soleAdmin, cookie } = createLoggedInUser({
      name: 'Sole Administrator',
      email: 'sole@admin.edu',
      role: 'admin',
      status: 'ACTIVE'
    });

    const formParams = new URLSearchParams();
    formParams.append('name', 'Sole Administrator');
    formParams.append('email', 'sole@admin.edu');
    formParams.append('role', 'alumni'); // Demoting
    formParams.append('status', 'ACTIVE');

    const res = await fetch(`${baseUrl}/admin/users/${soleAdmin.id}/update`, {
      method: 'POST',
      headers: {
        Cookie: cookie,
        Accept: 'text/html',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formParams.toString()
    });

    assert.strictEqual(res.status, 422);
    const html = await res.text();
    assert.ok(html.includes('Domain Invariant Violation'));
    assert.ok(html.includes('last active system administrator'));

    // Verify role remained admin
    const check = userModel.findById(soleAdmin.id);
    assert.strictEqual(check.role, 'admin');
  });

  // ========================================================
  // 4. Inline Role & Status Assignment & Invariant Checks
  // ========================================================
  await suite.test('9. Inline POST /admin/users/:id/role updates role', async () => {
    const { cookie } = createLoggedInUser({
      name: 'Super Admin',
      email: 'super@admin.edu',
      role: 'admin'
    });

    const student = userModel.create({
      name: 'Junior Student',
      email: 'junior@student.edu',
      role: 'student',
      status: 'ACTIVE'
    });

    const params = new URLSearchParams();
    params.append('role', 'alumni');

    const res = await fetch(`${baseUrl}/admin/users/${student.id}/role`, {
      method: 'POST',
      headers: {
        Cookie: cookie,
        Accept: 'text/html',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params.toString(),
      redirect: 'manual'
    });

    assert.strictEqual(res.status, 302);
    const updated = userModel.findById(student.id);
    assert.strictEqual(updated.role, 'alumni');
  });

  await suite.test('10. Inline POST /admin/users/:id/status updates status', async () => {
    const { cookie } = createLoggedInUser({
      name: 'Super Admin',
      email: 'super@admin.edu',
      role: 'admin'
    });

    const user = userModel.create({
      name: 'Spam User',
      email: 'spam@bot.com',
      role: 'guest',
      status: 'ACTIVE'
    });

    const params = new URLSearchParams();
    params.append('status', 'SUSPENDED');

    const res = await fetch(`${baseUrl}/admin/users/${user.id}/status`, {
      method: 'POST',
      headers: {
        Cookie: cookie,
        Accept: 'text/html',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params.toString(),
      redirect: 'manual'
    });

    assert.strictEqual(res.status, 302);
    const updated = userModel.findById(user.id);
    assert.strictEqual(updated.status, 'SUSPENDED');
  });

  // ========================================================
  // 5. User Deletion & Invariant Protection
  // ========================================================
  await suite.test('11. POST /admin/users/:id/delete removes user record', async () => {
    const { cookie } = createLoggedInUser({
      name: 'Super Admin',
      email: 'super@admin.edu',
      role: 'admin'
    });

    const user = userModel.create({
      name: 'To Delete',
      email: 'delete@me.com',
      role: 'alumni'
    });

    const initialCount = userModel.count();

    const res = await fetch(`${baseUrl}/admin/users/${user.id}/delete`, {
      method: 'POST',
      headers: { Cookie: cookie, Accept: 'text/html' },
      redirect: 'manual'
    });

    assert.strictEqual(res.status, 302);
    assert.strictEqual(userModel.count(), initialCount - 1);
    assert.strictEqual(userModel.findById(user.id), null);
  });

  await suite.test('12. POST /admin/users/:id/delete prevents deleting the last active admin', async () => {
    const { user: soleAdmin, cookie } = createLoggedInUser({
      name: 'Sole Administrator',
      email: 'sole@admin.edu',
      role: 'admin'
    });

    const res = await fetch(`${baseUrl}/admin/users/${soleAdmin.id}/delete`, {
      method: 'POST',
      headers: { Cookie: cookie, Accept: 'text/html' }
    });

    assert.strictEqual(res.status, 422);
    const html = await res.text();
    assert.ok(html.includes('Domain Invariant Violation'));
    assert.ok(html.includes('Cannot delete the last active system administrator'));

    // Admin must still exist
    assert.notStrictEqual(userModel.findById(soleAdmin.id), null);
  });

  // ========================================================
  // 6. REST API Endpoints
  // ========================================================
  await suite.test('13. PATCH /api/users/:id/status updates status via JSON API', async () => {
    const { token } = createLoggedInUser({
      name: 'Admin API',
      email: 'api@admin.edu',
      role: 'admin'
    });

    const user = userModel.create({
      name: 'Inactive User',
      email: 'inactive@user.edu',
      role: 'alumni',
      status: 'ACTIVE'
    });

    const res = await fetch(`${baseUrl}/api/users/${user.id}/status`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({ status: 'INACTIVE' })
    });

    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.success, true);
    assert.strictEqual(body.data.status, 'INACTIVE');
  });
});
