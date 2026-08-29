const express = require('express');
const { body } = require('express-validator');
const {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
} = require('../controllers/projectController');
const { protect } = require('../middleware/authMiddleware');
const { isAdmin } = require('../middleware/adminMiddleware');

const router = express.Router();

router.get('/', getProjects);

router.post(
  '/',
  protect,
  isAdmin,
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('tagline').trim().notEmpty().withMessage('Tagline is required'),
    body('bullets').optional().isArray().withMessage('Bullets must be an array'),
    body('tech').optional().isArray().withMessage('Tech must be an array'),
  ],
  createProject
);

router.put('/:id', protect, isAdmin, updateProject);
router.delete('/:id', protect, isAdmin, deleteProject);

module.exports = router;
