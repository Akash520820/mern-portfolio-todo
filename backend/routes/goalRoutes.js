const express = require('express');
const { body } = require('express-validator');
const { getGoals, createGoal, updateGoal, deleteGoal, completeGoal } = require('../controllers/goalController');
const { protect } = require('../middleware/authMiddleware');
const { isAdmin } = require('../middleware/adminMiddleware');

const router = express.Router();

router.get('/', getGoals);

router.post(
  '/',
  protect,
  isAdmin,
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('status').optional().isIn(['planned', 'in-progress', 'done']),
  ],
  createGoal
);

router.put('/:id', protect, isAdmin, updateGoal);
router.delete('/:id', protect, isAdmin, deleteGoal);

router.post(
  '/:id/complete',
  protect,
  isAdmin,
  [body('url').trim().notEmpty().withMessage('Live URL is required to publish this as a project')],
  completeGoal
);

module.exports = router;
