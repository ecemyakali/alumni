const test = require('node:test');
const assert = require('node:assert');
const jobPostingModel = require('../src/models/jobPostingModel');
const { JobPosting } = require('../src/models/jobPostingModel');

test('JobPosting Model (In-Memory & Database Fallback CRUD) Unit Tests', async (t) => {
  t.beforeEach(() => {
    jobPostingModel.clear();
  });

  await t.test('JobPosting Entity: constructor creates instance with default and custom values', () => {
    const job = new JobPosting({
      id: 1,
      title: 'Full-Stack Developer',
      company: 'Tech Corp',
      description: 'Building modern web applications'
    });

    assert.strictEqual(job.id, 1);
    assert.strictEqual(job.title, 'Full-Stack Developer');
    assert.strictEqual(job.company, 'Tech Corp');
    assert.strictEqual(job.location, 'Remote');
    assert.strictEqual(job.type, 'full-time');
    assert.strictEqual(job.description, 'Building modern web applications');
    assert.strictEqual(job.requirements, null);
    assert.strictEqual(job.salary, null);
    assert.strictEqual(job.contactEmail, null);
    assert.strictEqual(job.postedBy, null);
    assert.ok(job.createdAt);
    assert.strictEqual(job.updatedAt, null);
  });

  await t.test('CREATE: should create a new job posting with auto ID and timestamp', async () => {
    const item = await jobPostingModel.create({
      title: 'Software Engineer (Backend)',
      company: 'TechCorp Solutions',
      location: 'Istanbul / Remote',
      type: 'full-time',
      description: 'Designing and developing robust microservices and high-throughput REST APIs.',
      requirements: 'Proficiency in Node.js, Express, PostgreSQL, and Docker.',
      salary: '$75,000 - $95,000',
      contactEmail: 'careers@techcorp.com',
      postedBy: 1
    });

    assert.strictEqual(item.id, 1);
    assert.strictEqual(item.title, 'Software Engineer (Backend)');
    assert.strictEqual(item.company, 'TechCorp Solutions');
    assert.strictEqual(item.location, 'Istanbul / Remote');
    assert.strictEqual(item.type, 'full-time');
    assert.strictEqual(item.salary, '$75,000 - $95,000');
    assert.strictEqual(item.contactEmail, 'careers@techcorp.com');
    assert.strictEqual(item.postedBy, 1);
    assert.ok(item.createdAt);
    assert.strictEqual(item.updatedAt, null);
    assert.strictEqual(jobPostingModel.count(), 1);
  });

  await t.test('CREATE: throws error if data is missing or not an object', () => {
    assert.throws(() => jobPostingModel.create(null), /must be an object/);
    assert.throws(() => jobPostingModel.create('invalid'), /must be an object/);
  });

  await t.test('READ (findAll & getAll): should retrieve all job postings', async () => {
    await jobPostingModel.create({ title: 'Dev 1', company: 'Comp A', description: 'Desc 1' });
    await jobPostingModel.create({ title: 'Dev 2', company: 'Comp B', description: 'Desc 2' });

    const all = await jobPostingModel.findAll();
    const aliasAll = await jobPostingModel.getAll();

    assert.strictEqual(all.length, 2);
    assert.strictEqual(aliasAll.length, 2);
    assert.strictEqual(all[0].title, 'Dev 1');
    assert.strictEqual(all[1].title, 'Dev 2');
  });

  await t.test('READ (findById & getById): should find by ID or return null', async () => {
    const created = await jobPostingModel.create({
      title: 'Data Analyst',
      company: 'Analytics Co',
      description: 'Analyzing data'
    });

    const found = await jobPostingModel.findById(created.id);
    assert.ok(found);
    assert.strictEqual(found.title, 'Data Analyst');
    assert.strictEqual(found.company, 'Analytics Co');

    const foundAlias = await jobPostingModel.getById(created.id);
    assert.strictEqual(foundAlias.id, created.id);

    const notFound = await jobPostingModel.findById(999);
    assert.strictEqual(notFound, null);

    const invalidId = await jobPostingModel.findById('abc');
    assert.strictEqual(invalidId, null);
  });

  await t.test('READ (findByCompany): should filter by company case-insensitively', async () => {
    await jobPostingModel.create({ title: 'Frontend Dev', company: 'Google', description: 'Web UI' });
    await jobPostingModel.create({ title: 'Backend Dev', company: 'google', description: 'Cloud' });
    await jobPostingModel.create({ title: 'Designer', company: 'Meta', description: 'Product' });

    const googleJobs = await jobPostingModel.findByCompany('GOOGLE');
    assert.strictEqual(googleJobs.length, 2);

    const empty = await jobPostingModel.findByCompany('');
    assert.strictEqual(empty.length, 0);

    const nonExistent = await jobPostingModel.findByCompany('Apple');
    assert.strictEqual(nonExistent.length, 0);
  });

  await t.test('READ (findByType): should filter by employment type case-insensitively', async () => {
    await jobPostingModel.create({ title: 'Job 1', company: 'A', type: 'internship', description: 'D1' });
    await jobPostingModel.create({ title: 'Job 2', company: 'B', type: 'full-time', description: 'D2' });
    await jobPostingModel.create({ title: 'Job 3', company: 'C', type: 'internship', description: 'D3' });

    const internships = await jobPostingModel.findByType('INTERNSHIP');
    assert.strictEqual(internships.length, 2);

    const empty = await jobPostingModel.findByType('');
    assert.strictEqual(empty.length, 0);
  });

  await t.test('UPDATE: should update existing job posting fields and set updatedAt', async () => {
    const item = await jobPostingModel.create({
      title: 'Junior Dev',
      company: 'StartUp',
      description: 'Entry level'
    });

    const updated = await jobPostingModel.update(item.id, {
      title: 'Mid-Level Dev',
      salary: '$60,000'
    });

    assert.ok(updated);
    assert.strictEqual(updated.id, item.id);
    assert.strictEqual(updated.title, 'Mid-Level Dev');
    assert.strictEqual(updated.company, 'StartUp'); // preserved
    assert.strictEqual(updated.salary, '$60,000');
    assert.ok(updated.updatedAt);

    const notFound = await jobPostingModel.update(999, { title: 'Ghost' });
    assert.strictEqual(notFound, null);

    const invalidId = await jobPostingModel.update('xyz', { title: 'Ghost' });
    assert.strictEqual(invalidId, null);
  });

  await t.test('DELETE & remove: should remove job posting and decrease count', async () => {
    const item = await jobPostingModel.create({
      title: 'Temporary Role',
      company: 'Contract Co',
      description: 'Short term'
    });
    assert.strictEqual(jobPostingModel.count(), 1);

    const deleted = await jobPostingModel.delete(item.id);
    assert.ok(deleted);
    assert.strictEqual(deleted.id, item.id);
    assert.strictEqual(jobPostingModel.count(), 0);
    assert.strictEqual(await jobPostingModel.findById(item.id), null);

    // Re-delete non-existent
    assert.strictEqual(await jobPostingModel.delete(999), null);
    assert.strictEqual(await jobPostingModel.remove('invalid'), null);
  });

  await t.test('CLEAR & isDbConnected: resets store and checks connection status', async () => {
    await jobPostingModel.create({ title: 'J1', company: 'C1', description: 'D1' });
    assert.strictEqual(jobPostingModel.count(), 1);

    jobPostingModel.clear();
    assert.strictEqual(jobPostingModel.count(), 0);

    const connected = await jobPostingModel.isDbConnected();
    assert.strictEqual(typeof connected, 'boolean');
  });
});
