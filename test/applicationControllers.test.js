const test = require('node:test');
const assert = require('node:assert');
const applicationModel = require('../src/models/applicationModel');
const apiApplicationController = require('../src/controllers/apiApplicationController');
const applicationController = require('../src/controllers/applicationController');
const app = require('../src/app');

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

test('Application Controllers & Routes Test Suite', async (t) => {
  t.beforeEach(() => {
    applicationModel.clear();
  });

  await t.test('ApiApplicationController: RESTful JSON CRUD Operations', async (st) => {
    await st.test('CREATE: should create application and return 201 JSON', async () => {
      const req = {
        body: {
          userId: 1,
          jobPostingId: 10,
          status: 'pending',
          resumeUrl: 'https://cdn.example.com/resumes/john.pdf',
          coverNote: 'Excited about backend opportunity.'
        }
      };
      const res = createMockRes();

      await apiApplicationController.createApplication(req, res);
      assert.strictEqual(res.statusCode, 201);
      assert.strictEqual(res.body.success, true);
      assert.strictEqual(res.body.application.userId, 1);
      assert.strictEqual(res.body.application.jobPostingId, 10);
      assert.strictEqual(res.body.application.status, 'pending');
      assert.strictEqual(res.body.application.resumeUrl, 'https://cdn.example.com/resumes/john.pdf');
    });

    await st.test('CREATE: should return 400 if userId or jobPostingId is missing', async () => {
      const reqOnlyUser = { body: { userId: 1 } };
      const resOnlyUser = createMockRes();
      await apiApplicationController.createApplication(reqOnlyUser, resOnlyUser);
      assert.strictEqual(resOnlyUser.statusCode, 400);
      assert.strictEqual(resOnlyUser.body.success, false);

      const reqOnlyJob = { body: { jobPostingId: 2 } };
      const resOnlyJob = createMockRes();
      await apiApplicationController.createApplication(reqOnlyJob, resOnlyJob);
      assert.strictEqual(resOnlyJob.statusCode, 400);
      assert.strictEqual(resOnlyJob.body.success, false);
    });

    await st.test('CREATE: should return 400 if status is invalid', async () => {
      const req = {
        body: {
          userId: 1,
          jobPostingId: 2,
          status: 'invalid_status'
        }
      };
      const res = createMockRes();
      await apiApplicationController.createApplication(req, res);
      assert.strictEqual(res.statusCode, 400);
      assert.strictEqual(res.body.success, false);
    });

    await st.test('CREATE: should return 409 Conflict if application already exists for (userId, jobPostingId)', async () => {
      await applicationModel.create({ userId: 1, jobPostingId: 5 });

      const reqDuplicate = {
        body: {
          userId: 1,
          jobPostingId: 5,
          resumeUrl: 'https://another.pdf'
        }
      };
      const resDuplicate = createMockRes();

      await apiApplicationController.createApplication(reqDuplicate, resDuplicate);
      assert.strictEqual(resDuplicate.statusCode, 409);
      assert.strictEqual(resDuplicate.body.success, false);
      assert.ok(resDuplicate.body.error.includes('already applied'));
    });

    await st.test('READ (All & ID): should retrieve all and single applications', async () => {
      const item = await applicationModel.create({
        userId: 2,
        jobPostingId: 20,
        status: 'reviewing'
      });

      const resAll = createMockRes();
      await apiApplicationController.getAllApplications({ query: {} }, resAll);
      assert.strictEqual(resAll.statusCode, 200);
      assert.strictEqual(resAll.body.count, 1);

      const resOne = createMockRes();
      await apiApplicationController.getApplicationById({ params: { id: item.id.toString() } }, resOne);
      assert.strictEqual(resOne.statusCode, 200);
      assert.strictEqual(resOne.body.data.userId, 2);
      assert.strictEqual(resOne.body.data.jobPostingId, 20);

      const resNotFound = createMockRes();
      await apiApplicationController.getApplicationById({ params: { id: '9999' } }, resNotFound);
      assert.strictEqual(resNotFound.statusCode, 404);
    });

    await st.test('READ (Query Filters): should filter by userId and jobPostingId', async () => {
      await applicationModel.create({ userId: 10, jobPostingId: 100 });
      await applicationModel.create({ userId: 10, jobPostingId: 200 });
      await applicationModel.create({ userId: 20, jobPostingId: 100 });

      const resUser = createMockRes();
      await apiApplicationController.getAllApplications({ query: { userId: '10' } }, resUser);
      assert.strictEqual(resUser.body.count, 2);

      const resJob = createMockRes();
      await apiApplicationController.getAllApplications({ query: { jobPostingId: '100' } }, resJob);
      assert.strictEqual(resJob.body.count, 2);
    });

    await st.test('UPDATE: should update application fields or return 404', async () => {
      const item = await applicationModel.create({ userId: 5, jobPostingId: 50, status: 'pending' });

      const resUpdate = createMockRes();
      await apiApplicationController.updateApplication(
        { params: { id: item.id.toString() }, body: { status: 'accepted', coverNote: 'Great fit' } },
        resUpdate
      );
      assert.strictEqual(resUpdate.statusCode, 200);
      assert.strictEqual(resUpdate.body.application.status, 'accepted');
      assert.strictEqual(resUpdate.body.application.coverNote, 'Great fit');

      const res404 = createMockRes();
      await apiApplicationController.updateApplication({ params: { id: '9999' }, body: { status: 'rejected' } }, res404);
      assert.strictEqual(res404.statusCode, 404);
    });

    await st.test('UPDATE: should return 400 for invalid status', async () => {
      const item = await applicationModel.create({ userId: 6, jobPostingId: 60 });
      const resBad = createMockRes();
      await apiApplicationController.updateApplication({ params: { id: item.id.toString() }, body: { status: 'bogus' } }, resBad);
      assert.strictEqual(resBad.statusCode, 400);
    });

    await st.test('DELETE: should delete application or return 404', async () => {
      const item = await applicationModel.create({ userId: 7, jobPostingId: 70 });

      const resDelete = createMockRes();
      await apiApplicationController.deleteApplication({ params: { id: item.id.toString() } }, resDelete);
      assert.strictEqual(resDelete.statusCode, 200);
      assert.strictEqual(resDelete.body.deletedApplication.id, item.id);
      assert.strictEqual(applicationModel.count(), 0);

      const res404 = createMockRes();
      await apiApplicationController.deleteApplication({ params: { id: '9999' } }, res404);
      assert.strictEqual(res404.statusCode, 404);
    });
  });

  await t.test('ApplicationController: Web MVC Operations with HTML Views', async (st) => {
    await st.test('READ ALL (HTML): should render list view with empty state', async () => {
      const req = { headers: { accept: 'text/html' }, query: {} };
      const res = createMockRes();

      await applicationController.getAllApplications(req, res);
      assert.strictEqual(res.statusCode, 200);
      assert.ok(typeof res.body === 'string');
      assert.ok(res.body.includes('Job Applications Management'));
      assert.ok(res.body.includes('No job applications submitted yet'));
    });

    await st.test('CREATE (HTML): should accept form submission and return 201 HTML', async () => {
      const req = {
        headers: { accept: 'text/html' },
        body: {
          userId: '3',
          jobPostingId: '30',
          status: 'pending',
          coverNote: 'Interested in working with you.'
        }
      };
      const res = createMockRes();

      await applicationController.createApplication(req, res);
      assert.strictEqual(res.statusCode, 201);
      assert.ok(res.body.includes('Application for Job #30 submitted successfully!'));
      assert.strictEqual(applicationModel.count(), 1);
    });

    await st.test('CREATE (HTML): should return 400 HTML when fields are missing', async () => {
      const req = {
        headers: { accept: 'text/html' },
        body: { userId: '1' }
      };
      const res = createMockRes();

      await applicationController.createApplication(req, res);
      assert.strictEqual(res.statusCode, 400);
      assert.ok(res.body.includes('User ID and Job Posting ID are required fields.'));
    });

    await st.test('CREATE (HTML): should return 409 HTML when duplicate application submitted', async () => {
      await applicationModel.create({ userId: 12, jobPostingId: 120 });

      const req = {
        headers: { accept: 'text/html' },
        body: { userId: '12', jobPostingId: '120' }
      };
      const res = createMockRes();

      await applicationController.createApplication(req, res);
      assert.strictEqual(res.statusCode, 409);
      assert.ok(res.body.includes('already applied'));
    });

    await st.test('READ ONE (HTML): should render detail card or 404 error page', async () => {
      const appItem = await applicationModel.create({ userId: 4, jobPostingId: 40, status: 'reviewing' });

      const reqSuccess = { headers: { accept: 'text/html' }, params: { id: appItem.id.toString() } };
      const resSuccess = createMockRes();
      await applicationController.getApplicationById(reqSuccess, resSuccess);
      assert.strictEqual(resSuccess.statusCode, 200);
      assert.ok(resSuccess.body.includes(`Application #${appItem.id}`));
      assert.ok(resSuccess.body.includes('User #4'));
      assert.ok(resSuccess.body.includes('Job #40'));

      const req404 = { headers: { accept: 'text/html' }, params: { id: '9999' } };
      const res404 = createMockRes();
      await applicationController.getApplicationById(req404, res404);
      assert.strictEqual(res404.statusCode, 404);
      assert.ok(res404.body.includes('404'));
    });

    await st.test('EDIT FORM (HTML): should render pre-filled edit form', async () => {
      const appItem = await applicationModel.create({ userId: 8, jobPostingId: 80, coverNote: 'Original Note' });

      const req = { params: { id: appItem.id.toString() } };
      const res = createMockRes();
      await applicationController.getEditApplicationForm(req, res);
      assert.strictEqual(res.statusCode, 200);
      assert.ok(res.body.includes(`Edit Application #${appItem.id}`));
      assert.ok(res.body.includes('Original Note'));
    });

    await st.test('UPDATE (HTML): should update and return updated detail view', async () => {
      const appItem = await applicationModel.create({ userId: 9, jobPostingId: 90, status: 'pending' });

      const req = {
        headers: { accept: 'text/html' },
        params: { id: appItem.id.toString() },
        body: { status: 'accepted' }
      };
      const res = createMockRes();
      await applicationController.updateApplication(req, res);
      assert.strictEqual(res.statusCode, 200);
      assert.ok(res.body.includes('Application updated successfully!'));
    });

    await st.test('DELETE (HTML): should delete and return list with flash message', async () => {
      const appItem = await applicationModel.create({ userId: 11, jobPostingId: 110 });

      const req = {
        headers: { accept: 'text/html' },
        params: { id: appItem.id.toString() }
      };
      const res = createMockRes();
      await applicationController.deleteApplication(req, res);
      assert.strictEqual(res.statusCode, 200);
      assert.ok(res.body.includes(`Application #${appItem.id} deleted successfully.`));
    });
  });

  await t.test('Application Express HTTP Endpoints Integration', async () => {
    const server = app.listen(0);
    const port = server.address().port;
    const baseUrl = `http://localhost:${port}`;

    try {
      // 1. POST /api/applications (201)
      const postRes = await fetch(`${baseUrl}/api/applications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 1,
          jobPostingId: 101,
          status: 'pending',
          coverNote: 'HTTP Integration Test Note'
        })
      });
      assert.strictEqual(postRes.status, 201);
      const postData = await postRes.json();
      assert.strictEqual(postData.success, true);
      const createdId = postData.application.id;

      // 2. Duplicate POST /api/applications (409)
      const duplicateRes = await fetch(`${baseUrl}/api/applications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 1,
          jobPostingId: 101
        })
      });
      assert.strictEqual(duplicateRes.status, 409);

      // 3. GET /api/applications (200)
      const listRes = await fetch(`${baseUrl}/api/applications`);
      assert.strictEqual(listRes.status, 200);
      const listData = await listRes.json();
      assert.strictEqual(listData.count, 1);

      // 4. GET /api/applications/:id (200)
      const getRes = await fetch(`${baseUrl}/api/applications/${createdId}`);
      assert.strictEqual(getRes.status, 200);
      const getData = await getRes.json();
      assert.strictEqual(getData.data.userId, 1);
      assert.strictEqual(getData.data.jobPostingId, 101);

      // 5. PUT /api/applications/:id (200)
      const putRes = await fetch(`${baseUrl}/api/applications/${createdId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'reviewing' })
      });
      assert.strictEqual(putRes.status, 200);
      const putData = await putRes.json();
      assert.strictEqual(putData.application.status, 'reviewing');

      // 6. GET /applications (HTML)
      const webListRes = await fetch(`${baseUrl}/applications`, {
        headers: { 'Accept': 'text/html' }
      });
      assert.strictEqual(webListRes.status, 200);
      const htmlText = await webListRes.text();
      assert.ok(htmlText.includes('Job Applications Management'));

      // 7. GET /applications/:id (HTML)
      const webDetailRes = await fetch(`${baseUrl}/applications/${createdId}`, {
        headers: { 'Accept': 'text/html' }
      });
      assert.strictEqual(webDetailRes.status, 200);
      const detailHtml = await webDetailRes.text();
      assert.ok(detailHtml.includes(`Application #${createdId}`));

      // 8. DELETE /api/applications/:id (200)
      const deleteRes = await fetch(`${baseUrl}/api/applications/${createdId}`, {
        method: 'DELETE'
      });
      assert.strictEqual(deleteRes.status, 200);

      // 9. Verify deletion (404)
      const checkRes = await fetch(`${baseUrl}/api/applications/${createdId}`);
      assert.strictEqual(checkRes.status, 404);
    } finally {
      server.close();
    }
  });
});
