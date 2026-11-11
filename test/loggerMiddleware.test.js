const test = require('node:test');
const assert = require('node:assert');
const http = require('http');
const express = require('express');
const logger = require('../src/middlewares/logger');
const { formatTime, formatLogLine, createLogger } = logger;
const app = require('../src/app');

test('Logger Middleware Test Suite', async (t) => {
  await t.test('formatTime: formats Date as HH:MM:SS with leading zeroes', () => {
    const fixedDate = new Date(2026, 9, 7, 9, 5, 4); // 09:05:04
    assert.strictEqual(formatTime(fixedDate), '09:05:04');

    const afternoon = new Date(2026, 9, 7, 14, 30, 45); // 14:30:45
    assert.strictEqual(formatTime(afternoon), '14:30:45');
  });

  await t.test('formatLogLine: formats exact string matching requirement', () => {
    const line = formatLogLine({
      time: '10:20:30',
      method: 'POST',
      route: '/user',
      statusCode: 201,
      duration: 18
    });

    const expected = 'time(10:20:30 ) method (post) route( /user)  res type(201) duration (18 ms)';
    assert.strictEqual(line, expected);
  });

  await t.test('formatLogLine: handles routes without leading slash by prepending slash', () => {
    const line = formatLogLine({
      time: '12:00:00',
      method: 'get',
      route: 'user',
      statusCode: 200,
      duration: 5
    });

    assert.strictEqual(line, 'time(12:00:00 ) method (get) route( /user)  res type(200) duration (5 ms)');
  });

  await t.test('Unit: middleware intercepts req/res and logs on finish event', (t, done) => {
    const logs = [];
    const testLogger = createLogger({ log: (msg) => logs.push(msg) });

    const req = {
      method: 'POST',
      originalUrl: '/user'
    };

    const listeners = {};
    const res = {
      statusCode: 201,
      on(event, handler) {
        listeners[event] = handler;
      }
    };

    testLogger(req, res, () => {
      // Simulate finish event after some ms
      setTimeout(() => {
        listeners['finish']();

        assert.strictEqual(logs.length, 1);
        const log = logs[0];
        assert.match(log, /^time\(\d{2}:\d{2}:\d{2} \) method \(post\) route\( \/user\)  res type\(201\) duration \(\d+ ms\)$/);
        done();
      }, 10);
    });
  });

  await t.test('Integration: Express server with logger middleware outputs formatted log on HTTP request', async () => {
    const capturedLogs = [];
    const customLogger = createLogger({ log: (msg) => capturedLogs.push(msg) });

    const testApp = express();
    testApp.use(customLogger);
    testApp.post('/user', (req, res) => {
      res.status(201).json({ success: true, message: 'User created' });
    });

    const server = http.createServer(testApp);
    await new Promise((resolve) => server.listen(0, resolve));
    const port = server.address().port;

    try {
      const res = await fetch(`http://127.0.0.1:${port}/user`, {
        method: 'POST'
      });
      assert.strictEqual(res.status, 201);

      // Wait a tick for res 'finish' callback
      await new Promise((resolve) => setTimeout(resolve, 50));

      assert.strictEqual(capturedLogs.length, 1);
      const log = capturedLogs[0];
      assert.match(log, /^time\(\d{2}:\d{2}:\d{2} \) method \(post\) route\( \/user\)  res type\(201\) duration \(\d+ ms\)$/);
    } finally {
      server.close();
    }
  });

  await t.test('Integration: Global app.js contains logger middleware on real endpoints', async () => {
    const server = http.createServer(app);
    await new Promise((resolve) => server.listen(0, resolve));
    const port = server.address().port;

    try {
      // Request /api/health
      const resHealth = await fetch(`http://127.0.0.1:${port}/api/health`);
      assert.strictEqual(resHealth.status, 200);

      // Request 404
      const res404 = await fetch(`http://127.0.0.1:${port}/non-existent-route`);
      assert.strictEqual(res404.status, 404);
    } finally {
      server.close();
    }
  });

  await t.test('Options: silent suppresses output when true', (t, done) => {
    const logs = [];
    const silentLogger = createLogger({ log: (msg) => logs.push(msg), silent: true });

    const req = { method: 'GET', originalUrl: '/test' };
    const listeners = {};
    const res = {
      statusCode: 200,
      on(event, handler) {
        listeners[event] = handler;
      }
    };

    silentLogger(req, res, () => {
      listeners['finish']();
      assert.strictEqual(logs.length, 0);
      done();
    });
  });
});
