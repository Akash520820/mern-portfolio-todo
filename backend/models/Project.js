const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    tagline: {
      type: String,
      required: [true, 'Tagline is required'],
      trim: true,
    },
    bullets: {
      type: [String],
      default: [],
    },
    tech: {
      type: [String],
      default: [],
    },
    url: {
      type: String,
      trim: true,
      default: '',
    },
    accentColor: {
      type: String,
      trim: true,
      default: 'linear-gradient(135deg, #4f7dff, #2fe0c4)',
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Project', projectSchema);
