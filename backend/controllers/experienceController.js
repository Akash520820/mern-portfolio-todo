const { validationResult } = require('express-validator');
const Experience = require('../models/Experience');

// @desc    Get all experience entries (public)
// @route   GET /api/experience
// @access  Public
const getExperience = async (req, res) => {
  try {
    const entries = await Experience.find().sort({ order: 1, createdAt: -1 });
    res.json(entries);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Create an experience entry
// @route   POST /api/experience
// @access  Private/Admin
const createExperience = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const entry = await Experience.create(req.body);
    res.status(201).json(entry);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update an experience entry
// @route   PUT /api/experience/:id
// @access  Private/Admin
const updateExperience = async (req, res) => {
  try {
    const entry = await Experience.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!entry) {
      return res.status(404).json({ message: 'Experience entry not found' });
    }

    res.json(entry);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete an experience entry
// @route   DELETE /api/experience/:id
// @access  Private/Admin
const deleteExperience = async (req, res) => {
  try {
    const entry = await Experience.findByIdAndDelete(req.params.id);

    if (!entry) {
      return res.status(404).json({ message: 'Experience entry not found' });
    }

    res.json({ message: 'Experience entry removed', id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getExperience, createExperience, updateExperience, deleteExperience };
