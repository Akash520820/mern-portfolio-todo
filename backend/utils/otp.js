const crypto = require('crypto');

// 6-digit numeric OTP. Returns both the raw code (emailed to the user) and
// its SHA-256 hash (the only thing ever stored in the DB) - same
// "never store the raw value" pattern used for refresh tokens.
const generateOtp = () => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');
  return { otp, hashedOtp };
};

module.exports = { generateOtp };
