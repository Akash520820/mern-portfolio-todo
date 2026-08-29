const { validationResult } = require('express-validator');
const Goal = require('../models/Goal');
const Project = require('../models/Project');

// @desc    Get all goals (public)
// @route   GET /api/goals
// @access  Public
const getGoals = async (req, res) => {
  try {
    const goals = await Goal.find().sort({ order: 1, createdAt: -1 });
    res.json(goals);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Create a goal
// @route   POST /api/goals
// @access  Private/Admin
const createGoal = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const goal = await Goal.create(req.body);
    res.status(201).json(goal);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update a goal
// @route   PUT /api/goals/:id
// @access  Private/Admin
const updateGoal = async (req, res) => {
  try {
    const goal = await Goal.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    res.json(goal);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete a goal
// @route   DELETE /api/goals/:id
// @access  Private/Admin
const deleteGoal = async (req, res) => {
  try {
    const goal = await Goal.findByIdAndDelete(req.params.id);

    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    res.json({ message: 'Goal removed', id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Mark a goal as shipped: creates a Project entry from it (with the
//          live URL you deployed to) and removes the goal from "What's Next",
//          since it's no longer upcoming — it's live.
// @route   POST /api/goals/:id/complete
// @access  Private/Admin
const completeGoal = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { url, tagline, tech, bullets, accentColor } = req.body;

  try {
    const goal = await Goal.findById(req.params.id);

    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    const project = await Project.create({
      title: goal.title,
      tagline: tagline?.trim() || goal.description || goal.title,
      url,
      tech: Array.isArray(tech) ? tech : [],
      bullets: Array.isArray(bullets) ? bullets : [],
      ...(accentColor ? { accentColor } : {}),
    });

    await goal.deleteOne();

    res.status(201).json({ message: 'Goal shipped — project created', project, goalId: req.params.id });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getGoals, createGoal, updateGoal, deleteGoal, completeGoal };
