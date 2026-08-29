const express = require('express');
const { body } = require('express-validator');
const {
  getEducation,
  createEducation,
  updateEducation,
  deleteEducation,
} = require('../controllers/educationController');
const { protect } = require('../middleware/authMiddleware');
const { isAdmin } = require('../middleware/adminMiddleware');

const router = express.Router();

router.get('/', getEducation);

router.post(
  '/',
  protect,
  isAdmin,
  [
    body('degree').trim().notEmpty().withMessage('Degree is required'),
    body('school').trim().notEmpty().withMessage('School is required'),
    body('period').trim().notEmpty().withMessage('Period is required'),
  ],
  createEducation
);

router.put('/:id', protect, isAdmin, updateEducation);
router.delete('/:id', protect, isAdmin, deleteEducation);

module.exports = router;
