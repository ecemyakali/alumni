const express = require('express');

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

// Mount routes at both root and /alumni prefix for maximum flexibility
app.use('/', router);
app.use('/alumni', router);

module.exports = app;
