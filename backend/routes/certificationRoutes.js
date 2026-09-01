const express = require('express');
const { body } = require('express-validator');
const {
  getCertifications,
  createCertification,
  updateCertification,
  deleteCertification,
} = require('../controllers/certificationController');
const { protect } = require('../middleware/authMiddleware');
const { isAdmin } = require('../middleware/adminMiddleware');

const router = express.Router();

router.get('/', getCertifications);

router.post(
  '/',
  protect,
  isAdmin,
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('issuer').trim().notEmpty().withMessage('Issuer is required'),
  ],
  createCertification
);

router.put('/:id', protect, isAdmin, updateCertification);
router.delete('/:id', protect, isAdmin, deleteCertification);

module.exports = router;
