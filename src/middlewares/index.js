const logger = require('./logger');
const notFoundGuardian = require('./notFoundGuardian');
const errorGuardian = require('./errorGuardian');

module.exports = {
  logger,
  createLogger: logger.createLogger,
  formatLogLine: logger.formatLogLine,
  formatTime: logger.formatTime,
  notFoundGuardian,
  guardian404: notFoundGuardian,
  createNotFoundGuardian: () => notFoundGuardian,
  genericNotFoundPageHandler: notFoundGuardian,
  errorGuardian,
  serverErrorGuardian: errorGuardian,
  guardian5xx: errorGuardian,
  createServerErrorGuardian: () => errorGuardian,
  logErrorToFile: errorGuardian.logErrorToFile,
  appendLogLine: errorGuardian.logErrorToFile
};
