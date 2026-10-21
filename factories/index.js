/**
 * ========================================================
 * Factories Aggregator Index
 * File: factories/index.js
 * ========================================================
 */

const userFactory = require('./userFactory');
const announcementFactory = require('./announcementFactory');
const jobPostingFactory = require('./jobPostingFactory');

module.exports = {
  UserFactory: userFactory,
  AnnouncementFactory: announcementFactory,
  JobPostingFactory: jobPostingFactory,
  userFactory,
  announcementFactory,
  jobPostingFactory
};
