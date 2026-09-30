const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./config/swagger');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Express Router to define whiteboard route requirements
const router = express.Router();

/**
 * 1. Requirement: GET / -> "ok"
 * 5. Requirement: GET / or home/main page -> "temporary one main page"
 * 
 * If opened in a web browser (Accept: text/html) or with ?page=main,
 * it serves "temporary one main page".
 * For API requests / curl / testing, it returns "ok".
 */
router.get('/', (req, res) => {
  if (req.query.page === 'main' || (req.headers.accept && req.headers.accept.includes('text/html'))) {
    return res.send('temporary one main page');
  }
  res.send('ok');
});

/**
 * 2. Requirement: GET /hello -> "Hello, World!"
 */
router.get('/hello', (req, res) => {
  res.send('Hello, World!');
});

/**
 * 3. Requirement: GET /hello/:name -> "Hello, {Name}!"
 * Example: /hello/emre -> "Hello, Emre!"
 */
router.get('/hello/:name', (req, res) => {
  const { name } = req.params;
  const formattedName = name.charAt(0).toUpperCase() + name.slice(1);
  res.send(`Hello, ${formattedName}!`);
});

/**
 * 4. Requirement: GET /sum/:number1/:number2 -> Result of adding two numbers
 * Example: /sum/5/10 -> "15"
 */
router.get('/sum/:number1/:number2', (req, res) => {
  const num1 = Number(req.params.number1);
  const num2 = Number(req.params.number2);

  if (isNaN(num1) || isNaN(num2)) {
    return res.status(400).send('Please provide valid numbers');
  }

  const result = num1 + num2;
  res.send(result.toString());
});

/**
 * 5. Requirement: GET /main or /home -> "temporary one main page"
 */
router.get(['/main', '/home'], (req, res) => {
  res.send('temporary one main page');
});

/**
 * 6. Requirement: GET /about -> "temp. about page"
 */
router.get('/about', (req, res) => {
  res.send('temp. about page');
});

// Whiteboard header note: GET http://localhost/alumni
router.get('/alumni', (req, res) => {
  res.send('ok');
});

/**
 * Task 1: GET /api/health (and /health) -> Returns system health status in JSON format
 */
router.get(['/api/health', '/health'], (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'System is healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// In-memory user storage (no database yet)
const users = [];

/**
 * Task 2: POST /api/users (and /users)
 * Adds a new user in-memory from form data (x-www-form-urlencoded or JSON)
 */
router.post(['/api/users', '/users'], (req, res) => {
  const formData = req.body;

  if (!formData || Object.keys(formData).length === 0) {
    return res.status(400).json({
      success: false,
      error: 'Form data is empty. Please provide user details (e.g. name, email).'
    });
  }

  const newUser = {
    id: users.length + 1,
    ...formData,
    createdAt: new Date().toISOString()
  };

  users.push(newUser);

  res.status(201).json({
    success: true,
    message: 'User created successfully',
    user: newUser,
    totalUsers: users.length
  });
});

/**
 * GET /api/users (and /users) -> List all in-memory users
 */
router.get(['/api/users', '/users'], (req, res) => {
  res.status(200).json({
    success: true,
    count: users.length,
    data: users
  });
});

/**
 * GET /api/users/:id (and /users/:id) -> Get user by ID
 */
router.get(['/api/users/:id', '/users/:id'], (req, res) => {
  const userId = Number(req.params.id);
  const user = users.find(u => u.id === userId);

  if (!user) {
    return res.status(404).json({
      success: false,
      error: `User with id ${req.params.id} not found`
    });
  }

  res.status(200).json({
    success: true,
    data: user
  });
});

/**
 * PUT /api/users/:id and PATCH /api/users/:id
 * Updates an existing user's details in-memory (supports form-urlencoded & JSON)
 */
const updateUserHandler = (req, res) => {
  const userId = Number(req.params.id);
  const userIndex = users.findIndex(u => u.id === userId);

  if (userIndex === -1) {
    return res.status(404).json({
      success: false,
      error: `User with id ${req.params.id} not found`
    });
  }

  const updateData = req.body;
  if (!updateData || Object.keys(updateData).length === 0) {
    return res.status(400).json({
      success: false,
      error: 'No update data provided. Please send updated fields.'
    });
  }

  // Merge updated fields while keeping original ID and creation timestamp
  users[userIndex] = {
    ...users[userIndex],
    ...updateData,
    id: userId,
    updatedAt: new Date().toISOString()
  };

  res.status(200).json({
    success: true,
    message: 'User updated successfully',
    user: users[userIndex]
  });
};

router.put(['/api/users/:id', '/users/:id'], updateUserHandler);
router.patch(['/api/users/:id', '/users/:id'], updateUserHandler);

/**
 * DELETE /api/users/:id (and /users/:id)
 * Deletes an existing user from in-memory storage
 */
router.delete(['/api/users/:id', '/users/:id'], (req, res) => {
  const userId = Number(req.params.id);
  const userIndex = users.findIndex(u => u.id === userId);

  if (userIndex === -1) {
    return res.status(404).json({
      success: false,
      error: `User with id ${req.params.id} not found`
    });
  }

  const deletedUser = users.splice(userIndex, 1)[0];

  res.status(200).json({
    success: true,
    message: 'User deleted successfully',
    deletedUser,
    totalUsers: users.length
  });
});

// Swagger UI API Documentation: GET /api/swagger and /api/docs
const swaggerOptions = {
  customSiteTitle: 'Alumni Tracking System API Docs'
};

app.use('/api/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument, swaggerOptions));
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, swaggerOptions));
router.get(['/api/swagger.json', '/swagger.json'], (req, res) => res.json(swaggerDocument));

// Mount routes at both root and /alumni prefix for maximum flexibility
app.use('/', router);
app.use('/alumni', router);

module.exports = app;
