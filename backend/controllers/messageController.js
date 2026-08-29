const { validationResult } = require('express-validator');
const Message = require('../models/Message');

// @desc    Submit the public contact form
// @route   POST /api/messages
// @access  Public
const createMessage = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, subject, message } = req.body;

  try {
    const doc = await Message.create({ name, email, subject, message });
    // Don't leak the stored document (or a real _id an attacker could probe)
    // back to an anonymous caller — just confirm receipt.
    res.status(201).json({ message: 'Message sent — thanks for reaching out!' });
    void doc; // created for the admin inbox; nothing further to do with it here
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    List contact form submissions, newest first
// @route   GET /api/messages
// @access  Private/Admin
const getMessages = async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Toggle a message's read state
// @route   PATCH /api/messages/:id/read
// @access  Private/Admin
const markMessageRead = async (req, res) => {
  try {
    const msg = await Message.findById(req.params.id);
    if (!msg) {
      return res.status(404).json({ message: 'Message not found' });
    }

    msg.read = typeof req.body.read === 'boolean' ? req.body.read : true;
    await msg.save();

    res.json(msg);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete a message
// @route   DELETE /api/messages/:id
// @access  Private/Admin
const deleteMessage = async (req, res) => {
  try {
    const msg = await Message.findById(req.params.id);
    if (!msg) {
      return res.status(404).json({ message: 'Message not found' });
    }

    await msg.deleteOne();
    res.json({ message: 'Message deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { createMessage, getMessages, markMessageRead, deleteMessage };
