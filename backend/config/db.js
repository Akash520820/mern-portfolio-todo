const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    // Deliberately NOT process.exit(1) here. This used to kill the whole
    // Node process a few seconds after boot whenever Mongo was slow,
    // misconfigured, or briefly unreachable — taking every route down
    // with it, including /api/health. A health/liveness check that dies
    // along with the thing it's supposed to report on is pointless: it
    // should keep answering so uptime pings and Render can tell "server
    // process is fine, DB is the problem" apart from "everything is down".
    console.error(`MongoDB connection error: ${error.message}`);
  }
};

module.exports = connectDB;