const { validationResult } = require('express-validator');
const Certification = require('../models/Certification');

// @desc    Get all certifications (public)
// @route   GET /api/certifications
// @access  Public
const getCertifications = async (req, res) => {
  try {
    const certs = await Certification.find().sort({ order: 1, createdAt: -1 });
    res.json(certs);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Create a certification
// @route   POST /api/certifications
// @access  Private/Admin
const createCertification = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const cert = await Certification.create(req.body);
    res.status(201).json(cert);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update a certification
// @route   PUT /api/certifications/:id
// @access  Private/Admin
const updateCertification = async (req, res) => {
  try {
    const cert = await Certification.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!cert) {
      return res.status(404).json({ message: 'Certification not found' });
    }

    res.json(cert);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete a certification
// @route   DELETE /api/certifications/:id
// @access  Private/Admin
const deleteCertification = async (req, res) => {
  try {
    const cert = await Certification.findByIdAndDelete(req.params.id);

    if (!cert) {
      return res.status(404).json({ message: 'Certification not found' });
    }

    res.json({ message: 'Certification removed', id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getCertifications, createCertification, updateCertification, deleteCertification };
