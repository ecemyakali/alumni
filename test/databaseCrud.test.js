const { test, describe, beforeEach } = require('node:test');
const assert = require('node:assert');
const userModel = require('../src/models/userModel');
const announcementModel = require('../src/models/announcementModel');
const db = require('../src/config/db');

describe('🗄️ Database-Connected CRUD Interfaces Test Suite', () => {
  beforeEach(() => {
    userModel.clear();
    announcementModel.clear();
  });

  describe('UserModel Database & Fallback CRUD Operations', () => {
    test('isDbConnected() returns a boolean promise', async () => {
      const connected = await userModel.isDbConnected();
      assert.strictEqual(typeof connected, 'boolean');
    });

    test('create() persists user and returns formatted entity (async & sync)', async () => {
      const userData = {
        name: 'Database User',
        email: 'db.user@alumni.edu',
        department: 'Software Engineering',
        graduationYear: 2025,
        role: 'alumni'
      };

      // Test async/await contract
      const createdAsync = await userModel.create(userData);
      assert.ok(createdAsync.id >= 1, 'Entity must have a numeric ID');
      assert.strictEqual(createdAsync.name, 'Database User');
      assert.strictEqual(createdAsync.email, 'db.user@alumni.edu');
      assert.strictEqual(createdAsync.department, 'Software Engineering');
      assert.strictEqual(createdAsync.graduationYear, 2025);
      assert.strictEqual(createdAsync.role, 'alumni');
      assert.ok(createdAsync.createdAt);

      // Verify immediate sync access
      assert.strictEqual(userModel.count(), 1);
    });

    test('findAll() / getAll() retrieves user list matching schema', async () => {
      await userModel.create({ name: 'User One', email: 'one@db.edu' });
      await userModel.create({ name: 'User Two', email: 'two@db.edu' });

      const list = await userModel.findAll();
      assert.ok(Array.isArray(list), 'Must return an array');
      assert.strictEqual(list.length, 2);
      assert.strictEqual(list[0].name, 'User One');
      assert.strictEqual(list[1].name, 'User Two');

      // Alias check
      const aliasList = await userModel.getAll();
      assert.strictEqual(aliasList.length, 2);
    });

    test('findById() / getById() retrieves user by numeric ID', async () => {
      const created = await userModel.create({ name: 'Find Me', email: 'findme@db.edu' });

      const found = await userModel.findById(created.id);
      assert.ok(found);
      assert.strictEqual(found.id, created.id);
      assert.strictEqual(found.name, 'Find Me');

      // Non-existent ID returns null
      const notFound = await userModel.findById(88888);
      assert.strictEqual(notFound, null);
    });

    test('findByEmail() performs case-insensitive search', async () => {
      await userModel.create({ name: 'Email Test', email: 'cAsE.sEnSiTiVe@db.edu' });

      const found = await userModel.findByEmail('case.sensitive@db.edu');
      assert.ok(found);
      assert.strictEqual(found.name, 'Email Test');

      const notFound = await userModel.findByEmail('unknown@db.edu');
      assert.strictEqual(notFound, null);
    });

    test('update() updates entity fields and preserves immutable properties', async () => {
      const created = await userModel.create({ name: 'Before Update', email: 'update@db.edu', department: 'CS' });

      const updated = await userModel.update(created.id, {
        name: 'After Update',
        department: 'AI'
      });

      assert.ok(updated);
      assert.strictEqual(updated.id, created.id);
      assert.strictEqual(updated.name, 'After Update');
      assert.strictEqual(updated.department, 'AI');
      assert.strictEqual(updated.email, 'update@db.edu'); // preserved
      assert.ok(updated.updatedAt);

      // Non-existent ID returns null
      const notFoundUpdate = await userModel.update(99999, { name: 'Nobody' });
      assert.strictEqual(notFoundUpdate, null);
    });

    test('delete() / remove() deletes entity and decreases count', async () => {
      const created = await userModel.create({ name: 'To Be Deleted', email: 'delete@db.edu' });
      assert.strictEqual(userModel.count(), 1);

      const deleted = await userModel.delete(created.id);
      assert.ok(deleted);
      assert.strictEqual(deleted.id, created.id);
      assert.strictEqual(userModel.count(), 0);

      const recheck = await userModel.findById(created.id);
      assert.strictEqual(recheck, null);

      // Non-existent delete returns null
      const notFoundDelete = await userModel.delete(99999);
      assert.strictEqual(notFoundDelete, null);
    });
  });

  describe('AnnouncementModel Database & Fallback CRUD Operations', () => {
    test('isDbConnected() returns a boolean promise', async () => {
      const connected = await announcementModel.isDbConnected();
      assert.strictEqual(typeof connected, 'boolean');
    });

    test('create() persists announcement and returns formatted entity', async () => {
      const announcementData = {
        title: 'Campus Hackathon 2026',
        content: '48-hour coding marathon open to all alumni and senior students.',
        category: 'Career',
        author: 'Dean Office',
        priority: 'urgent'
      };

      const created = await announcementModel.create(announcementData);
      assert.ok(created.id >= 1);
      assert.strictEqual(created.title, 'Campus Hackathon 2026');
      assert.strictEqual(created.category, 'Career');
      assert.strictEqual(created.priority, 'urgent');
      assert.strictEqual(created.author, 'Dean Office');
      assert.ok(created.createdAt);
      assert.strictEqual(announcementModel.count(), 1);
    });

    test('findAll() / getAll() retrieves all announcements', async () => {
      await announcementModel.create({ title: 'A1', content: 'C1' });
      await announcementModel.create({ title: 'A2', content: 'C2' });

      const all = await announcementModel.findAll();
      assert.ok(Array.isArray(all));
      assert.strictEqual(all.length, 2);
    });

    test('findByCategory() filters announcements by category', async () => {
      await announcementModel.create({ title: 'Job Offer', content: 'Dev job', category: 'Career' });
      await announcementModel.create({ title: 'Reunion Gala', content: 'Dinner party', category: 'Event' });

      const careerItems = await announcementModel.findByCategory('Career');
      assert.strictEqual(careerItems.length, 1);
      assert.strictEqual(careerItems[0].title, 'Job Offer');

      const eventItems = await announcementModel.findByCategory('Event');
      assert.strictEqual(eventItems.length, 1);
      assert.strictEqual(eventItems[0].title, 'Reunion Gala');
    });

    test('update() updates announcement fields', async () => {
      const created = await announcementModel.create({ title: 'Old Title', content: 'Old Content' });

      const updated = await announcementModel.update(created.id, {
        title: 'New Title',
        priority: 'high'
      });

      assert.ok(updated);
      assert.strictEqual(updated.title, 'New Title');
      assert.strictEqual(updated.priority, 'high');
      assert.strictEqual(updated.content, 'Old Content'); // preserved

      const notFound = await announcementModel.update(99999, { title: 'Ghost' });
      assert.strictEqual(notFound, null);
    });

    test('delete() removes announcement from storage', async () => {
      const created = await announcementModel.create({ title: 'Delete Me', content: 'Details' });
      assert.strictEqual(announcementModel.count(), 1);

      const deleted = await announcementModel.delete(created.id);
      assert.strictEqual(deleted.id, created.id);
      assert.strictEqual(announcementModel.count(), 0);

      const check = await announcementModel.findById(created.id);
      assert.strictEqual(check, null);
    });
  });

  describe('Database Pool & Resilience Contract', () => {
    test('db module pool has query, connect and close functions', () => {
      assert.strictEqual(typeof db.query, 'function');
      assert.strictEqual(typeof db.getClient, 'function');
      assert.strictEqual(typeof db.testConnection, 'function');
    });

    test('CRUD interfaces remain stable and non-crashing if query throws', async () => {
      // Temporarily mock db.query to throw
      const originalQuery = db.query;
      try {
        db.query = async () => { throw new Error('Simulated DB Network Failure'); };

        const fallbackUser = await userModel.create({
          name: 'Fallback User',
          email: 'fallback@test.com'
        });

        assert.ok(fallbackUser, 'Must gracefully return in-memory record on DB error');
        assert.strictEqual(fallbackUser.name, 'Fallback User');

        const userList = await userModel.findAll();
        assert.ok(Array.isArray(userList));
        assert.ok(userList.some(u => u.name === 'Fallback User'));
      } finally {
        db.query = originalQuery;
      }
    });
  });
});
