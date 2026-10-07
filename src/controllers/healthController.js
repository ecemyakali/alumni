/**
 * Controller Layer: Health Controller
 * File: src/controllers/healthController.js
 * 
 * Handles system health status monitoring and uptime metrics.
 */

const healthController = {
  /**
   * Return server health status in JSON format
   * GET /api/health
   */
  getHealth(req, res) {
    res.status(200).json({
      status: 'ok',
      message: 'System is healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    });
  }
};

module.exports = healthController;
