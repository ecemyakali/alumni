const { test, describe, beforeEach } = require('node:test');
const assert = require('node:assert');
const userFactory = require('../factories/userFactory');
const announcementFactory = require('../factories/announcementFactory');
const jobPostingFactory = require('../factories/jobPostingFactory');
const userModel = require('../src/models/userModel');
const announcementModel = require('../src/models/announcementModel');
const jobPostingModel = require('../src/models/jobPostingModel');
const { seedInMemory, runSeed } = require('../scripts/seed');

describe('🏭 Data Factories & Seeding Architecture Tests', () => {
  beforeEach(() => {
    userFactory.reset();
    announcementFactory.reset();
    jobPostingFactory.reset();
    userModel.clear();
    announcementModel.clear();
    jobPostingModel.clear();
  });

  describe('UserFactory Tests', () => {
    test('build() returns a valid mock user with required domain fields', () => {
      const user = userFactory.build();

      assert.ok(user.name, 'User must have a name');
      assert.ok(user.email, 'User must have an email');
      assert.ok(user.department, 'User must have a department');
      assert.ok(user.graduationYear, 'User must have a graduationYear');
      assert.strictEqual(typeof user.graduationYear, 'number');
      assert.ok(['alumni', 'admin', 'faculty', 'student'].includes(user.role));
    });

    test('build() applies custom overrides correctly', () => {
      const user = userFactory.build({
        name: 'Custom Alumni Name',
        email: 'custom.override@alumni.edu',
        department: 'Artificial Intelligence',
        graduationYear: 2027,
        role: 'faculty'
      });

      assert.strictEqual(user.name, 'Custom Alumni Name');
      assert.strictEqual(user.email, 'custom.override@alumni.edu');
      assert.strictEqual(user.department, 'Artificial Intelligence');
      assert.strictEqual(user.graduationYear, 2027);
      assert.strictEqual(user.role, 'faculty');
    });

    test('buildMany() produces specified number of users with unique emails', () => {
      const count = 8;
      const users = userFactory.buildMany(count);

      assert.strictEqual(users.length, count);
      const emails = users.map(u => u.email);
      const uniqueEmails = new Set(emails);
      assert.strictEqual(uniqueEmails.size, count, 'All generated emails must be unique');
    });

    test('reset() resets the internal factory counter', () => {
      const firstUser = userFactory.build();
      userFactory.buildMany(3);
      userFactory.reset();
      const resetUser = userFactory.build();

      assert.strictEqual(firstUser.name, resetUser.name);
      assert.strictEqual(firstUser.email, resetUser.email);
    });
  });

  describe('AnnouncementFactory Tests', () => {
    test('build() returns a valid mock announcement with required domain fields', () => {
      const announcement = announcementFactory.build();

      assert.ok(announcement.title, 'Announcement must have a title');
      assert.ok(announcement.content, 'Announcement must have content');
      assert.ok(announcement.category, 'Announcement must have a category');
      assert.ok(announcement.author, 'Announcement must have an author');
      assert.ok(['low', 'normal', 'high', 'urgent'].includes(announcement.priority));
    });

    test('build() applies custom overrides correctly', () => {
      const announcement = announcementFactory.build({
        title: 'Custom Hackathon 2026',
        category: 'Career',
        priority: 'urgent',
        author: 'Computer Society'
      });

      assert.strictEqual(announcement.title, 'Custom Hackathon 2026');
      assert.strictEqual(announcement.category, 'Career');
      assert.strictEqual(announcement.priority, 'urgent');
      assert.strictEqual(announcement.author, 'Computer Society');
    });

    test('buildMany() produces specified number of announcements', () => {
      const count = 6;
      const announcements = announcementFactory.buildMany(count);

      assert.strictEqual(announcements.length, count);
      assert.ok(announcements.every(a => a.title && a.content));
    });

    test('reset() resets the internal factory counter', () => {
      const firstAnnouncement = announcementFactory.build();
      announcementFactory.buildMany(3);
      announcementFactory.reset();
      const resetAnnouncement = announcementFactory.build();

      assert.strictEqual(firstAnnouncement.title, resetAnnouncement.title);
    });
  });

  describe('JobPostingFactory Tests', () => {
    test('build() returns a valid mock job posting with required domain fields', () => {
      const job = jobPostingFactory.build();

      assert.ok(job.title, 'Job posting must have a title');
      assert.ok(job.company, 'Job posting must have a company');
      assert.ok(job.description, 'Job posting must have a description');
      assert.ok(job.location, 'Job posting must have a location');
      assert.ok(['full-time', 'part-time', 'contract', 'internship', 'remote'].includes(job.type));
      assert.ok(job.contactEmail, 'Job posting must have a contactEmail');
    });

    test('build() applies custom overrides correctly', () => {
      const job = jobPostingFactory.build({
        title: 'Lead Architect',
        company: 'Global Cloud Systems',
        type: 'remote',
        salary: '$150,000'
      });

      assert.strictEqual(job.title, 'Lead Architect');
      assert.strictEqual(job.company, 'Global Cloud Systems');
      assert.strictEqual(job.type, 'remote');
      assert.strictEqual(job.salary, '$150,000');
    });

    test('buildMany() produces specified number of job postings', () => {
      const count = 6;
      const jobs = jobPostingFactory.buildMany(count);

      assert.strictEqual(jobs.length, count);
      assert.ok(jobs.every(j => j.title && j.company && j.description));
    });

    test('reset() resets the internal factory counter', () => {
      const firstJob = jobPostingFactory.build();
      jobPostingFactory.buildMany(3);
      jobPostingFactory.reset();
      const resetJob = jobPostingFactory.build();

      assert.strictEqual(firstJob.title, resetJob.title);
      assert.strictEqual(firstJob.company, resetJob.company);
    });
  });

  describe('Seeder Script Automation Tests', () => {
    test('seedInMemory() populates userModel, announcementModel, and jobPostingModel with factory records', () => {
      const users = userFactory.buildMany(5);
      const announcements = announcementFactory.buildMany(4);
      const jobs = jobPostingFactory.buildMany(3);

      seedInMemory(users, announcements, jobs);

      assert.strictEqual(userModel.count(), 5);
      assert.strictEqual(announcementModel.count(), 4);
      assert.strictEqual(jobPostingModel.count(), 3);

      const foundUser = userModel.findByEmail(users[0].email);
      assert.ok(foundUser);
      assert.strictEqual(foundUser.name, users[0].name);

      const foundJob = jobPostingModel.findById(1);
      assert.ok(foundJob);
      assert.strictEqual(foundJob.title, jobs[0].title);
    });

    test('runSeed() executes without errors and seeds default batches', async () => {
      await runSeed();

      assert.strictEqual(userModel.count(), 10, 'Must seed 10 users into memory');
      assert.strictEqual(announcementModel.count(), 6, 'Must seed 6 announcements into memory');
      assert.strictEqual(jobPostingModel.count(), 6, 'Must seed 6 job postings into memory');
    });
  });
});
