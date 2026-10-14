const { test, describe, beforeEach } = require('node:test');
const assert = require('node:assert');
const userFactory = require('../factories/userFactory');
const announcementFactory = require('../factories/announcementFactory');
const userModel = require('../src/models/userModel');
const announcementModel = require('../src/models/announcementModel');
const { seedInMemory, runSeed } = require('../scripts/seed');

describe('🏭 Data Factories & Seeding Architecture Tests', () => {
  beforeEach(() => {
    userFactory.reset();
    announcementFactory.reset();
    userModel.clear();
    announcementModel.clear();
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

  describe('Seeder Script Automation Tests', () => {
    test('seedInMemory() populates userModel and announcementModel with factory records', () => {
      const users = userFactory.buildMany(5);
      const announcements = announcementFactory.buildMany(4);

      seedInMemory(users, announcements);

      assert.strictEqual(userModel.count(), 5);
      assert.strictEqual(announcementModel.count(), 4);

      const foundUser = userModel.findByEmail(users[0].email);
      assert.ok(foundUser);
      assert.strictEqual(foundUser.name, users[0].name);
    });

    test('runSeed() executes without errors and seeds default batches', async () => {
      await runSeed();

      assert.strictEqual(userModel.count(), 10, 'Must seed 10 users into memory');
      assert.strictEqual(announcementModel.count(), 6, 'Must seed 6 announcements into memory');
    });
  });
});
