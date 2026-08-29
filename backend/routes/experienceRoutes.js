const express = require('express');
const { body } = require('express-validator');
const {
  getExperience,
  createExperience,
  updateExperience,
  deleteExperience,
} = require('../controllers/experienceController');
const { protect } = require('../middleware/authMiddleware');
const { isAdmin } = require('../middleware/adminMiddleware');

const router = express.Router();

router.get('/', getExperience);

router.post(
  '/',
  protect,
  isAdmin,
  [
    body('role').trim().notEmpty().withMessage('Role is required'),
    body('organization').trim().notEmpty().withMessage('Organization is required'),
    body('period').trim().notEmpty().withMessage('Period is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
  ],
  createExperience
);

router.put('/:id', protect, isAdmin, updateExperience);
router.delete('/:id', protect, isAdmin, deleteExperience);

module.exports = router;
