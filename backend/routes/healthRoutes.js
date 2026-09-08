const express = require('express');

const router = express.Router();

// Lightweight liveness check — no DB call, just confirms the process is alive.
// Mounted first in server.js, ahead of helmet/cors/rate-limit/mongoSanitize
// and completely independent of MongoDB, so it keeps answering even if the
// DB connection is slow, down, or misconfigured. Used by the GitHub Actions
// keep-alive workflow, Render's health check, and the Docker HEALTHCHECK.
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;