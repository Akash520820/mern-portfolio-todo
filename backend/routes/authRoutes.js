const express = require('express');
const { body } = require('express-validator');
const rateLimit = require('express-rate-limit');
const {
  loginUser,
  refreshToken,
  logoutUser,
  getMe,
  forgotPassword,
  resetPassword,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Tighter than the app-wide /api/auth limiter (20/15min) — this endpoint
// sends an email and is the one most worth throttling hard, since it's the
// public entry point into the reset flow.
const forgotPasswordLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  message: { message: 'Too many password reset requests, please try again later.' },
});

// Guards against brute-forcing the 6-digit OTP (1 in a million per guess).
// Combined with the 10-minute OTP expiry, this keeps the practical guessing
// window tiny even though it's a numeric-only code.
const resetPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: { message: 'Too many attempts, please try again later.' },
});

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

router.post(
  '/forgot-password',
  forgotPasswordLimiter,
  [body('email').isEmail().withMessage('Valid email is required').normalizeEmail()],
  forgotPassword
);

router.post(
  '/reset-password',
  resetPasswordLimiter,
  [
    body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
    body('otp').matches(/^\d{6}$/).withMessage('OTP must be a 6-digit code'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  resetPassword
);

module.exports = router;