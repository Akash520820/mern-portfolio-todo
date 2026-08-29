const express = require('express');
const { body } = require('express-validator');
const { getProfile, updateProfile } = require('../controllers/profileController');
const { protect } = require('../middleware/authMiddleware');
const { isAdmin } = require('../middleware/adminMiddleware');

const router = express.Router();

router.get('/', getProfile);

router.put(
  '/',
  protect,
  isAdmin,
  [
    body('email').optional({ checkFalsy: true }).trim().isEmail().withMessage('Must be a valid email'),
    body('bio').optional().trim(),
    body('phone').optional().trim(),
    body('location').optional().trim(),
    body('educationSummary').optional().trim(),
    body('coreAreas').optional().isArray().withMessage('coreAreas must be an array of strings'),
  ],
  updateProfile
);

module.exports = router;
