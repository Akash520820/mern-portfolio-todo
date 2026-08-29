/**
 * Promote an existing user to admin so they can access the portfolio
 * admin dashboard. Run this AFTER registering normally through the app.
 *
 * Usage:
 *   node scripts/createAdmin.js you@example.com
 */
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const run = async () => {
  const email = process.argv[2];

  if (!email) {
    console.error('Usage: node scripts/createAdmin.js <email>');
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);

    const user = await User.findOneAndUpdate(
      { email: email.toLowerCase().trim() },
      { role: 'admin' },
      { new: true }
    );

    if (!user) {
      console.error(`No user found with email "${email}". Register an account first, then run this script.`);
      process.exit(1);
    }

    console.log(`✓ ${user.email} is now an admin. Log out and back in to pick up the new role.`);
    process.exit(0);
  } catch (error) {
    console.error('Failed to promote user:', error.message);
    process.exit(1);
  }
};

run();
