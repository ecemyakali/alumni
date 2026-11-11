const test = require('node:test');
const assert = require('node:assert');
const http = require('http');
const fs = require('fs');
const path = require('path');
const express = require('express');
const { notFoundGuardian, errorGuardian } = require('../src/middlewares');
const notFoundView = require('../src/views/notFoundView');
const serverErrorView = require('../src/views/serverErrorView');
const app = require('../src/app');

test('Guardians & Error Logging Test Suite (Tasks 4, 5, 6, 7)', async (t) => {
  const errorLogPath = path.join(process.cwd(), 'logs', 'error.logs');

  t.before(() => {
    // Clean up log file before test suite starts
    if (fs.existsSync(errorLogPath)) {
      try {
        fs.unlinkSync(errorLogPath);
      } catch {}
    }
  });

  // ------------------------------------------------------------------------
  // TASK 4: 404 Guardian returns 404 with reason
  // ------------------------------------------------------------------------
  await t.test('Task 4: notFoundGuardian returns 404 JSON with explicit reason for API requests', async () => {
    const testApp = express();
    testApp.use(notFoundGuardian);

    const server = http.createServer(testApp);
    await new Promise((resolve) => server.listen(0, resolve));
    const port = server.address().port;

    try {
      const res = await fetch(`http://127.0.0.1:${port}/api/non-existent-endpoint`, {
        headers: { Accept: 'application/json' }
      });

      assert.strictEqual(res.status, 404);
      const data = await res.json();
      assert.strictEqual(data.success, false);
      assert.strictEqual(data.status, 404);
      assert.strictEqual(data.error, 'Not Found');
      assert.ok(typeof data.reason === 'string');
      assert.ok(data.reason.includes('GET /api/non-existent-endpoint'));
      assert.ok(data.reason.includes('does not exist on this server'));
      assert.strictEqual(data.method, 'GET');
      assert.strictEqual(data.path, '/api/non-existent-endpoint');
      assert.ok(data.timestamp);
    } finally {
      server.close();
    }
  });

  // ------------------------------------------------------------------------
  // TASK 7: Generic 404 page & redirect invalid requests
  // ------------------------------------------------------------------------
  await t.test('Task 7: notFoundGuardian redirects invalid browser request (Accept: text/html) to /404', async () => {
    const testApp = express();
    testApp.get('/404', notFoundGuardian);
    testApp.use(notFoundGuardian);

    const server = http.createServer(testApp);
    await new Promise((resolve) => server.listen(0, resolve));
    const port = server.address().port;

    try {
      // Test with manual redirect to verify 302 redirect header
      const resRedirect = await fetch(`http://127.0.0.1:${port}/broken-page-link`, {
        headers: { Accept: 'text/html' },
        redirect: 'manual'
      });

      assert.strictEqual(resRedirect.status, 302);
      const location = resRedirect.headers.get('location');
      assert.ok(location.startsWith('/404?from='));
      assert.ok(location.includes('broken-page-link'));

      // Test following the redirect to /404 (receives generic 404 HTML page)
      const resFollowed = await fetch(`http://127.0.0.1:${port}/broken-page-link`, {
        headers: { Accept: 'text/html' }
      });

      assert.strictEqual(resFollowed.status, 404);
      const html = await resFollowed.text();
      assert.ok(html.includes('404'));
      assert.ok(html.includes('Page Not Found'));
      assert.ok(html.includes('Helpful Destinations'));
      assert.ok(html.includes('/users'));
      assert.ok(html.includes('/job-postings'));
    } finally {
      server.close();
    }
  });

  await t.test('Task 7: GET /404 directly renders generic 404 HTML page with reason and path', async () => {
    const html = notFoundView.renderNotFound({
      path: '/missing/custom/page',
      reason: 'The specified resource could not be found.'
    });

    assert.ok(html.includes('404'));
    assert.ok(html.includes('Page Not Found'));
    assert.ok(html.includes('The specified resource could not be found.'));
    assert.ok(html.includes('/missing/custom/page'));
    assert.ok(html.includes('Alumni Directory'));
  });

  // ------------------------------------------------------------------------
  // TASK 5: 5xx Guardian middleware
  // ------------------------------------------------------------------------
  await t.test('Task 5: errorGuardian catches server errors and returns 500 JSON with reason', async () => {
    const testApp = express();

    // Intentional crashing route
    testApp.get('/api/simulate-crash', (req, res, next) => {
      const err = new Error('Database cluster connection failed');
      err.reason = 'Database cluster connection failed';
      next(err);
    });

    testApp.use(errorGuardian);

    const server = http.createServer(testApp);
    await new Promise((resolve) => server.listen(0, resolve));
    const port = server.address().port;

    try {
      const res = await fetch(`http://127.0.0.1:${port}/api/simulate-crash`);
      assert.strictEqual(res.status, 500);

      const data = await res.json();
      assert.strictEqual(data.success, false);
      assert.strictEqual(data.status, 500);
      assert.strictEqual(data.error, 'Internal Server Error');
      assert.strictEqual(data.reason, 'Database cluster connection failed');
      assert.strictEqual(data.method, 'GET');
      assert.strictEqual(data.path, '/api/simulate-crash');
      assert.ok(data.timestamp);
    } finally {
      server.close();
    }
  });

  await t.test('Task 5: errorGuardian renders HTML view for web client on 500 error', async () => {
    const testApp = express();

    testApp.get('/web-crash', (req, res, next) => {
      next(new Error('Template compilation failure'));
    });

    testApp.use(errorGuardian);

    const server = http.createServer(testApp);
    await new Promise((resolve) => server.listen(0, resolve));
    const port = server.address().port;

    try {
      const res = await fetch(`http://127.0.0.1:${port}/web-crash`, {
        headers: { Accept: 'text/html' }
      });
      assert.strictEqual(res.status, 500);

      const html = await res.text();
      assert.ok(html.includes('500'));
      assert.ok(html.includes('Internal Server Error'));
      assert.ok(html.includes('Template compilation failure'));
    } finally {
      server.close();
    }
  });

  // ------------------------------------------------------------------------
  // TASK 6: Logs --> logs/error.logs
  // ------------------------------------------------------------------------
  await t.test('Task 6: errorGuardian appends error records to logs/error.logs', async () => {
    const testApp = express();

    testApp.post('/api/fail-action', (req, res, next) => {
      const err = new Error('Payment gateway socket timeout');
      err.reason = 'Payment gateway socket timeout';
      next(err);
    });

    testApp.use(errorGuardian);

    const server = http.createServer(testApp);
    await new Promise((resolve) => server.listen(0, resolve));
    const port = server.address().port;

    try {
      const res = await fetch(`http://127.0.0.1:${port}/api/fail-action`, {
        method: 'POST'
      });
      assert.strictEqual(res.status, 500);

      // Verify logs/error.logs exists on disk
      assert.ok(fs.existsSync(errorLogPath), 'logs/error.logs should exist');

      const fileContent = fs.readFileSync(errorLogPath, 'utf8');
      assert.ok(fileContent.includes('[STATUS 500]'));
      assert.ok(fileContent.includes('[POST /api/fail-action]'));
      assert.ok(fileContent.includes('Payment gateway socket timeout'));
      assert.ok(fileContent.includes('Reason: Payment gateway socket timeout'));
    } finally {
      server.close();
    }
  });

  // ------------------------------------------------------------------------
  // INTEGRATION: App.js end-to-end with all guardians active
  // ------------------------------------------------------------------------
  await t.test('Integration: app.js handles 404 and 404 redirect end-to-end', async () => {
    const server = http.createServer(app);
    await new Promise((resolve) => server.listen(0, resolve));
    const port = server.address().port;

    try {
      // 1. API 404 receives JSON with reason
      const resApi = await fetch(`http://127.0.0.1:${port}/api/unmapped-endpoint`);
      assert.strictEqual(resApi.status, 404);
      const apiData = await resApi.json();
      assert.strictEqual(apiData.success, false);
      assert.ok(apiData.reason.includes('GET /api/unmapped-endpoint'));

      // 2. Direct GET /404 receives generic 404 HTML page
      const res404 = await fetch(`http://127.0.0.1:${port}/404`);
      assert.strictEqual(res404.status, 404);
      const html404 = await res404.text();
      assert.ok(html404.includes('Page Not Found'));
      assert.ok(html404.includes('404'));

      // 3. Browser invalid route redirects to /404
      const resBrowser = await fetch(`http://127.0.0.1:${port}/unknown-web-route`, {
        headers: { Accept: 'text/html' },
        redirect: 'manual'
      });
      assert.strictEqual(resBrowser.status, 302);
      assert.ok(resBrowser.headers.get('location').startsWith('/404?from='));
    } finally {
      server.close();
    }
  });
});
