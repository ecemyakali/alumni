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

  await t.test('5. homeView renders all 4 distinct sections with 3-tier framing and high-contrast typography', () => {
    const html = homeView.renderHomePage({
      userCount: 150,
      jobPostingCount: 24,
      announcementCount: 12,
      applicationCount: 45
    });

    // Section 1: Focused Hero & Live Search
    assert.ok(html.includes('OFFICIAL ALUMNI PORTAL'), 'Section 1 Eyebrow missing');
    assert.ok(html.includes('Where Graduates'), 'Section 1 Headline missing');
    assert.ok(html.includes('Reconnect, Mentor, and Grow'), 'Section 1 Gradient text missing');
    assert.ok(html.includes('globalSearchInput'), 'Central search bar missing');
    assert.ok(html.includes('⌘K'), '⌘K shortcut badge missing');

    // Section 2: Bento Quick-Access Grid
    assert.ok(html.includes('EXPLORE THE PLATFORM'), 'Section 2 Eyebrow missing');
    assert.ok(html.includes('Everything You Need to'), 'Section 2 Headline missing');
    assert.ok(html.includes('Stay Connected'), 'Section 2 Gradient text missing');
    assert.ok(html.includes('Browse Directory'), 'Bento Browse Directory card missing');
    assert.ok(html.includes('Update Your Profile'), 'Bento Update Profile card missing');
    assert.ok(html.includes('Events &amp; Community'), 'Bento Events & Community card missing');

    // Section 3: Featured / Recent Alumni Spotlight
    assert.ok(html.includes('COMMUNITY SPOTLIGHT'), 'Section 3 Eyebrow missing');
    assert.ok(html.includes('Meet the Minds Behind Our'), 'Section 3 Headline missing');
    assert.ok(html.includes('Growing Network'), 'Section 3 Gradient text missing');
    assert.ok(html.includes('alumniSpotlightGrid'), 'Alumni spotlight grid missing');
    assert.ok(html.includes('Class of'), 'Graduation year badge missing');

    // Section 4: Call-to-Action Footer Banner
    assert.ok(html.includes('JOIN THE MOVEMENT'), 'Section 4 Eyebrow missing');
    assert.ok(html.includes('Empower Your Career and Inspire the Next Generation'), 'Section 4 Headline missing');
  });

  await t.test('6. homeView renders Bento Admin Dashboard card conditionally for admin users', () => {
    // Non-admin user
    const htmlMember = homeView.renderHomePage({}, {
      currentUser: { name: 'Sarah Member', role: 'alumni' }
    });
    assert.ok(!htmlMember.includes('bento-card admin-card'));
    assert.ok(htmlMember.includes('Career Opportunities'));

    // Admin user
    const htmlAdmin = homeView.renderHomePage({}, {
      currentUser: { name: 'Ece Admin', role: 'admin' }
    });
    assert.ok(htmlAdmin.includes('bento-card admin-card'));
    assert.ok(htmlAdmin.includes('Admin Dashboard'));
    assert.ok(htmlAdmin.includes('Open Admin Panel'));
  });

  await t.test('7. Streamlined navbar renders single-row header with Directory, Community, Career, compact search, and user dropdown', () => {
    // Authenticated admin user navbar
    const htmlAdmin = homeView.renderHomePage({}, {
      currentUser: { name: 'Ece Admin', role: 'admin' }
    });
    // Top-level standalone links
    assert.ok(htmlAdmin.includes('Directory'), 'Directory top nav link missing');
    assert.ok(htmlAdmin.includes('Community'), 'Community top nav link missing');
    assert.ok(htmlAdmin.includes('Career'), 'Career top nav link missing');

    // Explore dropdown must be removed from navbar
    assert.ok(!htmlAdmin.includes('id="exploreDropdownBtn"'), 'Explore dropdown button should be removed');
    assert.ok(!htmlAdmin.includes('nav-dropdown-menu'), 'Explore dropdown menu should be removed');

    // Search trigger and user dropdown
    assert.ok(htmlAdmin.includes('nav-search-trigger'), 'Search trigger missing');
    assert.ok(htmlAdmin.includes('nav-user-wrap'), 'User dropdown wrap missing');
    assert.ok(htmlAdmin.includes('user-menu-dropdown'), 'User menu dropdown missing');
    assert.ok(htmlAdmin.includes('My Profile'), 'My Profile link missing');
    assert.ok(htmlAdmin.includes('Admin Panel'), 'Admin Panel link missing');
    assert.ok(htmlAdmin.includes('Log Out'), 'Log Out link missing');

    // Multi-column footer housing secondary informational links
    assert.ok(htmlAdmin.includes('About Platform'), 'Footer About link missing');
    assert.ok(htmlAdmin.includes('Community Guidelines'), 'Footer Guidelines link missing');
    assert.ok(htmlAdmin.includes('Resources &amp; Mentorship'), 'Footer Resources link missing');
    assert.ok(htmlAdmin.includes('Frequently Asked Questions (FAQ)'), 'Footer FAQ link missing');
    assert.ok(htmlAdmin.includes('Contact Alumni Relations'), 'Footer Contact link missing');

    // Unauthenticated user navbar
    const htmlGuest = homeView.renderHomePage();
    assert.ok(htmlGuest.includes('nav-search-trigger'));
    assert.ok(htmlGuest.includes('Log In'));
    assert.ok(htmlGuest.includes('Register'));
    assert.ok(!htmlGuest.includes('id="userMenuBtn"'));
    assert.ok(!htmlGuest.includes('class="nav-user-wrap"'));
  });
});
