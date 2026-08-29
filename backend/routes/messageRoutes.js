const express = require('express');
const { body } = require('express-validator');
const rateLimit = require('express-rate-limit');
const {
  createMessage,
  getMessages,
  markMessageRead,
  deleteMessage,
} = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');
const { isAdmin } = require('../middleware/adminMiddleware');

const router = express.Router();

// The contact form is public, so it's the one write endpoint in this app an
// anonymous stranger can hit repeatedly — keep it tighter than the app-wide
// limiter in server.js.
const contactFormLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  message: { message: 'Too many messages sent, please try again later.' },
});

router.post(
  '/',
  contactFormLimiter,
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').trim().isEmail().withMessage('A valid email is required').normalizeEmail(),
    body('subject').optional().trim(),
    body('message').trim().notEmpty().withMessage('Message is required'),
  ],
  createMessage
);

router.get('/', protect, isAdmin, getMessages);
router.patch('/:id/read', protect, isAdmin, markMessageRead);
router.delete('/:id', protect, isAdmin, deleteMessage);

module.exports = router;
