/**
 * ========================================================
 * Controller Layer: API Announcement Controller
 * File: src/controllers/apiAnnouncementController.js
 * ========================================================
 * 
 * Homework: RESTful API Controller for Announcement resources.
 * Returns standardized JSON representations with semantic HTTP status codes.
 * Endpoints: .../api/announcements
 */

const announcementModel = require('../models/announcementModel');

const apiAnnouncementController = {
  /**
   * CREATE: POST /api/announcements
   */
  createAnnouncement(req, res) {
    const data = req.body;

    if (!data || !data.title || !data.content) {
      return res.status(400).json({
        success: false,
        error: 'Title and content are required fields for creating an announcement.'
      });
    }

    const newAnnouncement = announcementModel.create(data);

    return res.status(201).json({
      success: true,
      message: 'Announcement published successfully',
      announcement: newAnnouncement,
      totalAnnouncements: announcementModel.count()
    });
  },

  /**
   * READ (All): GET /api/announcements
   */
  getAllAnnouncements(req, res) {
    const announcements = announcementModel.getAll();
    return res.status(200).json({
      success: true,
      count: announcements.length,
      data: announcements
    });
  },

  /**
   * READ (By ID): GET /api/announcements/:id
   */
  getAnnouncementById(req, res) {
    const id = Number(req.params.id);
    const item = announcementModel.getById(id);

    if (!item) {
      return res.status(404).json({
        success: false,
        error: `Announcement with id ${req.params.id} not found`
      });
    }

    return res.status(200).json({
      success: true,
      data: item
    });
  },

  /**
   * UPDATE: PUT /api/announcements/:id or PATCH /api/announcements/:id
   */
  updateAnnouncement(req, res) {
    const id = Number(req.params.id);
    const existing = announcementModel.getById(id);

    if (!existing) {
      return res.status(404).json({
        success: false,
        error: `Announcement with id ${req.params.id} not found`
      });
    }

    const updateData = req.body;
    if (!updateData || Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No update data provided.'
      });
    }

    const updated = announcementModel.update(id, updateData);

    return res.status(200).json({
      success: true,
      message: 'Announcement updated successfully',
      announcement: updated
    });
  },

  /**
   * DELETE: DELETE /api/announcements/:id
   */
  deleteAnnouncement(req, res) {
    const id = Number(req.params.id);
    const deleted = announcementModel.delete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: `Announcement with id ${req.params.id} not found`
      });
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

module.exports = apiAnnouncementController;
