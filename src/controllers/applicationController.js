/**
 * ========================================================
 * Controller Layer: Web Application Controller
 * File: src/controllers/applicationController.js
 * ========================================================
 * 
 * Web / Application Controller for Job Application (Many-to-Many) resources.
 * Integrates with applicationModel and applicationView:
 * - CREATE: createApplication (POST /applications)
 * - READ (All): getAllApplications (GET /applications)
 * - READ (One): getApplicationById (GET /applications/:id)
 * - UPDATE Form: getEditApplicationForm (GET /applications/:id/edit)
 * - UPDATE: updateApplication (POST /applications/:id/update, PUT, PATCH)
 * - DELETE: deleteApplication (POST /applications/:id/delete, DELETE)
 */

const applicationModel = require('../models/applicationModel');
const jobPostingModel = require('../models/jobPostingModel');
const userModel = require('../models/userModel');
const applicationView = require('../views/applicationView');

const VALID_STATUSES = ['pending', 'reviewing', 'accepted', 'rejected', 'withdrawn'];

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

const applicationController = {
  /**
   * CREATE: POST /applications
   */
  async createApplication(req, res) {
    const data = req.body;
    const expectsHtml = isHtmlRequest(req);

    if (!data || data.userId === undefined || data.jobPostingId === undefined || data.userId === null || data.jobPostingId === null || data.userId === '' || data.jobPostingId === '') {
      if (expectsHtml) {
        return res.status(400).send(applicationView.renderApplicationsList(await applicationModel.getAll(), {
          errorMessage: 'User ID and Job Posting ID are required fields.'
        }));
      }
      return res.status(400).json({
        success: false,
        error: 'User ID and Job Posting ID are required fields.'
      });
    }

    if (data.status && !VALID_STATUSES.includes(data.status.toLowerCase())) {
      if (expectsHtml) {
        return res.status(400).send(applicationView.renderApplicationsList(await applicationModel.getAll(), {
          errorMessage: `Invalid status "${data.status}". Allowed values: ${VALID_STATUSES.join(', ')}`
        }));
      }
      return res.status(400).json({
        success: false,
        error: `Invalid status "${data.status}". Allowed values: ${VALID_STATUSES.join(', ')}`
      });
    }

    try {
      const newApp = await applicationModel.create(data);

      if (expectsHtml) {
        return res.status(201).send(applicationView.renderApplicationsList(await applicationModel.getAll(), {
          successMessage: `Application for Job #${newApp.jobPostingId} submitted successfully!`
        }));
      }

      return res.status(201).json({
        success: true,
        message: 'Application submitted successfully',
        application: newApp
      });
    } catch (err) {
      if (err.code === '23505' || (err.message && err.message.includes('already applied'))) {
        if (expectsHtml) {
          return res.status(409).send(applicationView.renderApplicationsList(await applicationModel.getAll(), {
            errorMessage: 'This user has already applied for this job posting.'
          }));
        }
        return res.status(409).json({
          success: false,
          error: 'This user has already applied for this job posting.'
        });
      }

      if (expectsHtml) {
        return res.status(500).send(applicationView.renderError(err.message || 'Failed to submit application', { statusCode: 500 }));
      }
      return res.status(500).json({
        success: false,
        error: err.message || 'Failed to submit application'
      });
    }
  },

  /**
   * READ (All): GET /applications
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

    if (isHtmlRequest(req)) {
      const jobs = await jobPostingModel.getAll();
      const users = await userModel.getAll();
      const selectedJobId = req.query ? req.query.jobPostingId : null;
      return res.status(200).send(applicationView.renderApplicationsList(applications, { jobs, users, selectedJobId }));
    }

    return res.status(200).json({
      success: true,
      count: applications.length,
      data: applications
    });
  },

  /**
   * READ (One): GET /applications/:id
   */
  async getApplicationById(req, res) {
    const id = Number(req.params.id);
    const expectsHtml = isHtmlRequest(req);

    if (isNaN(id)) {
      if (expectsHtml) {
        return res.status(404).send(applicationView.renderError('Invalid application ID', { statusCode: 404 }));
      }
      return res.status(404).json({ success: false, error: 'Invalid application ID' });
    }

    const item = await applicationModel.getById(id);

    if (!item) {
      if (expectsHtml) {
        return res.status(404).send(applicationView.renderError(`Application with ID #${req.params.id} not found`, { statusCode: 404 }));
      }
      return res.status(404).json({
        success: false,
        error: `Application with ID ${req.params.id} not found`
      });
    }

    if (expectsHtml) {
      const user = await userModel.getById(item.userId);
      const job = await jobPostingModel.getById(item.jobPostingId);
      return res.status(200).send(applicationView.renderApplicationDetail(item, { user, job }));
    }

    return res.status(200).json({
      success: true,
      data: item
    });
  },

  /**
   * UPDATE (Edit Form View): GET /applications/:id/edit
   */
  async getEditApplicationForm(req, res) {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(404).send(applicationView.renderError('Invalid application ID', { statusCode: 404 }));
    }

    const item = await applicationModel.getById(id);

    if (!item) {
      return res.status(404).send(applicationView.renderError(`Application with ID #${req.params.id} not found`, { statusCode: 404 }));
    }

    const user = await userModel.getById(item.userId);
    const job = await jobPostingModel.getById(item.jobPostingId);
    return res.status(200).send(applicationView.renderEditApplicationForm(item, { user, job }));
  },

  /**
   * UPDATE (Action): POST /applications/:id/update, PUT, PATCH
   */
  async updateApplication(req, res) {
    const id = Number(req.params.id);
    const expectsHtml = isHtmlRequest(req);

    if (isNaN(id)) {
      if (expectsHtml) {
        return res.status(404).send(applicationView.renderError('Invalid application ID', { statusCode: 404 }));
      }
      return res.status(404).json({ success: false, error: 'Invalid application ID' });
    }

    const existing = await applicationModel.getById(id);
    if (!existing) {
      if (expectsHtml) {
        return res.status(404).send(applicationView.renderError(`Application with ID #${req.params.id} not found`, { statusCode: 404 }));
      }
      return res.status(404).json({
        success: false,
        error: `Application with ID ${req.params.id} not found`
      });
    }

    const updateData = req.body;
    if (updateData && updateData.status && !VALID_STATUSES.includes(updateData.status.toLowerCase())) {
      if (expectsHtml) {
        return res.status(400).send(applicationView.renderEditApplicationForm(existing, {
          errorMessage: `Invalid status "${updateData.status}". Allowed values: ${VALID_STATUSES.join(', ')}`
        }));
      }
      return res.status(400).json({
        success: false,
        error: `Invalid status "${updateData.status}". Allowed values: ${VALID_STATUSES.join(', ')}`
      });
    }

    const updated = await applicationModel.update(id, updateData);

    if (expectsHtml) {
      return res.status(200).send(applicationView.renderApplicationDetail(updated, {
        successMessage: 'Application updated successfully!'
      }));
    }

    return res.status(200).json({
      success: true,
      message: 'Application updated successfully',
      application: updated
    });
  },

  /**
   * DELETE (Action): POST /applications/:id/delete, DELETE
   */
  async deleteApplication(req, res) {
    const id = Number(req.params.id);
    const expectsHtml = isHtmlRequest(req);

    if (isNaN(id)) {
      if (expectsHtml) {
        return res.status(404).send(applicationView.renderError('Invalid application ID', { statusCode: 404 }));
      }
      return res.status(404).json({ success: false, error: 'Invalid application ID' });
    }

    const deleted = await applicationModel.delete(id);

    if (!deleted) {
      if (expectsHtml) {
        return res.status(404).send(applicationView.renderError(`Application with ID #${req.params.id} not found`, { statusCode: 404 }));
      }
      return res.status(404).json({
        success: false,
        error: `Application with ID ${req.params.id} not found`
      });
    }

    if (expectsHtml) {
      return res.status(200).send(applicationView.renderApplicationsList(await applicationModel.getAll(), {
        successMessage: `Application #${id} deleted successfully.`
      }));
    }

    return res.status(200).json({
      success: true,
      message: `Application #${id} deleted successfully`,
      deletedApplication: deleted
    });
  }
};

module.exports = applicationController;
