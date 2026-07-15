const express = require('express');
const router = express.Router();
const { protect, isAdmin } = require('../middleware/auth');
const {
  createAppointment,
  getMyAppointments,
  cancelMyAppointment,
  getAllAppointments,
  updateAppointmentStatus,
} = require('../controllers/appointmentController');

// Patient routes — must be logged in
router.post('/', protect, createAppointment);
router.get('/my', protect, getMyAppointments);
router.patch('/:id/cancel', protect, cancelMyAppointment);

// Admin routes — must be logged in AND admin
router.get('/admin/all', protect, isAdmin, getAllAppointments);
router.patch('/admin/:id/status', protect, isAdmin, updateAppointmentStatus);

module.exports = router;
