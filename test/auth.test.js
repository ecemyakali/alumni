const test = require('node:test');
const assert = require('node:assert');
const app = require('../src/app');
const userModel = require('../src/models/userModel');
const authUtils = require('../src/utils/authUtils');
const authView = require('../src/views/authView');
const sessionManager = require('../src/utils/sessionManager');

test('Authentication & Registration Test Suite', async (suite) => {
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
  // 1. Security & Validation Utilities (authUtils)
  // ========================================================
  await suite.test('1. authUtils: Password Hashing & Comparison', () => {
    const plain = 'StrongPass123!';
    const hash = authUtils.hashPassword(plain);

    assert.ok(hash.startsWith('$2'), 'Hash should be standard bcrypt hash');
    assert.notStrictEqual(hash, plain, 'Hash must not equal plain text password');
    assert.strictEqual(authUtils.comparePassword(plain, hash), true, 'Correct password must compare true');
    assert.strictEqual(authUtils.comparePassword('WrongPass123!', hash), false, 'Incorrect password must compare false');
    assert.strictEqual(authUtils.comparePassword('', hash), false, 'Empty password must compare false');
  });

  await suite.test('2. authUtils: Password Complexity Validation', () => {
    // Valid complex passwords
    assert.strictEqual(authUtils.validatePasswordComplexity('ValidPass1!').isValid, true);
    assert.strictEqual(authUtils.validatePasswordComplexity('P@ssword2026').isValid, true);

    // Invalid: Too short (< 8 chars)
    const shortCheck = authUtils.validatePasswordComplexity('Sh0rt!');
    assert.strictEqual(shortCheck.isValid, false);
    assert.ok(shortCheck.message.includes('at least 8 characters'));

    // Invalid: Missing uppercase
    const noUpper = authUtils.validatePasswordComplexity('lowercase123!');
    assert.strictEqual(noUpper.isValid, false);

    // Invalid: Missing lowercase
    const noLower = authUtils.validatePasswordComplexity('UPPERCASE123!');
    assert.strictEqual(noLower.isValid, false);

    // Invalid: Missing number
    const noNum = authUtils.validatePasswordComplexity('NoNumbersHere!');
    assert.strictEqual(noNum.isValid, false);

    // Invalid: Missing special symbol
    const noSpecial = authUtils.validatePasswordComplexity('NoSpecialChar123');
    assert.strictEqual(noSpecial.isValid, false);
  });

  await suite.test('3. authUtils: Email & Graduation Year Bounds', () => {
    assert.strictEqual(authUtils.validateEmail('user@university.edu'), true);
    assert.strictEqual(authUtils.validateEmail('invalid-email'), false);
    assert.strictEqual(authUtils.validateEmail('user@'), false);

    assert.strictEqual(authUtils.validateGraduationYear(2024), true);
    assert.strictEqual(authUtils.validateGraduationYear('2028'), true);
    assert.strictEqual(authUtils.validateGraduationYear(1940), false);
    assert.strictEqual(authUtils.validateGraduationYear(2150), false);
    assert.strictEqual(authUtils.validateGraduationYear('invalid'), false);
  });

  await suite.test('4. authUtils: Default Non-Admin Role Determination', () => {
    const currentYear = new Date().getFullYear();

    // Past or current year -> 'alumni'
    assert.strictEqual(authUtils.determineDefaultRole(2020), 'alumni');
    assert.strictEqual(authUtils.determineDefaultRole(currentYear), 'alumni');

    // Future year -> 'student'
    assert.strictEqual(authUtils.determineDefaultRole(currentYear + 2), 'student');
  });

  await suite.test('5. authUtils: validateRegistration Aggregate Checker', () => {
    const validData = {
      name: 'Alice Smith',
      email: 'alice@alumni.edu',
      password: 'SecurePassword123!',
      graduationYear: 2022,
      department: 'Computer Engineering'
    };
    const checkValid = authUtils.validateRegistration(validData);
    assert.strictEqual(checkValid.isValid, true);
    assert.strictEqual(checkValid.errors.length, 0);

    const invalidData = {
      name: '',
      email: 'bad-email',
      password: 'weak',
      graduationYear: 1800,
      department: ''
    };
    const checkInvalid = authUtils.validateRegistration(invalidData);
    assert.strictEqual(checkInvalid.isValid, false);
    assert.ok(checkInvalid.errors.length >= 4);
  });

  // ========================================================
  // 2. View Layer (authView)
  // ========================================================
  await suite.test('6. authView: renderRegister View Structure & Input Retention', () => {
    const html = authView.renderRegister({
      formData: {
        name: 'John Doe',
        email: 'john@example.com',
        department: 'Physics',
        graduationYear: 2023
      },
      errors: ['Password is too short']
    });

    assert.ok(html.includes('<title>Create Your Account'), 'Should contain title');
    assert.ok(html.includes('action="/register"'), 'Form action must be /register');
    assert.ok(html.includes('name="name"'), 'Must have name input');
    assert.ok(html.includes('name="email"'), 'Must have email input');
    assert.ok(html.includes('name="password"'), 'Must have password input');
    assert.ok(html.includes('name="confirmPassword"'), 'Must have confirm password input');
    assert.ok(html.includes('name="graduationYear"'), 'Must have graduation year input');
    assert.ok(html.includes('name="department"'), 'Must have department input');
    assert.ok(html.includes('name="currentRole"'), 'Must have current role input');
    assert.ok(html.includes('name="company"'), 'Must have company input');
    assert.ok(html.includes('name="linkedinUrl"'), 'Must have linkedin input');

    // Value retention
    assert.ok(html.includes('value="John Doe"'), 'Preserves entered name');
    assert.ok(html.includes('value="john@example.com"'), 'Preserves entered email');

    // Error alert
    assert.ok(html.includes('Password is too short'), 'Renders error message');
  });

  await suite.test('7. authView: renderRegisterSuccess & renderLogin', () => {
    const successHtml = authView.renderRegisterSuccess({
      id: 42,
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'alumni',
      department: 'Architecture',
      graduationYear: 2021
    });

    assert.ok(successHtml.includes('Welcome, Jane Smith!'), 'Renders welcome message');
    assert.ok(successHtml.includes('#42'), 'Renders account ID');
    assert.ok(successHtml.includes('alumni'), 'Renders assigned role');
    assert.ok(successHtml.includes('Architecture'), 'Renders department');

    const loginHtml = authView.renderLogin({ error: 'Invalid credentials' });
    assert.ok(loginHtml.includes('Welcome Back') || loginHtml.includes('Sign In'));
    assert.ok(loginHtml.includes('Invalid credentials'));
    assert.ok(loginHtml.includes('action="/login"'));
  });

  // ========================================================
  // 3. Web Flow Integration (GET /register & POST /register)
  // ========================================================
  await suite.test('8. Web Integration: GET /register renders page', async () => {
    const res = await fetch(`${baseUrl}/register`);
    assert.strictEqual(res.status, 200);
    assert.ok(res.headers.get('content-type').includes('text/html'));
    const body = await res.text();
    assert.ok(body.includes('Create your Alumni Account'));
  });

  await suite.test('9. Web Integration: POST /register creates user and hashes password', async () => {
    const params = new URLSearchParams({
      name: 'Marcus Aurelius',
      email: 'marcus@stoic.edu',
      password: 'StrongPassword123!',
      graduationYear: '2023',
      department: 'Philosophy',
      currentRole: 'Philosopher Emperor',
      company: 'Rome Inc',
      linkedinUrl: 'https://linkedin.com/in/marcusaurelius'
    });

    const res = await fetch(`${baseUrl}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString()
    });

    assert.strictEqual(res.status, 201);
    const body = await res.text();
    assert.ok(body.includes('Welcome, Marcus Aurelius!'));
    assert.ok(body.includes('alumni'));

    // Verify stored user in UserModel
    const saved = userModel.findByEmail('marcus@stoic.edu');
    assert.ok(saved);
    assert.strictEqual(saved.name, 'Marcus Aurelius');
    assert.strictEqual(saved.role, 'alumni');
    assert.strictEqual(saved.status, 'ACTIVE');
    assert.notStrictEqual(saved.passwordHash, 'StrongPassword123!');
    assert.strictEqual(authUtils.comparePassword('StrongPassword123!', saved.passwordHash), true);
  });

  await suite.test('10. Web Integration: POST /register with future year assigns student role', async () => {
    const currentYear = new Date().getFullYear();
    const futureYear = currentYear + 3;

    const params = new URLSearchParams({
      name: 'Young Student',
      email: 'student@future.edu',
      password: 'StrongStudentPass1!',
      graduationYear: String(futureYear),
      department: 'Bioengineering'
    });

    const res = await fetch(`${baseUrl}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString()
    });

    assert.strictEqual(res.status, 201);
    const body = await res.text();
    assert.ok(body.includes('Current Student'));

    const saved = userModel.findByEmail('student@future.edu');
    assert.strictEqual(saved.role, 'student', 'Should automatically assign student role');
  });

  await suite.test('11. Web Integration: POST /register rejects role elevation (admin tampering)', async () => {
    const params = new URLSearchParams({
      name: 'Hacker User',
      email: 'hacker@malicious.com',
      password: 'HackerPassword123!',
      graduationYear: '2022',
      department: 'Cybersecurity',
      role: 'admin' // Attempted role elevation
    });

    const res = await fetch(`${baseUrl}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString()
    });

    assert.strictEqual(res.status, 201);
    const saved = userModel.findByEmail('hacker@malicious.com');
    assert.strictEqual(saved.role, 'alumni', 'Role tampering must be overridden to alumni');
  });

  await suite.test('12. Web Integration: POST /register rejects weak password with 400', async () => {
    const params = new URLSearchParams({
      name: 'Bob Jones',
      email: 'bob@example.com',
      password: 'weak',
      graduationYear: '2024',
      department: 'Art'
    });

    const res = await fetch(`${baseUrl}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString()
    });

    assert.strictEqual(res.status, 400);
    const body = await res.text();
    assert.ok(body.includes('Password must be at least 8 characters long'));
    assert.strictEqual(userModel.findByEmail('bob@example.com'), null);
  });

  await suite.test('13. Web Integration: POST /register rejects duplicate email with 400', async () => {
    // Register first user
    userModel.create({
      name: 'Existing User',
      email: 'existing@university.edu',
      passwordHash: authUtils.hashPassword('Pass1234!')
    });

    const params = new URLSearchParams({
      name: 'Second User',
      email: 'EXISTING@university.edu', // Case-insensitive collision
      password: 'NewStrongPassword123!',
      graduationYear: '2024',
      department: 'Mathematics'
    });

    const res = await fetch(`${baseUrl}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString()
    });

    assert.strictEqual(res.status, 400);
    const body = await res.text();
    assert.ok(body.includes('An account with this email address already exists'));
  });

  // ========================================================
  // 4. RESTful API Integration (/api/auth/register & /api/auth/login)
  // ========================================================
  await suite.test('14. API Integration: POST /api/auth/register returns 201 and sanitized user', async () => {
    const payload = {
      name: 'API Alumnus',
      email: 'api.alumnus@domain.com',
      password: 'ApiSecurePassword123!',
      graduationYear: 2021,
      department: 'Mechanical Engineering',
      currentRole: 'Robotics Engineer',
      company: 'Boston Dynamics',
      linkedinUrl: 'https://linkedin.com/in/apialumnus'
    };

    const res = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    assert.strictEqual(res.status, 201);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.data.name, 'API Alumnus');
    assert.strictEqual(data.data.email, 'api.alumnus@domain.com');
    assert.strictEqual(data.data.role, 'alumni');
    assert.strictEqual(data.data.passwordHash, undefined, 'passwordHash must never be exposed');
  });

  await suite.test('15. API Integration: POST /api/auth/register rejects invalid data with 400', async () => {
    const payload = {
      name: '',
      email: 'not-an-email',
      password: 'weak'
    };

    const res = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    assert.strictEqual(res.status, 400);
    const data = await res.json();
    assert.strictEqual(data.success, false);
    assert.ok(Array.isArray(data.errors));
    assert.ok(data.errors.length > 0);
  });

  await suite.test('16. API Integration: POST /api/auth/register returns 409 Conflict on duplicate email', async () => {
    userModel.create({
      name: 'Existing Member',
      email: 'member@test.com',
      passwordHash: authUtils.hashPassword('Pass1234!')
    });

    const payload = {
      name: 'Duplicate Member',
      email: 'member@test.com',
      password: 'StrongPassword123!',
      graduationYear: 2024,
      department: 'History'
    };

    const res = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    assert.strictEqual(res.status, 409);
    const data = await res.json();
    assert.strictEqual(data.success, false);
    assert.ok(data.error.includes('already exists'));
  });

  await suite.test('17. API Integration: POST /api/auth/login verifies credentials and issues token', async () => {
    // Register user first
    const plainPass = 'MemberSecret123!';
    userModel.create({
      name: 'Login Test User',
      email: 'login@test.com',
      department: 'Business',
      graduationYear: 2020,
      role: 'alumni',
      passwordHash: authUtils.hashPassword(plainPass)
    });

    // Valid login
    const validRes = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'login@test.com', password: plainPass })
    });
    assert.strictEqual(validRes.status, 200);
    const validData = await validRes.json();
    assert.strictEqual(validData.success, true);
    assert.ok(validData.token, 'Must return session token');
    assert.strictEqual(validData.data.name, 'Login Test User');
    assert.strictEqual(validData.data.passwordHash, undefined);

    // Verify session in sessionManager
    const activeSession = sessionManager.getSession(validData.token);
    assert.ok(activeSession);
    assert.strictEqual(activeSession.email, 'login@test.com');

    // Invalid password
    const invalidRes = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'login@test.com', password: 'WrongPassword123!' })
    });
    assert.strictEqual(invalidRes.status, 401);

    // Non-existent user
    const notFoundRes = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'nonexistent@test.com', password: 'AnyPassword123!' })
    });
    assert.strictEqual(notFoundRes.status, 401);
  });

  // ========================================================
  // 5. Session Management, Web Login & Logout Flows
  // ========================================================
  await suite.test('18. sessionManager: Lifecycle, Expiry and Cookie Extraction', () => {
    const mockUser = { id: 10, name: 'Session User', email: 'session@test.com', role: 'alumni' };
    const session = sessionManager.createSession(mockUser, 5000);

    assert.ok(session.token);
    assert.strictEqual(session.userId, 10);
    assert.strictEqual(sessionManager.count(), 1);

    // Retrieve active session
    const retrieved = sessionManager.getSession(session.token);
    assert.strictEqual(retrieved.token, session.token);

    // Test Cookie parsing
    const parsed = sessionManager.parseCookies(`foo=bar; alumni_session=${session.token}; other=value`);
    assert.strictEqual(parsed.alumni_session, session.token);

    // Extract from mock request with cookie
    const reqWithCookie = { headers: { cookie: `alumni_session=${session.token}` } };
    assert.strictEqual(sessionManager.extractToken(reqWithCookie), session.token);

    // Extract from mock request with Authorization Bearer header
    const reqWithBearer = { headers: { authorization: `Bearer ${session.token}` } };
    assert.strictEqual(sessionManager.extractToken(reqWithBearer), session.token);

    // Destroy session
    assert.strictEqual(sessionManager.destroySession(session.token), true);
    assert.strictEqual(sessionManager.getSession(session.token), null);
    assert.strictEqual(sessionManager.count(), 0);
  });

  await suite.test('19. Web Integration: GET /login renders page with status messages', async () => {
    // Normal GET
    const res = await fetch(`${baseUrl}/login`);
    assert.strictEqual(res.status, 200);
    const body = await res.text();
    assert.ok(body.includes('Welcome Back'));
    assert.ok(body.includes('action="/login"'));

    // Status message for registered
    const resReg = await fetch(`${baseUrl}/login?registered=true`);
    const bodyReg = await resReg.text();
    assert.ok(bodyReg.includes('Account created successfully'));

    // Status message for logged out
    const resLogout = await fetch(`${baseUrl}/login?logged_out=true`);
    const bodyLogout = await resLogout.text();
    assert.ok(bodyLogout.includes('signed out successfully'));
  });

  await suite.test('20. Web Integration: POST /login sets HttpOnly cookie and redirects (302)', async () => {
    const userPass = 'WebSecurePass123!';
    userModel.create({
      name: 'Web Login User',
      email: 'weblogin@university.edu',
      passwordHash: authUtils.hashPassword(userPass),
      role: 'alumni'
    });

    const params = new URLSearchParams({
      email: 'weblogin@university.edu',
      password: userPass
    });

    const res = await fetch(`${baseUrl}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
      redirect: 'manual' // Prevent following redirect to check 302 and Set-Cookie
    });

    assert.strictEqual(res.status, 302, 'Successful login must redirect');
    assert.strictEqual(res.headers.get('location'), '/users');

    const setCookie = res.headers.get('set-cookie');
    assert.ok(setCookie, 'Must include Set-Cookie header');
    assert.ok(setCookie.includes('alumni_session='), 'Cookie name must be alumni_session');
    assert.ok(setCookie.includes('HttpOnly'), 'Must be HttpOnly');
    assert.ok(setCookie.includes('SameSite=Lax'), 'Must be SameSite=Lax');
  });

  await suite.test('21. Web Integration: POST /login rejects invalid credentials with 401', async () => {
    const params = new URLSearchParams({
      email: 'nonexistent@university.edu',
      password: 'WrongPassword123!'
    });

    const res = await fetch(`${baseUrl}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString()
    });

    assert.strictEqual(res.status, 401);
    const body = await res.text();
    assert.ok(body.includes('Invalid email address or password'));
    assert.ok(body.includes('value="nonexistent@university.edu"'), 'Retains submitted email');
  });

  await suite.test('22. Web Integration: GET /logout clears cookie and redirects to /login', async () => {
    // Create an active session
    const mockUser = userModel.create({
      name: 'Logout Alum',
      email: 'logout@alum.edu',
      role: 'alumni'
    });
    const session = sessionManager.createSession(mockUser);

    const res = await fetch(`${baseUrl}/logout`, {
      method: 'GET',
      headers: {
        Cookie: `alumni_session=${session.token}`
      },
      redirect: 'manual'
    });

    assert.strictEqual(res.status, 302);
    assert.strictEqual(res.headers.get('location'), '/login?logged_out=true');

    const setCookie = res.headers.get('set-cookie');
    assert.ok(setCookie);
    assert.ok(setCookie.includes('Expires=Thu, 01 Jan 1970'), 'Cookie must be expired on logout');

    // Verify session revoked in sessionManager
    assert.strictEqual(sessionManager.getSession(session.token), null);
  });

  await suite.test('23. API Integration: POST /api/auth/logout revokes session token', async () => {
    const mockUser = userModel.create({
      name: 'Api Logout User',
      email: 'apilogout@test.com',
      role: 'alumni'
    });
    const session = sessionManager.createSession(mockUser);

    const res = await fetch(`${baseUrl}/api/auth/logout`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${session.token}`
      }
    });

    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.strictEqual(sessionManager.getSession(session.token), null);
  });

  await suite.test('24. API Integration: GET /api/auth/me returns current user identity', async () => {
    const mockUser = userModel.create({
      name: 'Identity User',
      email: 'identity@test.com',
      role: 'alumni',
      department: 'Mathematics'
    });
    const session = sessionManager.createSession(mockUser);

    // With valid Bearer token
    const resWithToken = await fetch(`${baseUrl}/api/auth/me`, {
      headers: { Authorization: `Bearer ${session.token}` }
    });
    assert.strictEqual(resWithToken.status, 200);
    const dataWithToken = await resWithToken.json();
    assert.strictEqual(dataWithToken.success, true);
    assert.strictEqual(dataWithToken.data.name, 'Identity User');
    assert.strictEqual(dataWithToken.data.email, 'identity@test.com');

    // Without token -> 401
    const resNoToken = await fetch(`${baseUrl}/api/auth/me`);
    assert.strictEqual(resNoToken.status, 401);
  });

  await suite.test('25. Global Middleware: attachUser populates user in request and view navbar', async () => {
    const mockUser = userModel.create({
      name: 'Navbar User',
      email: 'navbar@test.com',
      role: 'alumni'
    });
    const session = sessionManager.createSession(mockUser);

    // Make request to /users with cookie
    const res = await fetch(`${baseUrl}/users`, {
      headers: {
        Cookie: `alumni_session=${session.token}`,
        Accept: 'text/html'
      }
    });

    assert.strictEqual(res.status, 200);
    const body = await res.text();
    // Navbar should include the authenticated user badge and Log Out button
    assert.ok(body.includes('Navbar User') || body.includes('Log Out'));
  });
});
