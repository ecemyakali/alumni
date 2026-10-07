/**
 * Router Layer: Whiteboard Routes
 * File: src/routes/whiteboardRoutes.js
 * 
 * Maps classroom introductory endpoints to whiteboardController actions.
 */

const express = require('express');
const router = express.Router();
const whiteboardController = require('../controllers/whiteboardController');

// Whiteboard endpoints
router.get('/', whiteboardController.getRoot);
router.get('/hello', whiteboardController.getHello);
router.get('/hello/:name', whiteboardController.getHelloNamed);
router.get('/sum/:number1/:number2', whiteboardController.getSum);
router.get(['/main', '/home'], whiteboardController.getMain);
router.get('/about', whiteboardController.getAbout);
router.get('/alumni', whiteboardController.getAlumni);

module.exports = router;
