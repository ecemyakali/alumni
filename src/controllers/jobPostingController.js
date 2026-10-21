/**
 * ========================================================
 * Controller Layer: Web Job Posting Controller
 * File: src/controllers/jobPostingController.js
 * ========================================================
 * 
 * Web / Application Controller for Career & Job Opportunities resources.
 * Integrates with jobPostingModel and jobPostingView:
 * - CREATE: createJobPosting (POST /job-postings)
 * - READ (All): getAllJobPostings (GET /job-postings)
 * - READ (One): getJobPostingById (GET /job-postings/:id)
 * - UPDATE Form: getEditJobPostingForm (GET /job-postings/:id/edit)
 * - UPDATE: updateJobPosting (POST /job-postings/:id/update, PUT, PATCH)
 * - DELETE: deleteJobPosting (POST /job-postings/:id/delete, DELETE)
 */

const jobPostingModel = require('../models/jobPostingModel');
const applicationModel = require('../models/applicationModel');
const userModel = require('../models/userModel');
const jobPostingView = require('../views/jobPostingView');

/**
 * Safely determines if incoming request expects HTML View response
 */
function isHtmlRequest(req) {
  if (req.headers && typeof req.headers.accept === 'string' && req.headers.accept.includes('text/html')) {
    return true;
  }
  if (typeof req.is === 'function' && req.is('application/x-www-form-urlencoded')) {
    return true;
  }
  if (req.query && req.query.format === 'html') {
    return true;
  }
  return false;
}

const jobPostingController = {
  /**
   * CREATE: POST /job-postings
   */
  async createJobPosting(req, res) {
    const data = req.body;
    const expectsHtml = isHtmlRequest(req);

    if (!data || !data.title || !data.company || !data.description) {
      if (expectsHtml) {
        return res.status(400).send(jobPostingView.renderJobPostingsList(await jobPostingModel.getAll(), {
          errorMessage: 'Title, Company, and Description are required fields.'
        }));
      }
      return res.status(400).json({
        success: false,
        error: 'Title, Company, and Description are required fields.'
      });
    }

    const newJob = await jobPostingModel.create(data);

    if (expectsHtml) {
      return res.status(201).send(jobPostingView.renderJobPostingsList(await jobPostingModel.getAll(), {
        successMessage: `Career opportunity "${newJob.title}" posted successfully!`
      }));
    }

    return res.status(201).json({
      success: true,
      message: 'Job posting created successfully',
      jobPosting: newJob
    });
  },

  /**
   * READ (All): GET /job-postings
   */
  async getAllJobPostings(req, res) {
    const jobs = await jobPostingModel.getAll();

    if (isHtmlRequest(req)) {
      const applications = await applicationModel.getAll();
      return res.status(200).send(jobPostingView.renderJobPostingsList(jobs, { applications }));
    }

    return res.status(200).json({
      success: true,
      count: jobs.length,
      data: jobs
    });
  },

  /**
   * READ (One): GET /job-postings/:id
   */
  async getJobPostingById(req, res) {
    const id = Number(req.params.id);
    const expectsHtml = isHtmlRequest(req);

    if (isNaN(id)) {
      if (expectsHtml) {
        return res.status(404).send(jobPostingView.renderError('Invalid job posting ID', { statusCode: 404 }));
      }
      return res.status(404).json({ success: false, error: 'Invalid job posting ID' });
    }

    const item = await jobPostingModel.getById(id);

    if (!item) {
      if (expectsHtml) {
        return res.status(404).send(jobPostingView.renderError(`Job posting with ID #${req.params.id} not found`, { statusCode: 404 }));
      }
      return res.status(404).json({
        success: false,
        error: `Job posting with ID ${req.params.id} not found`
      });
    }

    if (expectsHtml) {
      const applications = await applicationModel.findByJobPostingId(id);
      const users = await userModel.getAll();
      return res.status(200).send(jobPostingView.renderJobPostingDetail(item, { applications, users }));
    }

    return res.status(200).json({
      success: true,
      data: item
    });
  },

  /**
   * UPDATE (Edit Form View): GET /job-postings/:id/edit
   */
  async getEditJobPostingForm(req, res) {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(404).send(jobPostingView.renderError('Invalid job posting ID', { statusCode: 404 }));
    }

    const item = await jobPostingModel.getById(id);

    if (!item) {
      return res.status(404).send(jobPostingView.renderError(`Job posting with ID #${req.params.id} not found`, { statusCode: 404 }));
    }

    return res.status(200).send(jobPostingView.renderEditJobPostingForm(item));
  },

  /**
   * UPDATE (Action): POST /job-postings/:id/update, PUT, PATCH
   */
  async updateJobPosting(req, res) {
    const id = Number(req.params.id);
    const expectsHtml = isHtmlRequest(req);

    if (isNaN(id)) {
      if (expectsHtml) {
        return res.status(404).send(jobPostingView.renderError('Invalid job posting ID', { statusCode: 404 }));
      }
      return res.status(404).json({ success: false, error: 'Invalid job posting ID' });
    }

    const existing = await jobPostingModel.getById(id);
    if (!existing) {
      if (expectsHtml) {
        return res.status(404).send(jobPostingView.renderError(`Job posting with ID #${req.params.id} not found`, { statusCode: 404 }));
      }
      return res.status(404).json({
        success: false,
        error: `Job posting with ID ${req.params.id} not found`
      });
    }

    const updateData = req.body;
    const updated = await jobPostingModel.update(id, updateData);

    if (expectsHtml) {
      return res.status(200).send(jobPostingView.renderJobPostingDetail(updated, {
        successMessage: 'Job posting updated successfully!'
      }));
    }

    return res.status(200).json({
      success: true,
      message: 'Job posting updated successfully',
      jobPosting: updated
    });
  },

  /**
   * DELETE (Action): POST /job-postings/:id/delete, DELETE
   */
  async deleteJobPosting(req, res) {
    const id = Number(req.params.id);
    const expectsHtml = isHtmlRequest(req);

    if (isNaN(id)) {
      if (expectsHtml) {
        return res.status(404).send(jobPostingView.renderError('Invalid job posting ID', { statusCode: 404 }));
      }
      return res.status(404).json({ success: false, error: 'Invalid job posting ID' });
    }

    const deleted = await jobPostingModel.delete(id);

    if (!deleted) {
      if (expectsHtml) {
        return res.status(404).send(jobPostingView.renderError(`Job posting with ID #${req.params.id} not found`, { statusCode: 404 }));
      }
      return res.status(404).json({
        success: false,
        error: `Job posting with ID ${req.params.id} not found`
      });
    }

    if (expectsHtml) {
      return res.status(200).send(jobPostingView.renderJobPostingsList(await jobPostingModel.getAll(), {
        successMessage: `Job posting #${id} deleted successfully.`
      }));
    }

    return res.status(200).json({
      success: true,
      message: `Job posting #${id} deleted successfully`,
      deletedJobPosting: deleted
    });
  }
};

module.exports = jobPostingController;
