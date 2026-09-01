const mongoose = require('mongoose');

const certificationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    issuer: {
      type: String,
      required: [true, 'Issuer is required'],
      trim: true,
    },
    date: {
      type: String, // free-text (e.g. "2024") rather than a strict Date, matching Education's "period" style
      trim: true,
      default: '',
    },
    url: {
      type: String, // optional link to the credential/certificate
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

module.exports = mongoose.model('Certification', certificationSchema);
