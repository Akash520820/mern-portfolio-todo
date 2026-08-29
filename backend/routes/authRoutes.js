const express = require('express');
const { body } = require('express-validator');
const { loginUser, refreshToken, logoutUser, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// No public registration route on purpose — this is a single-admin portfolio
// site. The only account is the one created via `npm run create-admin`.
// (See authController.js for the still-exported, but now unrouted,
// registerUser — kept only in case you want an admin-only "invite" flow later.)

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  loginUser
);

router.post('/refresh', refreshToken);
router.post('/logout', logoutUser);
router.get('/me', protect, getMe);

module.exports = router;
