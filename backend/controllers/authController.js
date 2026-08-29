const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { validationResult } = require('express-validator');
const User = require('../models/User');

const ACCESS_EXPIRES_IN = process.env.JWT_ACCESS_EXPIRES_IN || '15m';
const REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';
const REFRESH_COOKIE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; // keep in sync with REFRESH_EXPIRES_IN above

const generateAccessToken = (id) =>
  jwt.sign({ id }, process.env.JWT_ACCESS_SECRET, { expiresIn: ACCESS_EXPIRES_IN });

const generateRefreshToken = (id) =>
  jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, { expiresIn: REFRESH_EXPIRES_IN });

// We only ever persist a hash of the refresh token (never the raw value),
// the same way passwords are hashed. If the DB ever leaked, the refresh
// tokens themselves would not be directly usable.
const hashToken = (token) => crypto.createHash('sha256').update(token).digest('hex');

const COOKIE_BASE_OPTIONS = {
  httpOnly: true, // not readable by client-side JS -> protects against XSS token theft
  secure: process.env.NODE_ENV === 'production', // HTTPS only in prod; allows http on localhost dev
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // 'none' needed for cross-site prod (frontend/backend on different domains)
};

const setAuthCookies = (res, accessToken, refreshToken) => {
  res.cookie('accessToken', accessToken, {
    ...COOKIE_BASE_OPTIONS,
    maxAge: 15 * 60 * 1000, // 15 minutes
  });
  res.cookie('refreshToken', refreshToken, {
    ...COOKIE_BASE_OPTIONS,
    maxAge: REFRESH_COOKIE_MAX_AGE_MS,
    path: '/api/auth', // only sent back on auth routes (refresh/logout), reduces exposure
  });
};

const clearAuthCookies = (res) => {
  res.clearCookie('accessToken', COOKIE_BASE_OPTIONS);
  res.clearCookie('refreshToken', { ...COOKIE_BASE_OPTIONS, path: '/api/auth' });
};

// Issues a fresh access+refresh pair, stores the refresh token's hash on the
// user, and sets both as cookies. Shared by register/login/refresh so the
// "logged in" side effects always stay in one place.
const issueTokens = async (user, res) => {
  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  user.refreshTokenHash = hashToken(refreshToken);
  await user.save({ validateBeforeSave: false });

  setAuthCookies(res, accessToken, refreshToken);
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({ name, email, password });
    await issueTokens(user, res);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // This is a single-admin site — no public registration exists, but this
    // check is defense-in-depth in case a non-admin account was ever seeded
    // directly in the database.
    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Only the site admin can log in' });
    }

    await issueTokens(user, res);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Exchange a valid refresh token cookie for a new access token
//          (and rotate the refresh token, so a stolen one only works once)
// @route   POST /api/auth/refresh
// @access  Public (requires refreshToken cookie)
const refreshToken = async (req, res) => {
  const token = req.cookies?.refreshToken;

  if (!token) {
    return res.status(401).json({ message: 'No refresh token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id).select('+refreshTokenHash');

    if (!user || !user.refreshTokenHash || user.refreshTokenHash !== hashToken(token)) {
      // Token is a valid JWT but doesn't match what's on file -> already
      // rotated/logged out elsewhere, or reuse of a stolen token. Reject.
      clearAuthCookies(res);
      return res.status(401).json({ message: 'Refresh token invalid, please log in again' });
    }

    await issueTokens(user, res); // rotates the refresh token too

    res.json({ message: 'Token refreshed' });
  } catch (error) {
    clearAuthCookies(res);
    return res.status(401).json({ message: 'Refresh token expired or invalid, please log in again' });
  }
};

// @desc    Log out: clear cookies and invalidate the stored refresh token
// @route   POST /api/auth/logout
// @access  Private
const logoutUser = async (req, res) => {
  try {
    const token = req.cookies?.refreshToken;
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
        await User.findByIdAndUpdate(decoded.id, { refreshTokenHash: null });
      } catch (_) {
        // Token already invalid/expired - nothing to clean up server-side, still clear cookies below.
      }
    }
  } finally {
    clearAuthCookies(res);
    res.json({ message: 'Logged out' });
  }
};

// @desc    Get current logged-in user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  res.json(req.user);
};

module.exports = { registerUser, loginUser, refreshToken, logoutUser, getMe };
