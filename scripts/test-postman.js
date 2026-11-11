/**
 * Automated Postman Request Runner for Alumni Tracking System
 * Executes the exact HTTP requests defined in the Postman collection
 * specifically targeting invalid requests (400 Bad Request) and valid edge cases.
 */
const http = require('http');
const app = require('../src/app');
const jobPostingModel = require('../src/models/jobPostingModel');
const userModel = require('../src/models/userModel');

async function run() {
  console.log('='.repeat(70));
  console.log('🚀 POSTMAN REQUEST RUNNER: INVALID REQUESTS & VALIDATION TEST SUITE');
  console.log('='.repeat(70));

  // Reset in-memory states
  jobPostingModel.clear();
  userModel.clear();

  // Spin up test server
  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, resolve));
  const port = server.address().port;
  const baseUrl = `http://127.0.0.1:${port}`;
  console.log(`📡 Backend listening on ${baseUrl}\n`);

  let passed = 0;
  let failed = 0;

  async function testCase(name, requestFn, assertions) {
    try {
      const res = await requestFn();
      let body = null;
      const text = await res.text();
      try {
        body = JSON.parse(text);
      } catch {
        body = text;
      }

      assertions(res, body);
      console.log(`  ✅ [PASS] ${name} (Status: ${res.status})`);
      passed++;
    } catch (err) {
      console.error(`  ❌ [FAIL] ${name}`);
      console.error(`     Error: ${err.message}`);
      failed++;
    }
  }

  console.log('--- 1. Testing Invalid Requests (Postman Collection) ---');

  // 1. Missing title
  await testCase(
    'POST /api/job-postings - Missing Title (Expect 400 Bad Request)',
    () => fetch(`${baseUrl}/api/job-postings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        company: 'TechCorp Solutions',
        city: 'Istanbul',
        description: 'Backend role'
      })
    }),
    (res, body) => {
      if (res.status !== 400) throw new Error(`Expected status 400, got ${res.status}`);
      if (body.success !== false) throw new Error('Expected success: false');
      if (!body.error.includes('Title is a required field')) {
        throw new Error(`Expected title error, got: ${body.error}`);
      }
    }
  );

  // 2. Title exceeds 120 characters
  await testCase(
    'POST /api/job-postings - Title Exceeds 120 Characters (Expect 400 Bad Request)',
    () => fetch(`${baseUrl}/api/job-postings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Senior Staff Principal Cloud Native Distributed Systems Architect and Enterprise Infrastructure Engineering Team Director 2026', // 124 chars
        company: 'TechCorp Solutions',
        city: 'Istanbul'
      })
    }),
    (res, body) => {
      if (res.status !== 400) throw new Error(`Expected status 400, got ${res.status}`);
      if (body.success !== false) throw new Error('Expected success: false');
      if (!body.error.includes('120 characters')) {
        throw new Error(`Expected max length error, got: ${body.error}`);
      }
    }
  );

  // 3. Missing company
  await testCase(
    'POST /api/job-postings - Missing Company (Expect 400 Bad Request)',
    () => fetch(`${baseUrl}/api/job-postings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Software Engineer',
        city: 'Istanbul'
      })
    }),
    (res, body) => {
      if (res.status !== 400) throw new Error(`Expected status 400, got ${res.status}`);
      if (body.success !== false) throw new Error('Expected success: false');
      if (!body.error.includes('Company is a required field')) {
        throw new Error(`Expected company error, got: ${body.error}`);
      }
    }
  );

  // 4. Empty / Whitespace title & company
  await testCase(
    'POST /api/job-postings - Whitespace Only Title (Expect 400 Bad Request)',
    () => fetch(`${baseUrl}/api/job-postings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: '    ',
        company: 'TechCorp'
      })
    }),
    (res, body) => {
      if (res.status !== 400) throw new Error(`Expected status 400, got ${res.status}`);
      if (body.success !== false) throw new Error('Expected success: false');
    }
  );

  // 5. Create valid base item for update tests
  const initialPost = await fetch(`${baseUrl}/api/job-postings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: 'Initial Position',
      company: 'Base Corp'
    })
  });
  const initialData = await initialPost.json();
  const validId = initialData.jobPosting.id;

  // 6. PUT invalid title > 120 chars
  await testCase(
    'PUT /api/job-postings/:id - Update Title Exceeds 120 Chars (Expect 400 Bad Request)',
    () => fetch(`${baseUrl}/api/job-postings/${validId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Senior Staff Principal Cloud Native Distributed Systems Architect and Enterprise Infrastructure Engineering Team Director 2026'
      })
    }),
    (res, body) => {
      if (res.status !== 400) throw new Error(`Expected status 400, got ${res.status}`);
      if (body.success !== false) throw new Error('Expected success: false');
      if (!body.error.includes('120 characters')) {
        throw new Error(`Expected max length error on update, got: ${body.error}`);
      }
    }
  );

  // 7. PUT invalid empty company
  await testCase(
    'PUT /api/job-postings/:id - Update Company with Empty String (Expect 400 Bad Request)',
    () => fetch(`${baseUrl}/api/job-postings/${validId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        company: '   '
      })
    }),
    (res, body) => {
      if (res.status !== 400) throw new Error(`Expected status 400, got ${res.status}`);
      if (body.success !== false) throw new Error('Expected success: false');
      if (!body.error.includes('Company cannot be empty')) {
        throw new Error(`Expected company empty error, got: ${body.error}`);
      }
    }
  );

  console.log('\n--- 2. Testing Valid Requests & Optional Fields ---');

  // 8. Valid: city & description omitted
  await testCase(
    'POST /api/job-postings - Optional City & Description Omitted (Expect 201 Created)',
    () => fetch(`${baseUrl}/api/job-postings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Backend Software Engineer',
        company: 'Acme Innovations'
      })
    }),
    (res, body) => {
      if (res.status !== 201) throw new Error(`Expected status 201, got ${res.status}`);
      if (body.success !== true) throw new Error('Expected success: true');
      if (body.jobPosting.title !== 'Backend Software Engineer') throw new Error('Title mismatch');
      if (body.jobPosting.company !== 'Acme Innovations') throw new Error('Company mismatch');
      if (body.jobPosting.location !== 'Remote') throw new Error('Expected location: Remote');
    }
  );

  // 9. Valid: optional city provided
  await testCase(
    'POST /api/job-postings - Optional City Provided (Expect 201 Created)',
    () => fetch(`${baseUrl}/api/job-postings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Frontend React Developer',
        company: 'Trendyol Tech',
        city: 'Istanbul'
      })
    }),
    (res, body) => {
      if (res.status !== 201) throw new Error(`Expected status 201, got ${res.status}`);
      if (body.success !== true) throw new Error('Expected success: true');
      if (body.jobPosting.city !== 'Istanbul') throw new Error('City mismatch');
      if (body.jobPosting.location !== 'Istanbul') throw new Error('Location mismatch');
    }
  );

  // 10. List job postings
  await testCase(
    'GET /api/job-postings - Retrieve All Job Postings (Expect 200 OK)',
    () => fetch(`${baseUrl}/api/job-postings`),
    (res, body) => {
      if (res.status !== 200) throw new Error(`Expected status 200, got ${res.status}`);
      if (body.success !== true) throw new Error('Expected success: true');
      if (!Array.isArray(body.data)) throw new Error('Expected array of job postings');
      if (body.count < 3) throw new Error('Expected at least 3 job postings');
    }
  );

  // 11. Application invalid request
  await testCase(
    'POST /api/applications - Missing Required Fields (Expect 400 Bad Request)',
    () => fetch(`${baseUrl}/api/applications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        resumeUrl: 'https://example.com/cv.pdf'
      })
    }),
    (res, body) => {
      if (res.status !== 400) throw new Error(`Expected status 400, got ${res.status}`);
      if (body.success !== false) throw new Error('Expected success: false');
    }
  );

  server.close();

  console.log('\n' + '='.repeat(70));
  console.log(`📊 SUMMARY: ${passed} Passed, ${failed} Failed`);
  console.log('='.repeat(70));

  if (failed > 0) {
    process.exit(1);
  }
}

run().catch((err) => {
  console.error('Fatal runner error:', err);
  process.exit(1);
});
