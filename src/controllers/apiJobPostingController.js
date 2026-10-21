/**
 * ========================================================
 * Controller Layer: API Job Posting Controller
 * File: src/controllers/apiJobPostingController.js
 * ========================================================
 * 
 * RESTful API Controller for Career & Job Opportunity resources.
 * Returns standardized JSON representations with semantic HTTP status codes.
 * Endpoints: .../api/job-postings
 */

const jobPostingModel = require('../models/jobPostingModel');

const apiJobPostingController = {
  /**
   * CREATE: POST /api/job-postings
   */
  async createJobPosting(req, res) {
    const data = req.body;

    if (!data || !data.title || !data.company || !data.description) {
      return res.status(400).json({
        success: false,
        error: 'Title, company, and description are required fields for creating a job posting.'
      });
    }

    const newJob = await jobPostingModel.create(data);

    return res.status(201).json({
      success: true,
      message: 'Job posting created successfully',
      jobPosting: newJob,
      totalJobPostings: jobPostingModel.count()
    });
  },

  /**
   * READ (All): GET /api/job-postings
   */
  async getAllJobPostings(req, res) {
    let jobs;

    if (req.query && req.query.company) {
      jobs = await jobPostingModel.findByCompany(req.query.company);
    } else if (req.query && req.query.type) {
      jobs = await jobPostingModel.findByType(req.query.type);
    } else {
      jobs = await jobPostingModel.getAll();
    }

    return res.status(200).json({
      success: true,
      count: jobs.length,
      data: jobs
    });
  },

  /**
   * READ (By ID): GET /api/job-postings/:id
   */
  async getJobPostingById(req, res) {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(404).json({
        success: false,
        error: `Job posting with id ${req.params.id} not found`
      });
    }

    const item = await jobPostingModel.getById(id);

    if (!item) {
      return res.status(404).json({
        success: false,
        error: `Job posting with id ${req.params.id} not found`
      });
    }

    return res.status(200).json({
      success: true,
      data: item
    });
  },

  /**
   * UPDATE: PUT /api/job-postings/:id or PATCH /api/job-postings/:id
   */
  async updateJobPosting(req, res) {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(404).json({
        success: false,
        error: `Job posting with id ${req.params.id} not found`
      });
    }

    const existing = await jobPostingModel.getById(id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        error: `Job posting with id ${req.params.id} not found`
      });
    }

    const updateData = req.body;
    if (!updateData || Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No update data provided.'
      });
    }

    const updated = await jobPostingModel.update(id, updateData);

    return res.status(200).json({
      success: true,
      message: 'Job posting updated successfully',
      jobPosting: updated
    });
  },

  /**
   * DELETE: DELETE /api/job-postings/:id
   */
  async deleteJobPosting(req, res) {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(404).json({
        success: false,
        error: `Job posting with id ${req.params.id} not found`
      });
    }

    const deleted = await jobPostingModel.delete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: `Job posting with id ${req.params.id} not found`
      });
    }

    return res.status(200).json({
      success: true,
      message: `Job posting #${id} deleted successfully`,
      deletedJobPosting: deleted,
      remainingCount: jobPostingModel.count()
    });
  }
};

module.exports = apiJobPostingController;
