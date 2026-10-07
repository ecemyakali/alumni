/**
 * Controller Layer: Whiteboard Controller
 * File: src/controllers/whiteboardController.js
 * 
 * Handles classroom introductory routes, greetings, math operations,
 * and informational static views.
 */

const whiteboardController = {
  /**
   * Root endpoint
   * GET /
   * Returns 'temporary one main page' if browser/main page, otherwise 'ok'
   */
  getRoot(req, res) {
    if (req.query.page === 'main' || (req.headers.accept && req.headers.accept.includes('text/html'))) {
      return res.send('temporary one main page');
    }
    return res.send('ok');
  },

  /**
   * Basic greeting
   * GET /hello
   */
  getHello(req, res) {
    return res.send('Hello, World!');
  },

  /**
   * Dynamic greeting by name
   * GET /hello/:name
   */
  getHelloNamed(req, res) {
    const { name } = req.params;
    const formattedName = name.charAt(0).toUpperCase() + name.slice(1);
    return res.send(`Hello, ${formattedName}!`);
  },

  /**
   * Sum two numbers
   * GET /sum/:number1/:number2
   */
  getSum(req, res) {
    const num1 = Number(req.params.number1);
    const num2 = Number(req.params.number2);

    if (isNaN(num1) || isNaN(num2)) {
      return res.status(400).send('Please provide valid numbers');
    }

    const result = num1 + num2;
    return res.send(result.toString());
  },

  /**
   * Main / Home page route
   * GET /main, GET /home
   */
  getMain(req, res) {
    return res.send('temporary one main page');
  },

  /**
   * About page route
   * GET /about
   */
  getAbout(req, res) {
    return res.send('temp. about page');
  },

  /**
   * Alumni route status
   * GET /alumni
   */
  getAlumni(req, res) {
    return res.send('ok');
  }
};

module.exports = whiteboardController;
