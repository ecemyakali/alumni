const test = require('node:test');
const assert = require('node:assert');
const app = require('../src/app');
const userModel = require('../src/models/userModel');
const authUtils = require('../src/utils/authUtils');
const sessionManager = require('../src/utils/sessionManager');

test('Dynamic Role-Based Navigation & User Profile Dashboard Test Suite', async (suite) => {
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

  // Helper to provision user and session
  function createTestUser({ name, email, role = 'alumni', status = 'ACTIVE', password = 'Password123!' }) {
    const passwordHash = authUtils.hashPassword(password);
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
  // 1. Dynamic Role-Based Navigation Tests
  // ========================================================
  await suite.test('1. Unauthenticated navigation renders public links + Log In & Register', async () => {
    const res = await fetch(`${baseUrl}/main`, {
      headers: { Accept: 'text/html' }
    });

    assert.strictEqual(res.status, 200);
    const html = await res.text();

    // Must contain public navigation and guest auth actions
    assert.ok(html.includes('Alumni Directory'));
    assert.ok(html.includes('Career Opportunities'));
    assert.ok(html.includes('Announcements Board'));
    assert.ok(html.includes('Log In'));
    assert.ok(html.includes('Register'));

    // Must NOT contain authenticated member items
    assert.ok(!html.includes('My Profile'));
    assert.ok(!html.includes('Log Out'));
    assert.ok(!html.includes('Admin Panel'));
  });

  await suite.test('2. Authenticated non-admin navigation renders My Profile + user badge + Log Out (no Admin Panel)', async () => {
    const { cookie } = createTestUser({
      name: 'Sarah Alum',
      email: 'sarah@alumni.edu',
      role: 'alumni'
    });

    const res = await fetch(`${baseUrl}/main`, {
      headers: { Cookie: cookie, Accept: 'text/html' }
    });

    assert.strictEqual(res.status, 200);
    const html = await res.text();

    // Authenticated items
    assert.ok(html.includes('My Profile'));
    assert.ok(html.includes('Sarah Alum'));
    assert.ok(html.includes('Log Out'));

    // Unauthenticated and Admin items must be omitted
    assert.ok(!html.includes('Admin Panel'));
    assert.ok(!html.includes('>Register<'));
  });

  await suite.test('3. Authenticated Admin navigation renders My Profile + Admin Panel + Log Out', async () => {
    const { cookie } = createTestUser({
      name: 'Ece Administrator',
      email: 'ece@admin.edu',
      role: 'admin'
    });

    const res = await fetch(`${baseUrl}/main`, {
      headers: { Cookie: cookie, Accept: 'text/html' }
    });

    assert.strictEqual(res.status, 200);
    const html = await res.text();

    // Admin and Authenticated items
    assert.ok(html.includes('My Profile'));
    assert.ok(html.includes('Admin Panel'));
    assert.ok(html.includes('Ece Administrator'));
    assert.ok(html.includes('Log Out'));

    // Unauthenticated actions must be omitted
    assert.ok(!html.includes('>Register<'));
  });

  // ========================================================
  // 2. Profile & Dashboard Route Guards
  // ========================================================
  await suite.test('4. Unauthenticated access to /profile and /dashboard redirects to /login', async () => {
    const resProfile = await fetch(`${baseUrl}/profile`, {
      redirect: 'manual',
      headers: { Accept: 'text/html' }
    });
    assert.strictEqual(resProfile.status, 302);
    assert.strictEqual(resProfile.headers.get('location'), '/login?redirect=%2Fprofile');

    const resDashboard = await fetch(`${baseUrl}/dashboard`, {
      redirect: 'manual',
      headers: { Accept: 'text/html' }
    });
    assert.strictEqual(resDashboard.status, 302);
    assert.strictEqual(resDashboard.headers.get('location'), '/login?redirect=%2Fdashboard');
  });

  await suite.test('5. Authenticated user can load /profile and /dashboard with Mintlify Aurora view', async () => {
    const { cookie } = createTestUser({
      name: 'John Alum',
      email: 'john@example.com',
      role: 'alumni'
    });

    const res = await fetch(`${baseUrl}/profile`, {
      headers: { Cookie: cookie, Accept: 'text/html' }
    });

    assert.strictEqual(res.status, 200);
    const html = await res.text();
    assert.ok(html.includes('My Profile &amp; Dashboard') || html.includes('My Profile & Dashboard'));
    assert.ok(html.includes('John Alum'));
    assert.ok(html.includes('Personal &amp; Career Information') || html.includes('Personal & Career Information'));
    assert.ok(html.includes('Networking &amp; Mentorship Preferences') || html.includes('Networking & Mentorship Preferences'));
    assert.ok(html.includes('Account Security &amp; Credentials') || html.includes('Account Security & Credentials'));
  });

  // ========================================================
  // 3. Profile Updates & Validation
  // ========================================================
  await suite.test('6. POST /profile/update saves profile details and redirects with success', async () => {
    const { user, cookie } = createTestUser({
      name: 'Jane Doe',
      email: 'jane@example.com'
    });

    const formParams = new URLSearchParams();
    formParams.append('name', 'Jane Doe Updated');
    formParams.append('email', 'jane@example.com');
    formParams.append('department', 'Biomedical Engineering');
    formParams.append('graduationYear', '2023');
    formParams.append('company', 'HealthTech Inc');
    formParams.append('currentRole', 'Senior Bioinformatician');
    formParams.append('location', 'Boston, MA');
    formParams.append('linkedinUrl', 'https://linkedin.com/in/janedoe');
    formParams.append('bio', 'Researching computational biology and genetics.');

    const res = await fetch(`${baseUrl}/profile/update`, {
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
    assert.ok(location.includes('/profile?success='));

    const updated = userModel.findById(user.id);
    assert.strictEqual(updated.name, 'Jane Doe Updated');
    assert.strictEqual(updated.department, 'Biomedical Engineering');
    assert.strictEqual(updated.company, 'HealthTech Inc');
    assert.strictEqual(updated.location, 'Boston, MA');
    assert.strictEqual(updated.bio, 'Researching computational biology and genetics.');
  });

  await suite.test('7. POST /profile/update rejects empty required fields or duplicate email', async () => {
    const { cookie } = createTestUser({
      name: 'Primary User',
      email: 'primary@example.com'
    });

    userModel.create({
      name: 'Other User',
      email: 'other@example.com'
    });

    // 1. Missing name
    const formParamsEmpty = new URLSearchParams();
    formParamsEmpty.append('name', '');
    formParamsEmpty.append('email', 'primary@example.com');

    const resEmpty = await fetch(`${baseUrl}/profile/update`, {
      method: 'POST',
      headers: {
        Cookie: cookie,
        Accept: 'text/html',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formParamsEmpty.toString()
    });
    assert.strictEqual(resEmpty.status, 400);
    const htmlEmpty = await resEmpty.text();
    assert.ok(htmlEmpty.includes('required'));

    // 2. Email collision
    const formParamsCollision = new URLSearchParams();
    formParamsCollision.append('name', 'Primary User');
    formParamsCollision.append('email', 'other@example.com');

    const resCollision = await fetch(`${baseUrl}/profile/update`, {
      method: 'POST',
      headers: {
        Cookie: cookie,
        Accept: 'text/html',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formParamsCollision.toString()
    });
    assert.strictEqual(resCollision.status, 409);
    const htmlCollision = await resCollision.text();
    assert.ok(htmlCollision.includes('already associated with another account'));
  });

  // ========================================================
  // 4. Networking & Mentorship Preferences
  // ========================================================
  await suite.test('8. POST /profile/preferences updates mentorship and privacy toggles', async () => {
    const { user, cookie } = createTestUser({
      name: 'Mentor Alum',
      email: 'mentor@alumni.edu'
    });

    const formParams = new URLSearchParams();
    formParams.append('openToMentor', 'true');
    formParams.append('openToWork', 'true');
    formParams.append('profileVisibility', 'alumni_only');
    formParams.append('preferredContact', 'linkedin');

    const res = await fetch(`${baseUrl}/profile/preferences`, {
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
    const updated = userModel.findById(user.id);
    assert.strictEqual(updated.openToMentor, true);
    assert.strictEqual(updated.openToWork, true);
    assert.strictEqual(updated.profileVisibility, 'alumni_only');
    assert.strictEqual(updated.preferredContact, 'linkedin');
  });

  // ========================================================
  // 5. Account Password Changes
  // ========================================================
  await suite.test('9. POST /profile/password changes password with verification', async () => {
    const { user, cookie } = createTestUser({
      name: 'Security User',
      email: 'secure@example.com',
      password: 'OldPassword123!'
    });

    // 1. Wrong current password fails
    const formWrong = new URLSearchParams();
    formWrong.append('currentPassword', 'WrongPass!');
    formWrong.append('newPassword', 'NewValidPass123!');
    formWrong.append('confirmPassword', 'NewValidPass123!');

    const resWrong = await fetch(`${baseUrl}/profile/password`, {
      method: 'POST',
      headers: {
        Cookie: cookie,
        Accept: 'text/html',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formWrong.toString()
    });
    assert.strictEqual(resWrong.status, 401);
    const htmlWrong = await resWrong.text();
    assert.ok(htmlWrong.includes('Incorrect current password'));

    // 2. Successful password change
    const formValid = new URLSearchParams();
    formValid.append('currentPassword', 'OldPassword123!');
    formValid.append('newPassword', 'NewValidPass123!');
    formValid.append('confirmPassword', 'NewValidPass123!');

    const resValid = await fetch(`${baseUrl}/profile/password`, {
      method: 'POST',
      headers: {
        Cookie: cookie,
        Accept: 'text/html',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formValid.toString(),
      redirect: 'manual'
    });
    assert.strictEqual(resValid.status, 302);

    // Verify credential verification succeeds with new password
    const verified = userModel.verifyCredentials('secure@example.com', 'NewValidPass123!');
    assert.notStrictEqual(verified, null);
    assert.strictEqual(verified.id, user.id);
  });

  // ========================================================
  // 6. REST API Profile Endpoints
  // ========================================================
  await suite.test('10. REST API: GET, PUT /api/profile and PUT /api/profile/password work as expected', async () => {
    const { token } = createTestUser({
      name: 'REST User',
      email: 'rest@example.com',
      password: 'InitialPassword123!'
    });

    // 1. GET /api/profile
    const resGet = await fetch(`${baseUrl}/api/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json'
      }
    });
    assert.strictEqual(resGet.status, 200);
    const bodyGet = await resGet.json();
    assert.strictEqual(bodyGet.success, true);
    assert.strictEqual(bodyGet.data.email, 'rest@example.com');
    assert.strictEqual(bodyGet.data.passwordHash, undefined); // Sanitized

    // 2. PUT /api/profile
    const resPut = await fetch(`${baseUrl}/api/profile`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({
        company: 'CloudCorp',
        location: 'Seattle, WA',
        openToMentor: true
      })
    });
    assert.strictEqual(resPut.status, 200);
    const bodyPut = await resPut.json();
    assert.strictEqual(bodyPut.success, true);
    assert.strictEqual(bodyPut.data.company, 'CloudCorp');
    assert.strictEqual(bodyPut.data.openToMentor, true);

    // 3. PUT /api/profile/password
    const resPass = await fetch(`${baseUrl}/api/profile/password`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({
        currentPassword: 'InitialPassword123!',
        newPassword: 'BrandNewPassword123!',
        confirmPassword: 'BrandNewPassword123!'
      })
    });
    assert.strictEqual(resPass.status, 200);
    const bodyPass = await resPass.json();
    assert.strictEqual(bodyPass.success, true);
  });
});
