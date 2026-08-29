const { validationResult } = require('express-validator');
const Education = require('../models/Education');

// @desc    Get all education entries (public)
// @route   GET /api/education
// @access  Public
const getEducation = async (req, res) => {
  try {
    const entries = await Education.find().sort({ order: 1, createdAt: -1 });
    res.json(entries);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Create an education entry
// @route   POST /api/education
// @access  Private/Admin
const createEducation = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const entry = await Education.create(req.body);
    res.status(201).json(entry);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update an education entry
// @route   PUT /api/education/:id
// @access  Private/Admin
const updateEducation = async (req, res) => {
  try {
    const entry = await Education.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!entry) {
      return res.status(404).json({ message: 'Education entry not found' });
    }

    res.json(entry);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete an education entry
// @route   DELETE /api/education/:id
// @access  Private/Admin
const deleteEducation = async (req, res) => {
  try {
    const entry = await Education.findByIdAndDelete(req.params.id);

    if (!entry) {
      return res.status(404).json({ message: 'Education entry not found' });
    }

    res.json({ message: 'Education entry removed', id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getEducation, createEducation, updateEducation, deleteEducation };
