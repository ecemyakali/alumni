/**
 * ========================================================
 * Factories Aggregator Index
 * File: factories/index.js
 * ========================================================
 */

const userFactory = require('./userFactory');
const announcementFactory = require('./announcementFactory');

module.exports = {
  UserFactory: userFactory,
  AnnouncementFactory: announcementFactory,
  userFactory,
  announcementFactory
};
