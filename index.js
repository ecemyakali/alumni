const app = require('./src/app');
const userModel = require('./src/models/userModel');
const announcementModel = require('./src/models/announcementModel');
const jobPostingModel = require('./src/models/jobPostingModel');
const userFactory = require('./factories/userFactory');
const announcementFactory = require('./factories/announcementFactory');
const jobPostingFactory = require('./factories/jobPostingFactory');

// Auto-seed in-memory store if empty on initial boot
if (userModel.count() === 0) {
  userFactory.buildMany(10).forEach(u => userModel.create(u));
}
if (announcementModel.count() === 0) {
  announcementFactory.buildMany(5).forEach(a => announcementModel.create(a));
}
if (jobPostingModel.count() === 0) {
  jobPostingFactory.buildMany(5).forEach(j => jobPostingModel.create(j));
}

const PORT = process.env.PORT || 5000;
const ALT_PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
  console.log(`Available routes:`);
  console.log(`  GET /                       -> "ok" (or "temporary one main page" in browser)`);
  console.log(`  GET /hello                  -> "Hello, World!"`);
  console.log(`  GET /hello/:name            -> "Hello, Emre!"`);
  console.log(`  GET /sum/:number1/:number2  -> e.g. /sum/5/10 -> 15`);
  console.log(`  GET /main                   -> "temporary one main page"`);
  console.log(`  GET /about                  -> "temp. about page"`);
  console.log(`  GET /alumni                 -> "ok"`);
  console.log(`  GET /api/health             -> JSON system health status`);
  console.log(`  GET /users                  -> Users Directory & Management Web View (HTML)`);
  console.log(`  GET /api/users              -> List all users (in-memory JSON)`);
  console.log(`  GET /announcements          -> Announcements Board Web View (HTML)`);
  console.log(`  GET /api/announcements      -> List all announcements (in-memory JSON)`);
  console.log(`  GET /api/swagger            -> Interactive Swagger UI Documentation`);
  console.log(`  GET /api/swagger.json       -> OpenAPI 3.0 JSON Specification`);
});

// Support both 5000 and 3000 ports simultaneously
app.listen(ALT_PORT, () => {
  console.log(`Server also listening at http://localhost:${ALT_PORT}`);
});
