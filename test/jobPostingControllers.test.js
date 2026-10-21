const test = require('node:test');
const assert = require('node:assert');
const jobPostingModel = require('../src/models/jobPostingModel');
const apiJobPostingController = require('../src/controllers/apiJobPostingController');
const jobPostingController = require('../src/controllers/jobPostingController');
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

test('JobPosting Controllers & Routes Test Suite', async (t) => {
  t.beforeEach(() => {
    jobPostingModel.clear();
  });

  await t.test('ApiJobPostingController: RESTful JSON CRUD Operations', async (st) => {
    await st.test('CREATE: should create job posting and return 201 JSON', async () => {
      const req = {
        body: {
          title: 'Senior Frontend Engineer',
          company: 'Acme Corp',
          description: 'React and TypeScript engineering',
          location: 'Remote',
          type: 'full-time'
        }
      };
      const res = createMockRes();

      await apiJobPostingController.createJobPosting(req, res);
      assert.strictEqual(res.statusCode, 201);
      assert.strictEqual(res.body.success, true);
      assert.strictEqual(res.body.jobPosting.title, 'Senior Frontend Engineer');
      assert.strictEqual(res.body.jobPosting.company, 'Acme Corp');
    });

    await st.test('CREATE: should return 400 if title, company, or description missing', async () => {
      const req = { body: { title: 'Only Title' } };
      const res = createMockRes();

      await apiJobPostingController.createJobPosting(req, res);
      assert.strictEqual(res.statusCode, 400);
      assert.strictEqual(res.body.success, false);
    });

    await st.test('READ (All & ID): should retrieve all and single items', async () => {
      const item = await jobPostingModel.create({
        title: 'Backend Dev',
        company: 'Cloud Inc',
        description: 'Node.js services'
      });

      const resAll = createMockRes();
      await apiJobPostingController.getAllJobPostings({ query: {} }, resAll);
      assert.strictEqual(resAll.statusCode, 200);
      assert.strictEqual(resAll.body.count, 1);

      const resOne = createMockRes();
      await apiJobPostingController.getJobPostingById({ params: { id: item.id.toString() } }, resOne);
      assert.strictEqual(resOne.statusCode, 200);
      assert.strictEqual(resOne.body.data.title, 'Backend Dev');

      const resNotFound = createMockRes();
      await apiJobPostingController.getJobPostingById({ params: { id: '9999' } }, resNotFound);
      assert.strictEqual(resNotFound.statusCode, 404);
    });

    await st.test('READ (Query Filters): should filter by company and type', async () => {
      await jobPostingModel.create({ title: 'J1', company: 'Google', type: 'full-time', description: 'D1' });
      await jobPostingModel.create({ title: 'J2', company: 'Meta', type: 'contract', description: 'D2' });

      const resCompany = createMockRes();
      await apiJobPostingController.getAllJobPostings({ query: { company: 'Google' } }, resCompany);
      assert.strictEqual(resCompany.body.count, 1);
      assert.strictEqual(resCompany.body.data[0].company, 'Google');

      const resType = createMockRes();
      await apiJobPostingController.getAllJobPostings({ query: { type: 'contract' } }, resType);
      assert.strictEqual(resType.body.count, 1);
      assert.strictEqual(resType.body.data[0].company, 'Meta');
    });

    await st.test('UPDATE: should update job posting or return 404', async () => {
      const item = await jobPostingModel.create({ title: 'Initial', company: 'Comp', description: 'Desc' });

      const resUpdate = createMockRes();
      await apiJobPostingController.updateJobPosting({
        params: { id: item.id.toString() },
        body: { title: 'Updated Title' }
      }, resUpdate);

      assert.strictEqual(resUpdate.statusCode, 200);
      assert.strictEqual(resUpdate.body.jobPosting.title, 'Updated Title');

      const res404 = createMockRes();
      await apiJobPostingController.updateJobPosting({
        params: { id: '9999' },
        body: { title: 'Ghost' }
      }, res404);
      assert.strictEqual(res404.statusCode, 404);
    });

    await st.test('DELETE: should delete job posting or return 404', async () => {
      const item = await jobPostingModel.create({ title: 'To Delete', company: 'Comp', description: 'Desc' });

      const resDelete = createMockRes();
      await apiJobPostingController.deleteJobPosting({ params: { id: item.id.toString() } }, resDelete);
      assert.strictEqual(resDelete.statusCode, 200);
      assert.strictEqual(jobPostingModel.count(), 0);

      const resDelete404 = createMockRes();
      await apiJobPostingController.deleteJobPosting({ params: { id: '9999' } }, resDelete404);
      assert.strictEqual(resDelete404.statusCode, 404);
    });
  });

  await t.test('JobPostingController: Web CRUD Operations & View Layer', async (st) => {
    await st.test('CREATE: should render HTML list view on successful form submit', async () => {
      const req = {
        headers: { accept: 'text/html' },
        body: { title: 'Site Lead', company: 'Org', description: 'Leading web team' }
      };
      const res = createMockRes();

      await jobPostingController.createJobPosting(req, res);
      assert.strictEqual(res.statusCode, 201);
      assert.ok(typeof res.body === 'string');
      assert.ok(res.body.includes('Site Lead'));
      assert.ok(res.body.includes('posted successfully'));
    });

    await st.test('READ (All): should render HTML view when Accept: text/html', async () => {
      await jobPostingModel.create({ title: 'Public Lead', company: 'Public Co', description: 'Public Desc' });
      const req = { headers: { accept: 'text/html' } };
      const res = createMockRes();

      await jobPostingController.getAllJobPostings(req, res);
      assert.strictEqual(res.statusCode, 200);
      assert.ok(res.body.includes('Public Lead'));
      assert.ok(res.body.includes('Public Co'));
    });

    await st.test('READ (One): should render single detail HTML view', async () => {
      const item = await jobPostingModel.create({ title: 'Architect', company: 'BigCo', description: 'Cloud Architecture' });
      const req = { headers: { accept: 'text/html' }, params: { id: item.id.toString() } };
      const res = createMockRes();

      await jobPostingController.getJobPostingById(req, res);
      assert.strictEqual(res.statusCode, 200);
      assert.ok(res.body.includes('Architect'));
      assert.ok(res.body.includes('BigCo'));
    });

    await st.test('UPDATE & DELETE: should perform mutations via JobPostingController', async () => {
      const item = await jobPostingModel.create({ title: 'Before Edit', company: 'Co', description: 'Desc' });

      // Edit form
      const resEditForm = createMockRes();
      await jobPostingController.getEditJobPostingForm({ params: { id: item.id.toString() } }, resEditForm);
      assert.strictEqual(resEditForm.statusCode, 200);
      assert.ok(resEditForm.body.includes('Edit Job Posting'));

      // Update action
      const resUpdate = createMockRes();
      await jobPostingController.updateJobPosting({
        headers: { accept: 'text/html' },
        params: { id: item.id.toString() },
        body: { title: 'After Edit' }
      }, resUpdate);
      assert.strictEqual(resUpdate.statusCode, 200);
      assert.ok(resUpdate.body.includes('After Edit'));

      // Delete action
      const resDelete = createMockRes();
      await jobPostingController.deleteJobPosting({
        headers: { accept: 'text/html' },
        params: { id: item.id.toString() }
      }, resDelete);
      assert.strictEqual(resDelete.statusCode, 200);
      assert.strictEqual(jobPostingModel.count(), 0);
    });
  });

  await t.test('Integration HTTP Routes (Express App)', async () => {
    const server = app.listen(0);
    const port = server.address().port;
    const baseUrl = `http://localhost:${port}`;

    try {
      // 1. POST /api/job-postings
      const postRes = await fetch(`${baseUrl}/api/job-postings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'Full-Stack Developer',
          company: 'Acme Systems',
          description: 'Building end-to-end web apps'
        })
      });
      assert.strictEqual(postRes.status, 201);
      const postData = await postRes.json();
      assert.strictEqual(postData.success, true);
      const createdId = postData.jobPosting.id;

      // 2. GET /api/job-postings
      const listRes = await fetch(`${baseUrl}/api/job-postings`);
      assert.strictEqual(listRes.status, 200);
      const listData = await listRes.json();
      assert.strictEqual(listData.count, 1);

      // 3. GET /api/job-postings/:id
      const getRes = await fetch(`${baseUrl}/api/job-postings/${createdId}`);
      assert.strictEqual(getRes.status, 200);
      const getData = await getRes.json();
      assert.strictEqual(getData.data.title, 'Full-Stack Developer');

      // 4. PUT /api/job-postings/:id
      const putRes = await fetch(`${baseUrl}/api/job-postings/${createdId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ salary: '$90,000' })
      });
      assert.strictEqual(putRes.status, 200);

      // 5. GET /job-postings (HTML)
      const webListRes = await fetch(`${baseUrl}/job-postings`, {
        headers: { 'Accept': 'text/html' }
      });
      assert.strictEqual(webListRes.status, 200);
      const htmlText = await webListRes.text();
      assert.ok(htmlText.includes('Career Opportunities Board'));

      // 6. DELETE /api/job-postings/:id
      const deleteRes = await fetch(`${baseUrl}/api/job-postings/${createdId}`, {
        method: 'DELETE'
      });
      assert.strictEqual(deleteRes.status, 200);
    } finally {
      server.close();
    }
  });
});
