const test = require('node:test');
const assert = require('node:assert');
const announcementModel = require('../src/models/announcementModel');

test('Announcement Model (In-Memory CRUD) Unit Tests', async (t) => {
  t.beforeEach(() => {
    announcementModel.clear();
  });

  await t.test('CREATE: should create a new announcement with auto ID and timestamp', () => {
    const item = announcementModel.create({
      title: 'Alumni Homecoming 2026',
      content: 'Join us for the annual gathering at the main campus.',
      author: 'President Office',
      category: 'Event',
      priority: 'high'
    });

    assert.strictEqual(item.id, 1);
    assert.strictEqual(item.title, 'Alumni Homecoming 2026');
    assert.strictEqual(item.category, 'Event');
    assert.strictEqual(item.priority, 'high');
    assert.ok(item.createdAt);
    assert.strictEqual(announcementModel.count(), 1);
  });

  await t.test('READ (findAll): should retrieve all announcements', () => {
    announcementModel.create({ title: 'Notice 1', content: 'C1' });
    announcementModel.create({ title: 'Notice 2', content: 'C2' });

    assert.strictEqual(announcementModel.findAll().length, 2);
    assert.strictEqual(announcementModel.getAll().length, 2);
  });

  await t.test('READ (findById): should find by ID or return null', () => {
    const created = announcementModel.create({ title: 'Career Fair', content: 'Details' });

    const found = announcementModel.findById(created.id);
    assert.strictEqual(found.title, 'Career Fair');

    const notFound = announcementModel.findById(999);
    assert.strictEqual(notFound, null);
  });

  await t.test('READ (findByCategory): should filter by category', () => {
    announcementModel.create({ title: 'Job 1', content: 'Dev', category: 'Career' });
    announcementModel.create({ title: 'Meeting', content: 'Annual', category: 'Event' });

    const careers = announcementModel.findByCategory('Career');
    assert.strictEqual(careers.length, 1);
    assert.strictEqual(careers[0].title, 'Job 1');
  });

  await t.test('UPDATE: should update existing announcement fields and set updatedAt', () => {
    const item = announcementModel.create({ title: 'Draft', content: 'Draft content' });

    const updated = announcementModel.update(item.id, {
      title: 'Published Title',
      priority: 'urgent'
    });

    assert.strictEqual(updated.title, 'Published Title');
    assert.strictEqual(updated.priority, 'urgent');
    assert.strictEqual(updated.content, 'Draft content'); // preserved
    assert.ok(updated.updatedAt);

    assert.strictEqual(announcementModel.update(999, { title: 'Ghost' }), null);
  });

  await t.test('DELETE: should remove announcement and decrease count', () => {
    const item = announcementModel.create({ title: 'To Delete', content: 'Text' });
    assert.strictEqual(announcementModel.count(), 1);

    const deleted = announcementModel.delete(item.id);
    assert.strictEqual(deleted.id, item.id);
    assert.strictEqual(announcementModel.count(), 0);
    assert.strictEqual(announcementModel.findById(item.id), null);
    assert.strictEqual(announcementModel.delete(999), null);
  });
});
