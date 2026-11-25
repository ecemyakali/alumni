/**
 * Profile Controller
 * File: src/controllers/profileController.js
 * 
 * Manages authenticated user profile views, self-service updates,
 * networking/mentorship preferences, and password changes:
 * - GET  /profile, /dashboard     -> Renders user profile dashboard
 * - POST /profile/update          -> Updates personal & career information
 * - POST /profile/preferences     -> Updates networking & mentorship toggles
 * - POST /profile/password        -> Updates user account password
 * - GET  /api/profile             -> RESTful API profile details
 * - PUT  /api/profile             -> RESTful API profile update
 * - PUT  /api/profile/password    -> RESTful API password change
 */

const userModel = require('../models/userModel');
const authUtils = require('../utils/authUtils');
const profileView = require('../views/profileView');

const profileController = {
  /**
   * GET /profile, GET /dashboard
   * Renders the authenticated user profile dashboard
   */
  renderProfile(req, res) {
    if (!req.user) {
      return res.redirect(302, '/login?redirect=%2Fprofile');
    }

    // Refresh user data from model
    const user = userModel.findById(req.user.id) || req.user;
    const successMessage = (req.query && req.query.success) || '';
    const errorMessage = (req.query && req.query.error) || '';

    return res.status(200).send(profileView.renderProfilePage({
      currentUser: user,
      successMessage,
      errorMessage
    }));
  },

  /**
   * POST /profile/update
   * Handles user self-service personal & professional updates
   */
  handleUpdateProfile(req, res) {
    if (!req.user) {
      return res.redirect(302, '/login');
    }

    const {
      name,
      email,
      department,
      graduationYear,
      company,
      currentRole,
      location,
      linkedinUrl,
      bio
    } = req.body || {};

    if (!name || !email) {
      return res.status(400).send(profileView.renderProfilePage({
        currentUser: { ...req.user, ...req.body },
        errorMessage: 'Full Name and Email Address are required fields.'
      }));
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check email uniqueness if changing email
    if (cleanEmail !== (req.user.email || '').toLowerCase()) {
      const existing = userModel.findByEmail(cleanEmail);
      if (existing && Number(existing.id) !== Number(req.user.id)) {
        return res.status(409).send(profileView.renderProfilePage({
          currentUser: { ...req.user, ...req.body },
          errorMessage: `The email address "${cleanEmail}" is already associated with another account.`
        }));
      }
    }

    const updateData = {
      name: name.trim(),
      email: cleanEmail,
      department: (department || '').trim(),
      graduationYear: graduationYear ? Number(graduationYear) : req.user.graduationYear,
      company: (company || '').trim(),
      currentRole: (currentRole || '').trim(),
      location: (location || '').trim(),
      linkedinUrl: (linkedinUrl || '').trim(),
      bio: (bio || '').trim()
    };

    const updatedUser = userModel.update(req.user.id, updateData);
    if (req.user) {
      Object.assign(req.user, updatedUser);
    }

    return res.redirect(302, `/profile?success=${encodeURIComponent('Profile details updated successfully!')}`);
  },

  /**
   * POST /profile/preferences
   * Handles updates to networking, mentorship, and privacy preferences
   */
  handleUpdatePreferences(req, res) {
    if (!req.user) {
      return res.redirect(302, '/login');
    }

    const {
      openToMentor,
      openToWork,
      profileVisibility,
      preferredContact
    } = req.body || {};

    const preferencesData = {
      openToMentor: openToMentor === 'true' || openToMentor === true || openToMentor === 'on',
      openToWork: openToWork === 'true' || openToWork === true || openToWork === 'on',
      profileVisibility: ['public', 'alumni_only', 'private'].includes(profileVisibility) ? profileVisibility : 'public',
      preferredContact: ['email', 'linkedin', 'platform'].includes(preferredContact) ? preferredContact : 'email'
    };

    const updatedUser = userModel.update(req.user.id, preferencesData);
    if (req.user) {
      Object.assign(req.user, updatedUser);
    }

    return res.redirect(302, `/profile?success=${encodeURIComponent('Networking & mentorship preferences updated successfully!')}`);
  },

  /**
   * POST /profile/password
   * Handles user password change
   */
  handleChangePassword(req, res) {
    if (!req.user) {
      return res.redirect(302, '/login');
    }

    const { currentPassword, newPassword, confirmPassword } = req.body || {};

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).send(profileView.renderProfilePage({
        currentUser: req.user,
        errorMessage: 'All password fields are required.'
      }));
    }

    if (newPassword.length < 8) {
      return res.status(400).send(profileView.renderProfilePage({
        currentUser: req.user,
        errorMessage: 'New password must be at least 8 characters long.'
      }));
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).send(profileView.renderProfilePage({
        currentUser: req.user,
        errorMessage: 'New password and confirmation password do not match.'
      }));
    }

    // Verify current password if user has passwordHash
    const freshUser = userModel.findById(req.user.id);
    if (freshUser && freshUser.passwordHash) {
      const isMatch = authUtils.comparePassword(currentPassword, freshUser.passwordHash);
      if (!isMatch) {
        return res.status(401).send(profileView.renderProfilePage({
          currentUser: req.user,
          errorMessage: 'Incorrect current password. Please try again.'
        }));
      }
    }

    const newHash = authUtils.hashPassword(newPassword);
    userModel.update(req.user.id, { passwordHash: newHash });

    return res.redirect(302, `/profile?success=${encodeURIComponent('Account password updated successfully!')}`);
  },

  /**
   * GET /api/profile
   * RESTful API endpoint returning current user profile
   */
  apiGetProfile(req, res) {
    const freshUser = userModel.findById(req.user.id) || req.user;
    return res.status(200).json({
      success: true,
      data: userModel.sanitize(freshUser)
    });
  },

  /**
   * PUT /api/profile
   * RESTful API endpoint updating current user profile
   */
  apiUpdateProfile(req, res) {
    const {
      name,
      email,
      department,
      graduationYear,
      company,
      currentRole,
      location,
      linkedinUrl,
      bio,
      openToMentor,
      openToWork,
      profileVisibility,
      preferredContact
    } = req.body || {};

    const cleanEmail = email ? email.trim().toLowerCase() : undefined;
    if (cleanEmail && cleanEmail !== (req.user.email || '').toLowerCase()) {
      const existing = userModel.findByEmail(cleanEmail);
      if (existing && Number(existing.id) !== Number(req.user.id)) {
        return res.status(409).json({
          success: false,
          error: `The email address "${cleanEmail}" is already associated with another account.`
        });
      }
    }

    const updateData = {};
    if (name !== undefined) updateData.name = name.trim();
    if (cleanEmail !== undefined) updateData.email = cleanEmail;
    if (department !== undefined) updateData.department = department.trim();
    if (graduationYear !== undefined) updateData.graduationYear = Number(graduationYear);
    if (company !== undefined) updateData.company = company.trim();
    if (currentRole !== undefined) updateData.currentRole = currentRole.trim();
    if (location !== undefined) updateData.location = location.trim();
    if (linkedinUrl !== undefined) updateData.linkedinUrl = linkedinUrl.trim();
    if (bio !== undefined) updateData.bio = bio.trim();
    if (openToMentor !== undefined) updateData.openToMentor = Boolean(openToMentor);
    if (openToWork !== undefined) updateData.openToWork = Boolean(openToWork);
    if (profileVisibility !== undefined) updateData.profileVisibility = profileVisibility;
    if (preferredContact !== undefined) updateData.preferredContact = preferredContact;

    const updatedUser = userModel.update(req.user.id, updateData);
    if (req.user) {
      Object.assign(req.user, updatedUser);
    }

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      data: userModel.sanitize(updatedUser)
    });
  },

  /**
   * PUT /api/profile/password
   * RESTful API endpoint changing current user password
   */
  apiChangePassword(req, res) {
    const { currentPassword, newPassword, confirmPassword } = req.body || {};

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        error: 'Both "currentPassword" and "newPassword" are required.'
      });
    }

    if (confirmPassword !== undefined && newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        error: 'New password and confirmation password do not match.'
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        error: 'New password must be at least 8 characters long.'
      });
    }

    const freshUser = userModel.findById(req.user.id);
    if (freshUser && freshUser.passwordHash) {
      const isMatch = authUtils.comparePassword(currentPassword, freshUser.passwordHash);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          error: 'Current password is incorrect.'
        });
      }
    }

    const newHash = authUtils.hashPassword(newPassword);
    userModel.update(req.user.id, { passwordHash: newHash });

    return res.status(200).json({
      success: true,
      message: 'Account password updated successfully.'
    });
  }
};

module.exports = profileController;
