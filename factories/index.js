/**
 * ========================================================
 * Factories Aggregator Index
 * File: factories/index.js
 * ========================================================
 */

const userFactory = require('./userFactory');
const announcementFactory = require('./announcementFactory');
const jobPostingFactory = require('./jobPostingFactory');
const applicationFactory = require('./applicationFactory');

module.exports = {
  UserFactory: userFactory,
  AnnouncementFactory: announcementFactory,
  JobPostingFactory: jobPostingFactory,
  ApplicationFactory: applicationFactory,
  userFactory,
  announcementFactory,
  jobPostingFactory,
  applicationFactory
};
