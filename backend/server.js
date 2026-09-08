require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');

const connectDB = require('./config/db');
const healthRoutes = require('./routes/healthRoutes');
const startKeepAlive = require('./utils/keepAlive');
const authRoutes = require('./routes/authRoutes');
const todoRoutes = require('./routes/todoRoutes');
const projectRoutes = require('./routes/projectRoutes');
const experienceRoutes = require('./routes/experienceRoutes');
const goalRoutes = require('./routes/goalRoutes');
const messageRoutes = require('./routes/messageRoutes');
const profileRoutes = require('./routes/profileRoutes');
const educationRoutes = require('./routes/educationRoutes');
const certificationRoutes = require('./routes/certificationRoutes');

const app = express();

// Render (and most PaaS hosts) put the app behind one reverse-proxy hop and
// add an X-Forwarded-For header on every request. express-rate-limit v7
// refuses to trust that header by default (to stop IP-spoofing bypassing
// rate limits) and throws ERR_ERL_UNEXPECTED_X_FORWARDED_FOR until the
// trusted proxy count is set explicitly.
app.set('trust proxy', 1);

// Connect to MongoDB
connectDB();

// Health check mounted first, before any other middleware. It never touches
// the DB and must never be caught behind CORS, helmet, rate limiting, or
// mongoSanitize — those exist to protect the real API surface, not a
// liveness probe. This is what let it silently break before: it was
// declared inline down near the bottom, after CORS was locked to
// CLIENT_URL and after the rate limiters, so anything hitting it from an
// origin/tool that CORS didn't recognise, or that had already used up the
// shared /api/ rate-limit bucket, wouldn't get a clean 200.
app.use('/api/health', healthRoutes);

// --- Security middleware ---
app.use(helmet()); // secure HTTP headers

app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);

app.use(express.json({ limit: '10kb' })); // body parser, capped payload size
app.use(cookieParser()); // parses cookies into req.cookies (needed to read accessToken/refreshToken)

app.use(mongoSanitize()); // strips $ and . from req.body/query/params to block NoSQL injection

// Rate limiting on auth routes (brute-force protection)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  message: { message: 'Too many attempts, please try again later.' },
});
app.use('/api/auth', authLimiter);

// General rate limit for the rest of the API
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
});
app.use('/api/', apiLimiter);

// Force HTTPS in production (no-op on platforms like Render/Vercel that already terminate TLS,
// but useful if you self-host behind a proxy that sets x-forwarded-proto)
app.use((req, res, next) => {
  if (
    process.env.NODE_ENV === 'production' &&
    req.headers['x-forwarded-proto'] &&
    req.headers['x-forwarded-proto'] !== 'https'
  ) {
    return res.redirect(`https://${req.headers.host}${req.url}`);
  }
  next();
});

// --- Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/todos', todoRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/experience', experienceRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/education', educationRoutes);
app.use('/api/certifications', certificationRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  startKeepAlive();
});