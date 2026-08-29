const mongoose = require('mongoose');

// Singleton — there is only ever one Profile document (enforced in the
// controller, which always upserts the same fixed _id below) rather than
// one per user, since this is a one-person portfolio site.
const SINGLETON_ID = '000000000000000000000001';

const profileSchema = new mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      default: SINGLETON_ID,
    },
    bio: {
      type: String,
      trim: true,
      default: '',
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: '',
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    location: {
      type: String,
      trim: true,
      default: '',
    },
    // Short one-line summary shown in the About "meta" list, e.g. "B.Tech in Computer Science"
    educationSummary: {
      type: String,
      trim: true,
      default: '',
    },
    coreAreas: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

profileSchema.statics.SINGLETON_ID = SINGLETON_ID;

module.exports = mongoose.model('Profile', profileSchema);
