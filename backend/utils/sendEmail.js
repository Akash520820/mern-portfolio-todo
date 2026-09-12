// Resend's transactional email HTTP API (https://resend.com), used instead
// of SMTP because Render's free tier blocks outbound traffic on SMTP ports
// (25, 465, 587) as of Sept 2025 - see https://render.com/changelog/free-web-services-will-no-longer-allow-outbound-traffic-to-smtp-ports
// Resend runs over plain HTTPS (port 443), which is never blocked.
//
// Get a free API key at https://resend.com/api-keys and put it in
// RESEND_API_KEY (backend/.env). Without a verified domain, Resend only
// lets you send from onboarding@resend.dev and only to the email address
// you signed up with - which is exactly this app's single-admin use case,
// so no domain verification is required.
const RESEND_API_URL = 'https://api.resend.com/emails';

// sendEmail({ to, subject, html, text })
const sendEmail = async ({ to, subject, html, text }) => {
  if (!process.env.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY must be set in backend/.env to send emails.');
  }

  const response = await fetch(RESEND_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
      to,
      subject,
      text,
      html,
    }),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => '');
    throw new Error(`Resend API error (${response.status}): ${body}`);
  }
};

module.exports = sendEmail;