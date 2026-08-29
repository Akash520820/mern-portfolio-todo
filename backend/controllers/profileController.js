const { validationResult } = require('express-validator');
const Profile = require('../models/Profile');

// @desc    Get the site's profile info (bio, contact details, core areas)
// @route   GET /api/profile
// @access  Public
const getProfile = async (req, res) => {
  try {
    let profile = await Profile.findById(Profile.SINGLETON_ID);
    if (!profile) {
      // First run: nothing set yet. Return sensible empty defaults instead
      // of a 404 so the frontend can render placeholder text.
      profile = await Profile.create({ _id: Profile.SINGLETON_ID });
    }
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update the site's profile info
// @route   PUT /api/profile
// @access  Private/Admin
const updateProfile = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { bio, email, phone, location, educationSummary, coreAreas } = req.body;

  try {
    const profile = await Profile.findByIdAndUpdate(
      Profile.SINGLETON_ID,
      {
        bio,
        email,
        phone,
        location,
        educationSummary,
        coreAreas: Array.isArray(coreAreas) ? coreAreas : [],
      },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    );

    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getProfile, updateProfile };
