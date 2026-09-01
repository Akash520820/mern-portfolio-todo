/**
 * Create the site's admin account directly in the database.
 *
 * This is the ONLY way to create an account on this app — there is no
 * public registration route (removed intentionally: this is a
 * single-admin portfolio site, not a multi-user app).
 *
 * Usage (run from the backend/ folder):
 *   npm run create-admin
 * or directly:
 *   node scripts/createAdmin.js
 *
 * It will prompt you for a name, email, and password, then create a user
 * with role: 'admin' directly — no separate "promote" step needed.
 *
 * IMPORTANT: point this at whichever database you want the admin account
 * created in. If you want to log into your LIVE deployed site, your local
 * backend/.env's MONGO_URI must be the SAME connection string you set in
 * Render's environment variables (i.e. the same Atlas cluster/database),
 * not a different local database.
 */
require('dotenv').config();
const readline = require('readline');
const mongoose = require('mongoose');
const User = require('../models/User');

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const ask = (question) => new Promise((resolve) => rl.question(question, resolve));

// Basic hidden-input password prompt (avoids echoing the password to the
// terminal in plain text as you type).
const askHidden = (question) =>
  new Promise((resolve) => {
    process.stdout.write(question);
    const stdin = process.stdin;
    stdin.resume();
    stdin.setRawMode(true);
    let input = '';
    const onData = (char) => {
      char = char.toString('utf8');
      if (char === '\n' || char === '\r' || char === '\u0004') {
        stdin.setRawMode(false);
        stdin.pause();
        stdin.removeListener('data', onData);
        process.stdout.write('\n');
        resolve(input);
      } else if (char === '\u0003') {
        process.exit(1); // Ctrl+C
      } else if (char === '\u007f' || char === '\b') {
        input = input.slice(0, -1); // backspace
      } else {
        input += char;
      }
    };
    stdin.on('data', onData);
  });

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const name = (await ask('Admin name: ')).trim();
    const email = (await ask('Admin email: ')).trim().toLowerCase();
    const password = await askHidden('Admin password (min 6 chars): ');
    rl.close();

    if (!name || !email || !password) {
      console.error('Name, email, and password are all required.');
      process.exit(1);
    }

    const existing = await User.findOne({ email });
    if (existing) {
      // Account already exists — just make sure it's an admin rather than
      // erroring out, so re-running this script is safe.
      existing.role = 'admin';
      await existing.save();
      console.log(`✓ ${existing.email} already existed — confirmed as admin.`);
      process.exit(0);
    }

    const user = await User.create({ name, email, password, role: 'admin' });
    console.log(`✓ Admin account created: ${user.email}`);
    console.log('You can now log in with this email and password on your live site.');
    process.exit(0);
  } catch (error) {
    console.error('Failed to create admin:', error.message);
    process.exit(1);
  }
};

run();