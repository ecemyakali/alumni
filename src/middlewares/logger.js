/**
 * Terminal Request Logger Middleware
 * File: src/middlewares/logger.js
 * 
 * Intercepts incoming HTTP requests and outputs formatted execution logs to the terminal:
 * Example row:
 * time(10:20:30 ) method (post) route( /user)  res type(201) duration (18 ms)
 */

/**
 * Formats a Date object into HH:MM:SS string
 * @param {Date} [date=new Date()]
 * @returns {string} e.g. "10:20:30"
 */
function formatTime(date = new Date()) {
  const pad = (n) => String(n).padStart(2, '0');
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());
  return `${hours}:${minutes}:${seconds}`;
}

/**
 * Generates the standardized log row string
 * @param {Object} params
 * @param {string} params.time - Formatted time string (HH:MM:SS)
 * @param {string} params.method - HTTP method in lowercase (e.g. 'post', 'get')
 * @param {string} params.route - Request URL / path (e.g. '/user')
 * @param {number|string} params.statusCode - HTTP response status code (e.g. 201)
 * @param {number|string} params.duration - Duration in milliseconds (e.g. 18)
 * @returns {string} Formatted log line
 */
function formatLogLine({ time, method, route, statusCode, duration }) {
  // Ensure route has a leading space after '(' as in the requirement: route( /user)
  const normalizedRoute = route.startsWith('/') ? route : `/${route}`;
  return `time(${time} ) method (${method.toLowerCase()}) route( ${normalizedRoute})  res type(${statusCode}) duration (${duration} ms)`;
}

/**
 * Factory function to create logger middleware with custom options
 * @param {Object} [options={}]
 * @param {Function} [options.log=console.log] - Output function (defaults to console.log)
 * @param {boolean} [options.silent=false] - If true, suppresses output
 * @returns {import('express').RequestHandler}
 */
function createLogger(options = {}) {
  const logFn = options.log || console.log;

  return function loggerMiddleware(req, res, next) {
    const startTime = Date.now();
    const timeStr = formatTime(new Date());
    const method = req.method ? req.method.toLowerCase() : 'get';
    const route = req.originalUrl || req.url || req.path || '/';

    let logged = false;

    function handleLog() {
      if (logged) return;
      logged = true;

      const duration = Date.now() - startTime;
      const statusCode = res.statusCode || 200;

      // Allow silencing during automated test runs if SILENT_LOG is set
      if (process.env.SILENT_LOG === 'true' || options.silent) {
        return;
      }

      const logLine = formatLogLine({
        time: timeStr,
        method,
        route,
        statusCode,
        duration
      });

      logFn(logLine);
    }

    // Capture when the response headers / body have completed sending
    res.on('finish', handleLog);
    res.on('close', handleLog);

    if (typeof next === 'function') {
      next();
    }
  };
}

// Default singleton middleware
const defaultLogger = createLogger();

// Attach helper functions and factory to the export
defaultLogger.createLogger = createLogger;
defaultLogger.formatTime = formatTime;
defaultLogger.formatLogLine = formatLogLine;

module.exports = defaultLogger;
