const path = require('path');
const errorGuardian = require('../src/middlewares/errorGuardian');

const DEFAULT_LOG_FILE_PATH = path.resolve(__dirname, '..', 'logs', 'error.logs');

module.exports = {
  DEFAULT_LOG_FILE_PATH,
  appendLogLine: errorGuardian.logErrorToFile,
  logErrorToFile: errorGuardian.logErrorToFile,
  emitLogEvent: (line) => console.log(line)
};
