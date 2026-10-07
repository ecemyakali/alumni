const test = require('node:test');
const assert = require('node:assert');
const userModel = require('../src/models/userModel');
const apiUserController = require('../src/controllers/apiUserController');
const userController = require('../src/controllers/userController');

// Helper to create mock response object
function createMockRes() {
  return {
    statusCode: 200,
    headers: {},
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    },
    send(payload) {
      this.body = payload;
      return this;
    }
  };
}

test('Controller Layer Unit Tests (UserController & ApiUserController)', async (t) => {
  t.beforeEach(() => {
    userModel.clear();
  });

  await t.test('ApiUserController: Complete CRUD Operations', async (st) => {
    await st.test('CREATE: should create user and return 201 JSON', () => {
      const req = { body: { name: 'API User', email: 'api@example.com' } };
      const res = createMockRes();

      apiUserController.createUser(req, res);

      assert.strictEqual(res.statusCode, 201);
      assert.strictEqual(res.body.success, true);
      assert.strictEqual(res.body.user.name, 'API User');
      assert.strictEqual(res.body.totalUsers, 1);
    });

    await st.test('CREATE: should return 400 if body is empty', () => {
      const req = { body: {} };
      const res = createMockRes();

      apiUserController.createUser(req, res);

      assert.strictEqual(res.statusCode, 400);
      assert.strictEqual(res.body.success, false);
    });

    await st.test('READ (All): should return 200 and list of users', () => {
      userModel.create({ name: 'User 1', email: 'u1@example.com' });
      const req = {};
      const res = createMockRes();

      apiUserController.getAllUsers(req, res);

      assert.strictEqual(res.statusCode, 200);
      assert.strictEqual(res.body.success, true);
      assert.strictEqual(res.body.count, 1);
    });

    await st.test('READ (ID): should return 200 for existing user or 404 for non-existent', () => {
      const u = userModel.create({ name: 'User Exists', email: 'exists@example.com' });
      const reqFound = { params: { id: u.id.toString() } };
      const resFound = createMockRes();

      apiUserController.getUserById(reqFound, resFound);
      assert.strictEqual(resFound.statusCode, 200);
      assert.strictEqual(resFound.body.data.name, 'User Exists');

      const reqMissing = { params: { id: '999' } };
      const resMissing = createMockRes();

      apiUserController.getUserById(reqMissing, resMissing);
      assert.strictEqual(resMissing.statusCode, 404);
      assert.strictEqual(resMissing.body.success, false);
    });

    await st.test('UPDATE: should update user or return appropriate error status', () => {
      const u = userModel.create({ name: 'To Update', email: 'up@example.com' });
      const req = { params: { id: u.id.toString() }, body: { name: 'Updated Name' } };
      const res = createMockRes();

      apiUserController.updateUser(req, res);
      assert.strictEqual(res.statusCode, 200);
      assert.strictEqual(res.body.user.name, 'Updated Name');

      // 404 on missing
      const res404 = createMockRes();
      apiUserController.updateUser({ params: { id: '999' }, body: { name: 'Ghost' } }, res404);
      assert.strictEqual(res404.statusCode, 404);

      // 400 on empty body
      const res400 = createMockRes();
      apiUserController.updateUser({ params: { id: u.id.toString() }, body: {} }, res400);
      assert.strictEqual(res400.statusCode, 400);
    });

    await st.test('DELETE: should remove user or return 404 if not found', () => {
      const u = userModel.create({ name: 'To Delete', email: 'del@example.com' });
      const req = { params: { id: u.id.toString() } };
      const res = createMockRes();

      apiUserController.deleteUser(req, res);
      assert.strictEqual(res.statusCode, 200);
      assert.strictEqual(res.body.success, true);
      assert.strictEqual(res.body.deletedUser.id, u.id);

      // 404 on missing
      const res404 = createMockRes();
      apiUserController.deleteUser({ params: { id: '999' } }, res404);
      assert.strictEqual(res404.statusCode, 404);
    });
  });

  await t.test('UserController: Web CRUD Operations & Content Negotiation', async (st) => {
    await st.test('CREATE: should create user and support HTML response', () => {
      const reqHtml = {
        headers: { accept: 'text/html' },
        body: { name: 'Web User', email: 'web@example.com' }
      };
      const resHtml = createMockRes();

      userController.createUser(reqHtml, resHtml);
      assert.strictEqual(resHtml.statusCode, 201);
      assert.ok(typeof resHtml.body === 'string');
      assert.ok(resHtml.body.includes('Welcome, Web User!'));
    });

    await st.test('READ (All): should render HTML user list when Accept: text/html', () => {
      userModel.create({ name: 'Alumnus A', email: 'a@example.com' });
      const req = { headers: { accept: 'text/html' } };
      const res = createMockRes();

      userController.getAllUsers(req, res);
      assert.strictEqual(res.statusCode, 200);
      assert.ok(res.body.includes('Alumni Users Directory'));
      assert.ok(res.body.includes('Alumnus A'));
    });

    await st.test('READ (ID): should render HTML profile or 404 HTML', () => {
      const u = userModel.create({ name: 'Profile User', email: 'p@example.com' });
      const req = { headers: { accept: 'text/html' }, params: { id: u.id.toString() } };
      const res = createMockRes();

      userController.getUserById(req, res);
      assert.strictEqual(res.statusCode, 200);
      assert.ok(res.body.includes('User Profile'));
      assert.ok(res.body.includes('Profile User'));

      const res404 = createMockRes();
      userController.getUserById({ headers: { accept: 'text/html' }, params: { id: '999' } }, res404);
      assert.strictEqual(res404.statusCode, 404);
      assert.ok(res404.body.includes('404 Not Found'));
    });

    await st.test('UPDATE & DELETE: should perform mutations via UserController', () => {
      const u = userModel.create({ name: 'Mutate Me', email: 'm@example.com' });
      
      const resUp = createMockRes();
      userController.updateUser({ headers: {}, params: { id: u.id.toString() }, body: { name: 'Mutated' } }, resUp);
      assert.strictEqual(resUp.statusCode, 200);
      assert.strictEqual(resUp.body.user.name, 'Mutated');

      const resDel = createMockRes();
      userController.deleteUser({ headers: {}, params: { id: u.id.toString() } }, resDel);
      assert.strictEqual(resDel.statusCode, 200);
      assert.strictEqual(resDel.body.success, true);
    });
  });
});
