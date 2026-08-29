const express = require('express');
const { body } = require('express-validator');
const {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
} = require('../controllers/todoController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect); // every route below requires a valid JWT

router.get('/', getTodos);

router.post(
  '/',
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('priority').optional().isIn(['low', 'medium', 'high']),
  ],
  createTodo
);

router.put('/:id', updateTodo);
router.delete('/:id', deleteTodo);

module.exports = router;
