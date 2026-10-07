const test = require('node:test');
const assert = require('node:assert');
const announcementModel = require('../src/models/announcementModel');
const apiAnnouncementController = require('../src/controllers/apiAnnouncementController');
const announcementController = require('../src/controllers/announcementController');

function createMockRes() {
  return {
    statusCode: 200,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    },
    send(payload) {
      this.body = payload;
      return this;
    }
  };
}

test('Announcement Controllers Unit Tests (ApiAnnouncementController & AnnouncementController)', async (t) => {
  t.beforeEach(() => {
    announcementModel.clear();
  });

  await t.test('ApiAnnouncementController: RESTful JSON CRUD Operations', async (st) => {
    await st.test('CREATE: should create announcement and return 201 JSON', () => {
      const req = { body: { title: 'Webinar 2026', content: 'Tech talk details' } };
      const res = createMockRes();

      apiAnnouncementController.createAnnouncement(req, res);
      assert.strictEqual(res.statusCode, 201);
      assert.strictEqual(res.body.success, true);
      assert.strictEqual(res.body.announcement.title, 'Webinar 2026');
    });

    await st.test('CREATE: should return 400 if title or content missing', () => {
      const req = { body: { title: 'Only Title' } };
      const res = createMockRes();

      apiAnnouncementController.createAnnouncement(req, res);
      assert.strictEqual(res.statusCode, 400);
      assert.strictEqual(res.body.success, false);
    });

    await st.test('READ (All & ID): should retrieve all and single items', () => {
      const item = announcementModel.create({ title: 'A1', content: 'C1' });

      const resAll = createMockRes();
      apiAnnouncementController.getAllAnnouncements({}, resAll);
      assert.strictEqual(resAll.statusCode, 200);
      assert.strictEqual(resAll.body.count, 1);

      const resOne = createMockRes();
      apiAnnouncementController.getAnnouncementById({ params: { id: item.id.toString() } }, resOne);
      assert.strictEqual(resOne.statusCode, 200);
      assert.strictEqual(resOne.body.data.title, 'A1');

      const res404 = createMockRes();
      apiAnnouncementController.getAnnouncementById({ params: { id: '999' } }, res404);
      assert.strictEqual(res404.statusCode, 404);
    });

    await st.test('UPDATE & DELETE: should perform mutations via API controller', () => {
      const item = announcementModel.create({ title: 'Update Me', content: 'C' });

      const resUp = createMockRes();
      apiAnnouncementController.updateAnnouncement({ params: { id: item.id.toString() }, body: { title: 'Updated' } }, resUp);
      assert.strictEqual(resUp.statusCode, 200);
      assert.strictEqual(resUp.body.announcement.title, 'Updated');

      const resDel = createMockRes();
      apiAnnouncementController.deleteAnnouncement({ params: { id: item.id.toString() } }, resDel);
      assert.strictEqual(resDel.statusCode, 200);
      assert.strictEqual(resDel.body.success, true);
    });
  });

  await t.test('AnnouncementController: Web CRUD Operations & View Layer', async (st) => {
    await st.test('CREATE: should support HTML response for form submit', () => {
      const req = {
        headers: { accept: 'text/html' },
        body: { title: 'New Event', content: 'Event description' }
      };
      const res = createMockRes();

      announcementController.createAnnouncement(req, res);
      assert.strictEqual(res.statusCode, 201);
      assert.ok(typeof res.body === 'string');
      assert.ok(res.body.includes('New Event'));
    });

    await st.test('READ (All): should render HTML view when Accept: text/html', () => {
      announcementModel.create({ title: 'Board Item', content: 'Details' });
      const req = { headers: { accept: 'text/html' } };
      const res = createMockRes();

      announcementController.getAllAnnouncements(req, res);
      assert.strictEqual(res.statusCode, 200);
      assert.ok(res.body.includes('Alumni Announcements Board'));
      assert.ok(res.body.includes('Board Item'));
    });

    await st.test('READ (One): should render single detail HTML view', () => {
      const item = announcementModel.create({ title: 'Detail Item', content: 'Detail description' });
      const req = { headers: { accept: 'text/html' }, params: { id: item.id.toString() } };
      const res = createMockRes();

      announcementController.getAnnouncementById(req, res);
      assert.strictEqual(res.statusCode, 200);
      assert.ok(res.body.includes('Detail Item'));
      assert.ok(res.body.includes('Detail description'));
    });

    await st.test('UPDATE & DELETE: should perform mutations via AnnouncementController', () => {
      const item = announcementModel.create({ title: 'To Mutate', content: 'Content' });

      const resUp = createMockRes();
      announcementController.updateAnnouncement({ headers: {}, params: { id: item.id.toString() }, body: { title: 'Mutated' } }, resUp);
      assert.strictEqual(resUp.statusCode, 200);
      assert.strictEqual(resUp.body.announcement.title, 'Mutated');

      const resDel = createMockRes();
      announcementController.deleteAnnouncement({ headers: {}, params: { id: item.id.toString() } }, resDel);
      assert.strictEqual(resDel.statusCode, 200);
      assert.strictEqual(resDel.body.success, true);
    });
  });
});
