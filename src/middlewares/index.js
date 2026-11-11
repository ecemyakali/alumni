const logger = require('./logger');
const notFoundGuardian = require('./notFoundGuardian');
const errorGuardian = require('./errorGuardian');

module.exports = {
  logger,
  notFoundGuardian,
  guardian404: notFoundGuardian,
  errorGuardian,
  guardian5xx: errorGuardian
};
