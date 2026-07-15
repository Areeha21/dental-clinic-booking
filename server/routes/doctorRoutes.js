const express = require('express');
const router = express.Router();
const { protect, isAdmin } = require('../middleware/auth');
const {
  getDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor,
} = require('../controllers/doctorController');

router.get('/', getDoctors);
router.get('/:id', getDoctorById);

router.post('/', protect, isAdmin, createDoctor);
router.put('/:id', protect, isAdmin, updateDoctor);
router.delete('/:id', protect, isAdmin, deleteDoctor);

module.exports = router;
