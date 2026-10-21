const test = require('node:test');
const assert = require('node:assert');
const userModel = require('../src/models/userModel');
const jobPostingModel = require('../src/models/jobPostingModel');
const applicationModel = require('../src/models/applicationModel');
const { Application } = require('../src/models/applicationModel');

test('Application Model & Relations Unit Tests', async (t) => {
  t.beforeEach(() => {
    userModel.clear();
    jobPostingModel.clear();
    applicationModel.clear();
  });

  await t.test('Application Entity: constructor sets default values', () => {
    const app = new Application({
      id: 1,
      userId: 10,
      jobPostingId: 20
    });

    assert.strictEqual(app.id, 1);
    assert.strictEqual(app.userId, 10);
    assert.strictEqual(app.jobPostingId, 20);
    assert.strictEqual(app.status, 'pending');
    assert.strictEqual(app.resumeUrl, null);
    assert.strictEqual(app.coverNote, null);
    assert.ok(app.createdAt);
    assert.strictEqual(app.updatedAt, null);
  });

  await t.test('CREATE: should create a new application record', async () => {
    const app = await applicationModel.create({
      userId: 1,
      jobPostingId: 2,
      resumeUrl: 'https://cv.alumni.edu/user1.pdf',
      coverNote: 'Excited to apply for this backend role!'
    });

    assert.strictEqual(app.id, 1);
    assert.strictEqual(app.userId, 1);
    assert.strictEqual(app.jobPostingId, 2);
    assert.strictEqual(app.status, 'pending');
    assert.strictEqual(app.resumeUrl, 'https://cv.alumni.edu/user1.pdf');
    assert.strictEqual(app.coverNote, 'Excited to apply for this backend role!');
    assert.ok(app.createdAt);
    assert.strictEqual(applicationModel.count(), 1);
  });

  await t.test('CREATE: throws error if userId or jobPostingId is missing', () => {
    assert.throws(() => applicationModel.create({ userId: 1 }), /Valid userId and jobPostingId/);
    assert.throws(() => applicationModel.create({ jobPostingId: 2 }), /Valid userId and jobPostingId/);
    assert.throws(() => applicationModel.create(null), /must be an object/);
  });

  await t.test('CREATE: enforces unique composite constraint (cannot apply twice to same job)', async () => {
    await applicationModel.create({ userId: 1, jobPostingId: 100 });

    assert.throws(() => {
      applicationModel.create({ userId: 1, jobPostingId: 100 });
    }, /already exists/);
  });

  await t.test('READ (findAll & getAll): retrieves all applications', async () => {
    await applicationModel.create({ userId: 1, jobPostingId: 10 });
    await applicationModel.create({ userId: 2, jobPostingId: 10 });

    const all = await applicationModel.findAll();
    assert.strictEqual(all.length, 2);
    assert.strictEqual(applicationModel.getAll().length, 2);
  });

  await t.test('READ (findById & getById): retrieves single item or null', async () => {
    const created = await applicationModel.create({ userId: 5, jobPostingId: 10 });

    const found = await applicationModel.findById(created.id);
    assert.ok(found);
    assert.strictEqual(found.userId, 5);

    const foundAlias = await applicationModel.getById(created.id);
    assert.strictEqual(foundAlias.id, created.id);

    assert.strictEqual(await applicationModel.findById(999), null);
    assert.strictEqual(await applicationModel.findById('xyz'), null);
  });

  await t.test('RELATIONS: findByUserId, findByJobPostingId, findByUserAndJob', async () => {
    await applicationModel.create({ userId: 1, jobPostingId: 10 });
    await applicationModel.create({ userId: 1, jobPostingId: 20 });
    await applicationModel.create({ userId: 2, jobPostingId: 10 });

    // Applications submitted by User 1
    const user1Apps = await applicationModel.findByUserId(1);
    assert.strictEqual(user1Apps.length, 2);

    // Applications for Job 10
    const job10Apps = await applicationModel.findByJobPostingId(10);
    assert.strictEqual(job10Apps.length, 2);

    // User 1 applied to Job 10
    const checkApp = await applicationModel.findByUserAndJob(1, 10);
    assert.ok(checkApp);
    assert.strictEqual(checkApp.userId, 1);
    assert.strictEqual(checkApp.jobPostingId, 10);

    // User 2 did NOT apply to Job 20
    const checkNoApp = await applicationModel.findByUserAndJob(2, 20);
    assert.strictEqual(checkNoApp, null);

    // Integration via model relation helpers
    const userModelApps = await userModel.getApplications(1);
    assert.strictEqual(userModelApps.length, 2);

    const jobPostingModelApps = await jobPostingModel.getApplications(10);
    assert.strictEqual(jobPostingModelApps.length, 2);
  });

  await t.test('UPDATE: updates application status and sets updatedAt', async () => {
    const item = await applicationModel.create({ userId: 1, jobPostingId: 10, status: 'pending' });

    const updated = await applicationModel.update(item.id, {
      status: 'accepted',
      coverNote: 'Updated cover letter'
    });

    assert.ok(updated);
    assert.strictEqual(updated.status, 'accepted');
    assert.strictEqual(updated.coverNote, 'Updated cover letter');
    assert.ok(updated.updatedAt);

    assert.strictEqual(await applicationModel.update(999, { status: 'rejected' }), null);
  });

  await t.test('DELETE & remove: deletes application and decreases count', async () => {
    const item = await applicationModel.create({ userId: 1, jobPostingId: 10 });
    assert.strictEqual(applicationModel.count(), 1);

    const deleted = await applicationModel.delete(item.id);
    assert.ok(deleted);
    assert.strictEqual(deleted.id, item.id);
    assert.strictEqual(applicationModel.count(), 0);

    assert.strictEqual(await applicationModel.delete(999), null);
    assert.strictEqual(await applicationModel.remove('invalid'), null);
  });

  await t.test('CLEAR & isDbConnected: resets store and checks connection status', async () => {
    await applicationModel.create({ userId: 1, jobPostingId: 10 });
    assert.strictEqual(applicationModel.count(), 1);

    applicationModel.clear();
    assert.strictEqual(applicationModel.count(), 0);

    const isConnected = await applicationModel.isDbConnected();
    assert.strictEqual(typeof isConnected, 'boolean');
  });
});
