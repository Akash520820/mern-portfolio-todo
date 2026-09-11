const nodemailer = require('nodemailer');

// Gmail SMTP via an App Password (NOT your normal Gmail password).
// Requires 2-Step Verification enabled on the Google account, then create
// an App Password at https://myaccount.google.com/apppasswords and put it
// in EMAIL_APP_PASSWORD (backend/.env). EMAIL_USER is the full gmail.com
// address that password belongs to.
let transporter = null;

const getTransporter = () => {
  if (transporter) return transporter;

  if (!process.env.EMAIL_USER || !process.env.EMAIL_APP_PASSWORD) {
    throw new Error(
      'EMAIL_USER and EMAIL_APP_PASSWORD must be set in backend/.env to send emails (Gmail App Password).'
    );
  }

  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
  });

  return transporter;
};

// sendEmail({ to, subject, html, text })
const sendEmail = async ({ to, subject, html, text }) => {
  const mailer = getTransporter();

  await mailer.sendMail({
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to,
    subject,
    text,
    html,
  });
};

module.exports = sendEmail;
