/**
 * Router Layer: Whiteboard Routes
 * File: src/routes/whiteboardRoutes.js
 * 
 * Maps classroom introductory endpoints to whiteboardController actions.
 */

const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const whiteboardController = require('../controllers/whiteboardController');

// Whiteboard endpoints
router.get('/', whiteboardController.getRoot);
router.get('/hello', whiteboardController.getHello);
router.get('/hello/:name', whiteboardController.getHelloNamed);
router.get('/sum/:number1/:number2', whiteboardController.getSum);
router.get(['/main', '/home'], whiteboardController.getMain);
router.get('/about', whiteboardController.getAbout);
router.get('/alumni', whiteboardController.getAlumni);

// Documentation files
router.get('/brand.md', (req, res) => {
  const filePath = path.join(__dirname, '../../brand.md');
  if (fs.existsSync(filePath)) {
    return res.type('text/markdown').sendFile(filePath);
  }
  return res.status(404).send('brand.md not found');
});

router.get(['/design.md', '/DESIGN.md'], (req, res) => {
  const filePath = path.join(__dirname, '../../DESIGN.md');
  if (fs.existsSync(filePath)) {
    return res.type('text/markdown').sendFile(filePath);
  }
  return res.status(404).send('DESIGN.md not found');
});

module.exports = router;
