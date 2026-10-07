const test = require('node:test');
const assert = require('node:assert');
const announcementView = require('../src/views/announcementView');
const announcementModel = require('../src/models/announcementModel');
const app = require('../src/app');

test('Announcement View Layer & All CRUD Operations Tests', async (t) => {
  t.beforeEach(() => {
    announcementModel.clear();
  });

  const sampleAnnouncements = [
    { id: 1, title: 'Annual Gala 2026', content: 'Grand reunion dinner.', category: 'Event', priority: 'high', author: 'Alumni Office' }
  ];

  await t.test('1. View Unit: renderAnnouncementsList includes table, action links and creation form', () => {
    const html = announcementView.renderAnnouncementsList(sampleAnnouncements, { successMessage: 'Created successfully' });

    assert.ok(html.includes('<!DOCTYPE html>'));
    assert.ok(html.includes('Alumni Announcements Board'));
    assert.ok(html.includes('Annual Gala 2026'));
    assert.ok(html.includes('/announcements/1'));
    assert.ok(html.includes('/announcements/1/edit'));
    assert.ok(html.includes('/announcements/1/delete'));
    assert.ok(html.includes('<form method="POST" action="/announcements">'));
    assert.ok(html.includes('name="title"'));
    assert.ok(html.includes('name="content"'));
    assert.ok(html.includes('Created successfully'));
  });

  await t.test('2. View Unit: renderAnnouncementDetail includes detail content and edit/delete links', () => {
    const html = announcementView.renderAnnouncementDetail(sampleAnnouncements[0]);

    assert.ok(html.includes('Annual Gala 2026'));
    assert.ok(html.includes('Grand reunion dinner.'));
    assert.ok(html.includes('/announcements/1/edit'));
    assert.ok(html.includes('/announcements/1/delete'));
  });

  await t.test('3. View Unit: renderEditAnnouncementForm generates pre-filled edit form', () => {
    const html = announcementView.renderEditAnnouncementForm(sampleAnnouncements[0]);

    assert.ok(html.includes('Edit Announcement #1'));
    assert.ok(html.includes('action="/announcements/1/update"'));
    assert.ok(html.includes('value="Annual Gala 2026"'));
    assert.ok(html.includes('Grand reunion dinner.'));
  });

  await t.test('4. Integration CRUD - READ ALL: GET /announcements serves HTML board', async () => {
    const server = app.listen(0);
    const port = server.address().port;
    const baseUrl = `http://localhost:${port}`;

    try {
      announcementModel.create({ title: 'Welcome Alumni', content: 'Welcome message' });

      const res = await fetch(`${baseUrl}/announcements`, {
        headers: { 'Accept': 'text/html' }
      });

      assert.strictEqual(res.status, 200);
      const body = await res.text();
      assert.ok(body.includes('Alumni Announcements Board'));
      assert.ok(body.includes('Welcome Alumni'));
    } finally {
      server.close();
    }
  });

  await t.test('5. Integration CRUD - CREATE: POST /announcements via form creates and renders feedback', async () => {
    const server = app.listen(0);
    const port = server.address().port;
    const baseUrl = `http://localhost:${port}`;

    try {
      const formParams = new URLSearchParams();
      formParams.append('title', 'Spring Career Fair');
      formParams.append('content', 'Meet top companies.');
      formParams.append('category', 'Career');
      formParams.append('priority', 'high');

      const res = await fetch(`${baseUrl}/announcements`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'text/html'
        },
        body: formParams.toString()
      });

      assert.strictEqual(res.status, 201);
      const body = await res.text();
      assert.ok(body.includes('Spring Career Fair'));
      assert.ok(body.includes('published successfully'));
      assert.strictEqual(announcementModel.count(), 1);
    } finally {
      server.close();
    }
  });

  await t.test('6. Integration CRUD - READ ONE: GET /announcements/:id renders detail card View', async () => {
    const server = app.listen(0);
    const port = server.address().port;
    const baseUrl = `http://localhost:${port}`;

    try {
      const a = announcementModel.create({ title: 'Single Read Test', content: 'Specific body text.' });

      const res = await fetch(`${baseUrl}/announcements/${a.id}`, {
        headers: { 'Accept': 'text/html' }
      });

      assert.strictEqual(res.status, 200);
      const body = await res.text();
      assert.ok(body.includes('Single Read Test'));
      assert.ok(body.includes('Specific body text.'));
    } finally {
      server.close();
    }
  });

  await t.test('7. Integration CRUD - UPDATE Form: GET /announcements/:id/edit renders edit form View', async () => {
    const server = app.listen(0);
    const port = server.address().port;
    const baseUrl = `http://localhost:${port}`;

    try {
      const a = announcementModel.create({ title: 'Before Edit', content: 'Before content' });

      const res = await fetch(`${baseUrl}/announcements/${a.id}/edit`, {
        headers: { 'Accept': 'text/html' }
      });

      assert.strictEqual(res.status, 200);
      const body = await res.text();
      assert.ok(body.includes('Edit Announcement'));
      assert.ok(body.includes('Before Edit'));
    } finally {
      server.close();
    }
  });

  await t.test('8. Integration CRUD - UPDATE Action: POST /announcements/:id/update updates announcement', async () => {
    const server = app.listen(0);
    const port = server.address().port;
    const baseUrl = `http://localhost:${port}`;

    try {
      const a = announcementModel.create({ title: 'Original Title', content: 'Original content' });

      const updateParams = new URLSearchParams();
      updateParams.append('title', 'After Edit View');
      updateParams.append('content', 'Updated body text');

      const res = await fetch(`${baseUrl}/announcements/${a.id}/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'text/html'
        },
        body: updateParams.toString()
      });

      assert.strictEqual(res.status, 200);
      const body = await res.text();
      assert.ok(body.includes('After Edit View'));
      assert.ok(body.includes('updated successfully'));
    } finally {
      server.close();
    }
  });

  await t.test('9. Integration CRUD - DELETE Action: POST /announcements/:id/delete removes announcement', async () => {
    const server = app.listen(0);
    const port = server.address().port;
    const baseUrl = `http://localhost:${port}`;

    try {
      const a = announcementModel.create({ title: 'To Delete Soon', content: 'Content' });

      const res = await fetch(`${baseUrl}/announcements/${a.id}/delete`, {
        method: 'POST',
        headers: { 'Accept': 'text/html' }
      });

      assert.strictEqual(res.status, 200);
      const body = await res.text();
      assert.ok(body.includes('deleted successfully'));
      assert.strictEqual(announcementModel.findById(a.id), null);
    } finally {
      server.close();
    }
  });

  await t.test('10. Integration REST API: /api/announcements JSON endpoints verify', async () => {
    const server = app.listen(0);
    const port = server.address().port;
    const baseUrl = `http://localhost:${port}`;

    try {
      const postRes = await fetch(`${baseUrl}/api/announcements`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'API Notice', content: 'JSON payload description' })
      });
      assert.strictEqual(postRes.status, 201);
      const postData = await postRes.json();
      assert.strictEqual(postData.success, true);
      assert.strictEqual(postData.announcement.title, 'API Notice');

      const getRes = await fetch(`${baseUrl}/api/announcements`);
      assert.strictEqual(getRes.status, 200);
      const getData = await getRes.json();
      assert.strictEqual(getData.success, true);
      assert.strictEqual(getData.count, 1);
    } finally {
      server.close();
    }
  });
});
