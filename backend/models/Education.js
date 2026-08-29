const mongoose = require('mongoose');

const educationSchema = new mongoose.Schema(
  {
    degree: {
      type: String,
      required: [true, 'Degree / qualification is required'],
      trim: true,
    },
    school: {
      type: String,
      required: [true, 'School / institution is required'],
      trim: true,
    },
    period: {
      type: String,
      required: [true, 'Period is required'],
      trim: true,
    },
    detail: {
      type: String,
      trim: true,
      default: '',
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Education', educationSchema);
