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

    if (!data || !data.title || typeof data.title !== 'string' || data.title.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Title is a required field.'
      });
    }

    if (data.title.trim().length > 120) {
      return res.status(400).json({
        success: false,
        error: 'Title must not exceed 120 characters.'
      });
    }

    if (!data.company || typeof data.company !== 'string' || data.company.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Company is a required field.'
      });
    }

    // city and description are optional
    const newJob = await jobPostingModel.create({
      ...data,
      title: data.title.trim(),
      company: data.company.trim(),
      city: data.city ? data.city.trim() : null,
      location: data.location ? data.location.trim() : (data.city ? data.city.trim() : 'Remote'),
      description: data.description ? data.description.trim() : ''
    });

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
    const userId = (req.params && req.params.userId) || (req.query && req.query.postedBy);

    if (userId) {
      const all = await jobPostingModel.getAll();
      jobs = all.filter(j => Number(j.postedBy) === Number(userId));
    } else if (req.query && req.query.company) {
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

    if (updateData.title !== undefined) {
      if (typeof updateData.title !== 'string' || updateData.title.trim().length === 0) {
        return res.status(400).json({
          success: false,
          error: 'Title cannot be empty.'
        });
      }
      if (updateData.title.trim().length > 120) {
        return res.status(400).json({
          success: false,
          error: 'Title must not exceed 120 characters.'
        });
      }
      updateData.title = updateData.title.trim();
    }

    if (updateData.company !== undefined) {
      if (typeof updateData.company !== 'string' || updateData.company.trim().length === 0) {
        return res.status(400).json({
          success: false,
          error: 'Company cannot be empty.'
        });
      }
      updateData.company = updateData.company.trim();
    }

    if (updateData.city !== undefined && updateData.city) {
      updateData.city = updateData.city.trim();
      if (!updateData.location) {
        updateData.location = updateData.city;
      }
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
