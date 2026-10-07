const test = require('node:test');
const assert = require('node:assert');
const userModel = require('../src/models/userModel');

test('User Model (In-Memory CRUD) Unit Tests', async (t) => {
  t.beforeEach(() => {
    userModel.clear();
  });

  await t.test('CREATE: should create a new user with auto-increment ID and timestamp', () => {
    const user = userModel.create({
      name: 'Ece Yakali',
      email: 'ece@example.com',
      role: 'alumni',
      department: 'Computer Engineering'
    });

    assert.strictEqual(user.id, 1);
    assert.strictEqual(user.name, 'Ece Yakali');
    assert.strictEqual(user.email, 'ece@example.com');
    assert.strictEqual(user.role, 'alumni');
    assert.strictEqual(user.department, 'Computer Engineering');
    assert.ok(user.createdAt);
    assert.strictEqual(userModel.count(), 1);
  });

  await t.test('READ (findAll): should retrieve all users in memory', () => {
    userModel.create({ name: 'User 1', email: 'user1@example.com' });
    userModel.create({ name: 'User 2', email: 'user2@example.com' });

    const allUsers = userModel.findAll();
    assert.strictEqual(allUsers.length, 2);
    assert.strictEqual(userModel.getAll().length, 2); // alias check
  });

  await t.test('READ (findById): should find a user by ID or return null if not found', () => {
    const created = userModel.create({ name: 'User Test', email: 'test@example.com' });

    const found = userModel.findById(created.id);
    assert.strictEqual(found.name, 'User Test');

    const notFound = userModel.findById(999);
    assert.strictEqual(notFound, null);
  });

  await t.test('READ (findByEmail): should find user by email case-insensitively', () => {
    userModel.create({ name: 'User Email', email: 'ece.yakali@example.com' });

    const found = userModel.findByEmail('ECE.YAKALI@example.com');
    assert.ok(found);
    assert.strictEqual(found.name, 'User Email');

    const notFound = userModel.findByEmail('unknown@example.com');
    assert.strictEqual(notFound, null);
  });

  await t.test('UPDATE: should update existing user fields and set updatedAt', () => {
    const user = userModel.create({ name: 'Original Name', email: 'orig@example.com' });

    const updated = userModel.update(user.id, {
      name: 'Updated Name',
      department: 'Software'
    });

    assert.strictEqual(updated.name, 'Updated Name');
    assert.strictEqual(updated.department, 'Software');
    assert.strictEqual(updated.email, 'orig@example.com'); // preserved
    assert.ok(updated.updatedAt);

    // Verify non-existent ID update returns null
    const notFoundUpdate = userModel.update(999, { name: 'Nobody' });
    assert.strictEqual(notFoundUpdate, null);
  });

  await t.test('DELETE: should remove user by ID and decrease count', () => {
    const user = userModel.create({ name: 'To Delete', email: 'del@example.com' });
    assert.strictEqual(userModel.count(), 1);

    const deleted = userModel.delete(user.id);
    assert.strictEqual(deleted.id, user.id);
    assert.strictEqual(userModel.count(), 0);

    // Verify user is no longer findable
    assert.strictEqual(userModel.findById(user.id), null);

    // Verify non-existent ID delete returns null
    const notFoundDelete = userModel.delete(999);
    assert.strictEqual(notFoundDelete, null);
  });
});
