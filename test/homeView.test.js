/**
 * Test Suite: Homepage View & Controller
 * File: test/homeView.test.js
 */

const test = require('node:test');
const assert = require('node:assert');
const express = require('express');
const homeView = require('../src/views/homeView');
const whiteboardRoutes = require('../src/routes/whiteboardRoutes');

test('Homepage View & Routing Suite', async (t) => {
  await t.test('1. homeView.escapeHtml correctly escapes malicious HTML characters', () => {
    const dangerous = '<script>alert("xss & \'danger\'")</script>';
    const escaped = homeView.escapeHtml(dangerous);
    assert.strictEqual(escaped.includes('<script>'), false);
    assert.strictEqual(escaped.includes('&lt;script&gt;'), true);
    assert.strictEqual(escaped.includes('&quot;'), true);
    assert.strictEqual(escaped.includes('&#039;'), true);
    assert.strictEqual(escaped.includes('&amp;'), true);
  });

  await t.test('2. homeView.renderHomePage renders default structure when called with no arguments', () => {
    const html = homeView.renderHomePage();
    assert.strictEqual(typeof html, 'string');
    assert.ok(html.includes('<!DOCTYPE html>'));
    assert.ok(html.includes('Alumni Tracking System'));
    assert.ok(html.includes('Alumni Directory'));
    assert.ok(html.includes('Career Opportunities'));
    assert.ok(html.includes('Announcements Board'));
    assert.ok(html.includes('Application Tracking'));
    assert.ok(html.includes('Swagger UI'));
    assert.ok(html.includes('System Health'));
  });

  await t.test('3. homeView.renderHomePage renders live metrics and recent items', () => {
    const html = homeView.renderHomePage({
      userCount: 42,
      jobPostingCount: 15,
      announcementCount: 8,
      applicationCount: 99,
      recentAnnouncements: [
        { id: 1, title: 'Annual Alumni Homecoming 2026', author: 'Dean Office', date: '2026-11-20' }
      ],
      recentJobPostings: [
        { id: 1, title: 'Senior Cloud Architect', company: 'Google Cloud', city: 'Zurich', type: 'Full-time' }
      ]
    });

    assert.ok(html.includes('42'));
    assert.ok(html.includes('15'));
    assert.ok(html.includes('8'));
    assert.ok(html.includes('99'));
    assert.ok(html.includes('Annual Alumni Homecoming 2026'));
    assert.ok(html.includes('Senior Cloud Architect'));
    assert.ok(html.includes('Google Cloud'));
  });

  await t.test('4. Express server serves homepage at GET /main and GET /home', async () => {
    const app = express();
    app.use('/', whiteboardRoutes);

    const server = app.listen(0);
    const port = server.address().port;

    try {
      // Test GET /main
      const resMain = await fetch(`http://127.0.0.1:${port}/main`);
      assert.strictEqual(resMain.status, 200);
      assert.strictEqual(resMain.headers.get('content-type').includes('text/html'), true);
      const textMain = await resMain.text();
      assert.ok(textMain.includes('Alumni Tracking System'));

      // Test GET /home
      const resHome = await fetch(`http://127.0.0.1:${port}/home`);
      assert.strictEqual(resHome.status, 200);
      const textHome = await resHome.text();
      assert.ok(textHome.includes('Alumni Tracking System'));

      // Test GET /main?raw=true
      const resRaw = await fetch(`http://127.0.0.1:${port}/main?raw=true`);
      assert.strictEqual(resRaw.status, 200);
      const textRaw = await resRaw.text();
      assert.strictEqual(textRaw, 'temporary one main page');

      // Test GET / with Accept: text/html
      const resRootHtml = await fetch(`http://127.0.0.1:${port}/`, {
        headers: { 'Accept': 'text/html' }
      });
      assert.strictEqual(resRootHtml.status, 200);
      const textRoot = await resRootHtml.text();
      assert.ok(textRoot.includes('Alumni Tracking System'));

      // Test GET / without HTML accept (returns 'ok')
      const resRootPlain = await fetch(`http://127.0.0.1:${port}/`);
      assert.strictEqual(resRootPlain.status, 200);
      const textPlain = await resRootPlain.text();
      assert.strictEqual(textPlain, 'ok');
    } finally {
      await new Promise(resolve => server.close(resolve));
    }
  });
});
