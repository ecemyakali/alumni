/**
 * ========================================================
 * Controller Layer: Web Announcement Controller
 * File: src/controllers/announcementController.js
 * ========================================================
 * 
 * Homework: Web / Application Controller for Announcement resources.
 * Integrates with announcementModel and announcementView:
 * - CREATE: createAnnouncement (POST /announcements)
 * - READ (All): getAllAnnouncements (GET /announcements)
 * - READ (One): getAnnouncementById (GET /announcements/:id)
 * - UPDATE Form: getEditAnnouncementForm (GET /announcements/:id/edit)
 * - UPDATE: updateAnnouncement (POST /announcements/:id/update, PUT, PATCH)
 * - DELETE: deleteAnnouncement (POST /announcements/:id/delete, DELETE)
 */

const announcementModel = require('../models/announcementModel');
const announcementView = require('../views/announcementView');

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

const announcementController = {
  /**
   * CREATE: POST /announcements
   */
  createAnnouncement(req, res) {
    const data = req.body;
    const expectsHtml = isHtmlRequest(req);

    if (!data || !data.title || !data.content) {
      if (expectsHtml) {
        return res.status(400).send(announcementView.renderAnnouncementsList(announcementModel.getAll(), {
          errorMessage: 'Both Title and Content are required fields.'
        }));
      }
      return res.status(400).json({
        success: false,
        error: 'Both Title and Content are required fields.'
      });
    }

    const newAnnouncement = announcementModel.create(data);

    if (expectsHtml) {
      return res.status(201).send(announcementView.renderAnnouncementsList(announcementModel.getAll(), {
        successMessage: `Announcement "${newAnnouncement.title}" published successfully!`
      }));
    }

    return res.status(201).json({
      success: true,
      message: 'Announcement published successfully',
      announcement: newAnnouncement,
      totalAnnouncements: announcementModel.count()
    });
  },

  /**
   * READ (All): GET /announcements
   */
  getAllAnnouncements(req, res) {
    const list = announcementModel.getAll();

    if (isHtmlRequest(req)) {
      return res.status(200).send(announcementView.renderAnnouncementsList(list));
    }

    return res.status(200).json({
      success: true,
      count: list.length,
      data: list
    });
  },

  /**
   * READ (One): GET /announcements/:id
   */
  getAnnouncementById(req, res) {
    const id = Number(req.params.id);
    const item = announcementModel.getById(id);
    const expectsHtml = isHtmlRequest(req);

    if (!item) {
      if (expectsHtml) {
        return res.status(404).send(announcementView.renderError(`Announcement #${req.params.id} not found.`, 404));
      }
      return res.status(404).json({
        success: false,
        error: `Announcement #${req.params.id} not found`
      });
    }

    if (expectsHtml) {
      return res.status(200).send(announcementView.renderAnnouncementDetail(item));
    }

    return res.status(200).json({
      success: true,
      data: item
    });
  },

  /**
   * UPDATE (Edit Form View): GET /announcements/:id/edit
   */
  getEditAnnouncementForm(req, res) {
    const id = Number(req.params.id);
    const item = announcementModel.getById(id);
    const expectsHtml = isHtmlRequest(req);

    if (!item) {
      if (expectsHtml) {
        return res.status(404).send(announcementView.renderError(`Announcement #${req.params.id} not found.`, 404));
      }
      return res.status(404).json({
        success: false,
        error: `Announcement #${req.params.id} not found`
      });
    }

    return res.status(200).send(announcementView.renderEditAnnouncementForm(item));
  },

  /**
   * UPDATE: POST /announcements/:id/update, PUT, PATCH
   */
  updateAnnouncement(req, res) {
    const id = Number(req.params.id);
    const existing = announcementModel.getById(id);
    const expectsHtml = isHtmlRequest(req);

    if (!existing) {
      if (expectsHtml) {
        return res.status(404).send(announcementView.renderError(`Announcement #${req.params.id} not found.`, 404));
      }
      return res.status(404).json({
        success: false,
        error: `Announcement #${req.params.id} not found`
      });
    }

    const updateData = req.body;
    if (!updateData || Object.keys(updateData).length === 0) {
      if (expectsHtml) {
        return res.status(400).send(announcementView.renderEditAnnouncementForm(existing, {
          errorMessage: 'No update data provided.'
        }));
      }
      return res.status(400).json({
        success: false,
        error: 'No update data provided.'
      });
    }

    const updated = announcementModel.update(id, updateData);

    if (expectsHtml) {
      return res.status(200).send(announcementView.renderAnnouncementDetail(updated, {
        successMessage: `Announcement #${id} updated successfully!`
      }));
    }

    return res.status(200).json({
      success: true,
      message: 'Announcement updated successfully',
      announcement: updated
    });
  },

  /**
   * DELETE: POST /announcements/:id/delete, DELETE
   */
  deleteAnnouncement(req, res) {
    const id = Number(req.params.id);
    const deleted = announcementModel.delete(id);
    const expectsHtml = isHtmlRequest(req);

    if (!deleted) {
      if (expectsHtml) {
        return res.status(404).send(announcementView.renderError(`Announcement #${req.params.id} not found.`, 404));
      }
      return res.status(404).json({
        success: false,
        error: `Announcement #${req.params.id} not found`
      });
    }

    if (expectsHtml) {
      return res.status(200).send(announcementView.renderAnnouncementsList(announcementModel.getAll(), {
        successMessage: `Announcement #${id} (${deleted.title}) deleted successfully.`
      }));
    }

    return res.status(200).json({
      success: true,
      message: 'Announcement deleted successfully',
      deletedAnnouncement: deleted,
      totalAnnouncements: announcementModel.count()
    });
  },

  // Aliases
  create(req, res) { return this.createAnnouncement(req, res); },
  getAll(req, res) { return this.getAllAnnouncements(req, res); },
  getById(req, res) { return this.getAnnouncementById(req, res); },
  update(req, res) { return this.updateAnnouncement(req, res); },
  delete(req, res) { return this.deleteAnnouncement(req, res); }
};

module.exports = announcementController;
