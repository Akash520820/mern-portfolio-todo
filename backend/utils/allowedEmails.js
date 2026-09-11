// Solo-project gatekeeper: only the email(s) listed in ALLOWED_EMAILS may
// log in or request a password reset. This is a *second* layer on top of
// the existing `role === 'admin'` check in authController — even if extra
// accounts ever end up in the database, only these addresses can use them.
//
// Set ALLOWED_EMAILS in your .env as a comma-separated list, e.g.:
//   ALLOWED_EMAILS=you@example.com,partner@example.com
//
// If ALLOWED_EMAILS is not set at all, the check is skipped (fail-open) so
// you don't accidentally lock yourself out of a fresh deployment — but you
// should set it. A warning is logged once on startup if it's missing.
const getAllowedEmails = () => {
  const raw = process.env.ALLOWED_EMAILS || '';
  return raw
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
};

const isEmailAllowed = (email) => {
  const allowed = getAllowedEmails();
  if (allowed.length === 0) return true; // fail-open, see note above
  return allowed.includes(String(email).trim().toLowerCase());
};

if (!process.env.ALLOWED_EMAILS) {
  console.warn(
    '[allowedEmails] ALLOWED_EMAILS is not set — login and password reset are NOT restricted to specific emails. Add ALLOWED_EMAILS=you@example.com to backend/.env.'
  );
}

module.exports = { isEmailAllowed, getAllowedEmails };
