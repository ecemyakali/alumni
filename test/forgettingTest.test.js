const { test, describe, beforeEach } = require('node:test');
const assert = require('node:assert');
const userModel = require('../src/models/userModel');
const announcementModel = require('../src/models/announcementModel');
const jobPostingModel = require('../src/models/jobPostingModel');
const applicationModel = require('../src/models/applicationModel');

describe('🧠 The Forgetting Test (Data Volatility Demonstration)', () => {
  beforeEach(() => {
    userModel.clear();
    announcementModel.clear();
    jobPostingModel.clear();
    applicationModel.clear();
  });

  test('Step 1 & 2: Create a record and verify it exists in memory (RAM / Heap)', () => {
    // Check initial state
    assert.strictEqual(userModel.count(), 0);

    // Create a new record in memory
    const newRecord = userModel.create({
      name: 'Forgetting Test User',
      email: 'forgetting.test@alumni.edu',
      department: 'Computer Engineering',
      graduationYear: 2026
    });

    assert.ok(newRecord.id);
    assert.strictEqual(newRecord.name, 'Forgetting Test User');
    assert.strictEqual(userModel.count(), 1);

    // Query record in memory
    const found = userModel.findById(newRecord.id);
    assert.strictEqual(found.name, 'Forgetting Test User');
  });

  test('Step 3 & 4: Simulate docker compose down / container restart and verify data is FORGOTTEN', () => {
    // 1. Create record before restart
    const record = userModel.create({
      name: 'Transient User',
      email: 'transient@alumni.edu'
    });
    assert.strictEqual(userModel.count(), 1);

    // 2. Simulate container destruction / process termination (docker compose down -> memory wiped)
    userModel.clear();

    // 3. Check record after restart (docker compose up -d)
    const checkRecord = userModel.findById(record.id);
    assert.strictEqual(checkRecord, null, 'Record must be null after container/process restart');
    assert.strictEqual(userModel.count(), 0, 'Data in volatile RAM must be wiped (forgotten)');
  });

  test('Announcement Model: Verify volatility behavior on announcement records', () => {
    // 1. Create announcement
    const announcement = announcementModel.create({
      title: 'Forgetting Test Announcement',
      content: 'This announcement lives only in volatile container memory.'
    });
    assert.strictEqual(announcementModel.count(), 1);

    // 2. Simulate container restart (docker down -> docker up)
    announcementModel.clear();

    // 3. Verify record was forgotten
    const checkAnnouncement = announcementModel.findById(announcement.id);
    assert.strictEqual(checkAnnouncement, null);
    assert.strictEqual(announcementModel.count(), 0);
  });

  test('JobPosting Model: Verify volatility behavior on job posting records', () => {
    // 1. Create job posting
    const job = jobPostingModel.create({
      title: 'Forgetting Test Engineer',
      company: 'Ephemeral Cloud Inc',
      description: 'This job posting lives only in volatile container memory.'
    });
    assert.strictEqual(jobPostingModel.count(), 1);

    // 2. Simulate container restart (docker down -> docker up)
    jobPostingModel.clear();

    // 3. Verify record was forgotten
    const checkJob = jobPostingModel.findById(job.id);
    assert.strictEqual(checkJob, null);
    assert.strictEqual(jobPostingModel.count(), 0);
  });

  test('Application Model: Verify volatility behavior on application records', () => {
    // 1. Create application
    const app = applicationModel.create({
      userId: 1,
      jobPostingId: 1,
      status: 'pending',
      resumeUrl: 'https://cdn.example.com/resumes/volatile.pdf'
    });
    assert.strictEqual(applicationModel.count(), 1);

    // 2. Simulate container restart (docker down -> docker up)
    applicationModel.clear();

    // 3. Verify record was forgotten
    const checkApp = applicationModel.findById(app.id);
    assert.strictEqual(checkApp, null);
    assert.strictEqual(applicationModel.count(), 0);
  });
});
