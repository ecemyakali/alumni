/**
 * ========================================================
 * Controller Layer: API Application Controller
 * File: src/controllers/apiApplicationController.js
 * ========================================================
 * 
 * RESTful API Controller for Job Application resources (Many-to-Many).
 * Returns standardized JSON representations with semantic HTTP status codes.
 * Endpoints: .../api/applications
 */

const applicationModel = require('../models/applicationModel');

const VALID_STATUSES = ['pending', 'reviewing', 'accepted', 'rejected', 'withdrawn'];

const apiApplicationController = {
  /**
   * CREATE: POST /api/applications
   */
  async createApplication(req, res) {
    const data = req.body;

    if (!data || data.userId === undefined || data.jobPostingId === undefined || data.userId === null || data.jobPostingId === null || data.userId === '' || data.jobPostingId === '') {
      return res.status(400).json({
        success: false,
        error: 'User ID and Job Posting ID are required fields.'
      });
    }

    if (data.status && !VALID_STATUSES.includes(data.status.toLowerCase())) {
      return res.status(400).json({
        success: false,
        error: `Invalid status "${data.status}". Allowed values: ${VALID_STATUSES.join(', ')}`
      });
    }

    try {
      const newApp = await applicationModel.create(data);

      return res.status(201).json({
        success: true,
        message: 'Application submitted successfully',
        application: newApp,
        totalApplications: applicationModel.count()
      });
    } catch (err) {
      if (err.code === '23505' || (err.message && err.message.includes('already applied'))) {
        return res.status(409).json({
          success: false,
          error: 'This user has already applied for this job posting.'
        });
      }
      return res.status(500).json({
        success: false,
        error: err.message || 'Failed to submit application'
      });
    }
  },

  /**
   * READ (All): GET /api/applications
   * Optional query params: ?userId=1, ?jobPostingId=2
   */
  async getAllApplications(req, res) {
    let applications;

    if (req.query && req.query.userId) {
      applications = await applicationModel.findByUserId(req.query.userId);
    } else if (req.query && req.query.jobPostingId) {
      applications = await applicationModel.findByJobPostingId(req.query.jobPostingId);
    } else {
      applications = await applicationModel.getAll();
    }

    return res.status(200).json({
      success: true,
      count: applications.length,
      data: applications
    });
  },

  /**
   * READ (By ID): GET /api/applications/:id
   */
  async getApplicationById(req, res) {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(404).json({
        success: false,
        error: `Application with id ${req.params.id} not found`
      });
    }

    const item = await applicationModel.getById(id);

    if (!item) {
      return res.status(404).json({
        success: false,
        error: `Application with id ${req.params.id} not found`
      });
    }

    return res.status(200).json({
      success: true,
      data: item
    });
  },

  /**
   * UPDATE: PUT /api/applications/:id or PATCH /api/applications/:id
   */
  async updateApplication(req, res) {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(404).json({
        success: false,
        error: `Application with id ${req.params.id} not found`
      });
    }

    const existing = await applicationModel.getById(id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        error: `Application with id ${req.params.id} not found`
      });
    }

    const updateData = req.body;
    if (!updateData || Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No update data provided.'
      });
    }

    if (updateData.status && !VALID_STATUSES.includes(updateData.status.toLowerCase())) {
      return res.status(400).json({
        success: false,
        error: `Invalid status "${updateData.status}". Allowed values: ${VALID_STATUSES.join(', ')}`
      });
    }

    const updated = await applicationModel.update(id, updateData);

    return res.status(200).json({
      success: true,
      message: 'Application updated successfully',
      application: updated
    });
  },

  /**
   * DELETE: DELETE /api/applications/:id
   */
  async deleteApplication(req, res) {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(404).json({
        success: false,
        error: `Application with id ${req.params.id} not found`
      });
    }

    const deleted = await applicationModel.delete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: `Application with id ${req.params.id} not found`
      });
    }

    return res.status(200).json({
      success: true,
      message: `Application #${id} deleted successfully`,
      deletedApplication: deleted,
      remainingCount: applicationModel.count()
    });
  }
};

module.exports = apiApplicationController;
