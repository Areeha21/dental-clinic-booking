const Doctor = require('../models/Doctor');

// GET /api/doctors — public
const getDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find({ status: 'active' });
    res.status(200).json({ success: true, message: 'Doctors fetched', data: doctors });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch doctors', data: { error: error.message } });
  }
};

// GET /api/doctors/:id — public
const getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found', data: {} });
    }
    res.status(200).json({ success: true, message: 'Doctor fetched', data: doctor });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch doctor', data: { error: error.message } });
  }
};

// POST /api/doctors — admin only
const createDoctor = async (req, res) => {
  try {
    const { name, specialization, bio, profileImage, availableDays, workingHours } = req.body;
    if (!name || !specialization) {
      return res.status(400).json({ success: false, message: 'Name and specialization are required', data: {} });
    }
    const doctor = await Doctor.create({ name, specialization, bio, profileImage, availableDays, workingHours });
    res.status(201).json({ success: true, message: 'Doctor created', data: doctor });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create doctor', data: { error: error.message } });
  }
};

// PUT /api/doctors/:id — admin only
const updateDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found', data: {} });
    }
    res.status(200).json({ success: true, message: 'Doctor updated', data: doctor });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update doctor', data: { error: error.message } });
  }
};

// DELETE /api/doctors/:id — admin only, soft-delete
const deleteDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(req.params.id, { status: 'inactive' }, { new: true });
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found', data: {} });
    }
    res.status(200).json({ success: true, message: 'Doctor deactivated', data: doctor });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete doctor', data: { error: error.message } });
  }
};

module.exports = { getDoctors, getDoctorById, createDoctor, updateDoctor, deleteDoctor };
