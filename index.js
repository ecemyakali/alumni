const app = require('./src/app');

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
  console.log(`  POST /api/users             -> Add user via form data (in-memory)`);
  console.log(`  GET /api/users              -> List all users (in-memory)`);
  console.log(`  GET /api/users/:id          -> Get user by ID (in-memory)`);
  console.log(`  PUT /api/users/:id          -> Update user details by ID (in-memory)`);
  console.log(`  PATCH /api/users/:id        -> Partial update user details by ID (in-memory)`);
  console.log(`  DELETE /api/users/:id       -> Delete user by ID (in-memory)`);
  console.log(`  GET /api/swagger            -> Interactive Swagger UI Documentation`);
  console.log(`  GET /api/swagger.json       -> OpenAPI 3.0 JSON Specification`);
});

// Support both 5000 and 3000 ports simultaneously
app.listen(ALT_PORT, () => {
  console.log(`Server also listening at http://localhost:${ALT_PORT}`);
});
