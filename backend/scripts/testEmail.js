// One-off diagnostic script: sends a real test email using your current
// backend/.env settings (Resend) and prints the FULL error if it fails
// (unlike the app's forgotPassword flow, which intentionally hides email
// errors from the client for security reasons).
//
// Run from the backend folder:
//   node scripts/testEmail.js
require('dotenv').config();
const sendEmail = require('../utils/sendEmail');

(async () => {
  const testRecipient = process.argv[2] || process.env.ALLOWED_EMAILS?.split(',')[0]?.trim();

  console.log('RESEND_API_KEY set:', Boolean(process.env.RESEND_API_KEY));
  console.log('EMAIL_FROM:', process.env.EMAIL_FROM);
  console.log('Sending test email to', testRecipient, '...');
  if (!testRecipient) {
    console.error('No recipient found. Pass one: node scripts/testEmail.js you@example.com');
    return;
  }

  try {
    await sendEmail({
      to: testRecipient,
      subject: 'Test email from testEmail.js',
      text: 'If you got this, your Resend settings work.',
      html: '<p>If you got this, your Resend settings work.</p>',
    });
    console.log('SUCCESS: email sent. Check your inbox (and spam folder).');
  } catch (err) {
    console.error('FAILED. Full error below:');
    console.error(err);
  }
})();