const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Reads the access token from the httpOnly cookie set at login/refresh.
// Falls back to an `Authorization: Bearer` header so the same middleware
// still works for non-browser clients (Postman, mobile apps, etc.) that
// can't rely on cookies.
const getTokenFromRequest = (req) => {
  if (req.cookies && req.cookies.accessToken) {
    return req.cookies.accessToken;
  }

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    return req.headers.authorization.split(' ')[1];
  }

  return null;
};

const protect = async (req, res, next) => {
  const token = getTokenFromRequest(req);

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      return res.status(401).json({ message: 'User not found' });
    }

    return next();
  } catch (error) {
    // Covers expired AND malformed/invalid tokens.
    // The frontend's axios interceptor listens for this exact message to
    // know when it should call /api/auth/refresh instead of just logging out.
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Access token expired' });
    }
    return res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

module.exports = { protect };
