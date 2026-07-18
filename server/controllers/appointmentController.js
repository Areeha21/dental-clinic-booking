const Appointment = require('../models/Appointment');
const Service = require('../models/Service');
const sendEmail = require('../utils/sendEmail');
const {
  appointmentPendingTemplate,
  appointmentConfirmedTemplate,
  appointmentRejectedTemplate,
  appointmentCancelledTemplate,
  appointmentCompletedTemplate,
} = require('../utils/emailTemplates');

const addMinutesToTime = (startTime, durationMinutes) => {
  const [hours, minutes] = startTime.split(':').map(Number);
  const totalMinutes = hours * 60 + minutes + durationMinutes;
  const endHours = Math.floor(totalMinutes / 60) % 24;
  const endMinutes = totalMinutes % 60;
  return `${String(endHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}`;
};

// Maps a status to its email template function
const templateForStatus = {
  pending: appointmentPendingTemplate,
  confirmed: appointmentConfirmedTemplate,
  rejected: appointmentRejectedTemplate,
  cancelled: appointmentCancelledTemplate,
  completed: appointmentCompletedTemplate,
};

// Sends the right email for a given appointment + status, if a template exists for it.
// Appointment must already be populated with patient, doctor, and service.
const notifyStatusChange = async (appointment, status) => {
  const templateFn = templateForStatus[status];
  if (!templateFn) return; // no email defined for this status (e.g. "rescheduled")

  const { subject, html } = templateFn(appointment);
  await sendEmail({ to: appointment.patient.email, subject, html });
};

// POST /api/appointments — patient books an appointment
const createAppointment = async (req, res) => {
  try {
    const { doctor, service, appointmentDate, startTime, reason } = req.body;

    if (!doctor || !service || !appointmentDate || !startTime) {
      return res.status(400).json({ success: false, message: 'Doctor, service, date, and time are required', data: {} });
    }

    const requestedDate = new Date(appointmentDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (requestedDate < today) {
      return res.status(400).json({ success: false, message: 'Cannot book a date in the past', data: {} });
    }

    const serviceDoc = await Service.findById(service);
    if (!serviceDoc) {
      return res.status(404).json({ success: false, message: 'Service not found', data: {} });
    }

    const endTime = addMinutesToTime(startTime, serviceDoc.durationMinutes);

    let appointment = await Appointment.create({
      patient: req.user.id,
      doctor,
      service,
      appointmentDate: requestedDate,
      startTime,
      endTime,
      reason,
      statusHistory: [{ status: 'pending', changedBy: req.user.id }],
    });

    // Populate before emailing so the template has patient name/email, doctor name, service name
    appointment = await appointment.populate(['patient', 'doctor', 'service']);
    await notifyStatusChange(appointment, 'pending');

    res.status(201).json({ success: true, message: 'Appointment request submitted successfully', data: appointment });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ success: false, message: 'This time slot is already booked for this doctor', data: {} });
    }
    res.status(500).json({ success: false, message: 'Failed to create appointment', data: { error: error.message } });
  }
};

const getMyAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ patient: req.user.id })
      .populate('doctor', 'name specialization')
      .populate('service', 'name price durationMinutes')
      .sort({ appointmentDate: -1 });
    res.status(200).json({ success: true, message: 'Appointments fetched', data: appointments });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch appointments', data: { error: error.message } });
  }
};

const cancelMyAppointment = async (req, res) => {
  try {
    let appointment = await Appointment.findById(req.params.id).populate(['patient', 'doctor', 'service']);
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found', data: {} });
    }
    if (appointment.patient._id.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'You can only cancel your own appointments', data: {} });
    }
    if (['completed', 'cancelled', 'rejected'].includes(appointment.status)) {
      return res.status(400).json({ success: false, message: 'This appointment cannot be cancelled', data: {} });
    }

    appointment.status = 'cancelled';
    appointment.cancellationReason = req.body.reason || 'Cancelled by patient';
    appointment.statusHistory.push({ status: 'cancelled', changedBy: req.user.id });
    await appointment.save();

    await notifyStatusChange(appointment, 'cancelled');

    res.status(200).json({ success: true, message: 'Appointment cancelled', data: appointment });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to cancel appointment', data: { error: error.message } });
  }
};

const getAllAppointments = async (req, res) => {
  try {
    const { date, doctor, service, status } = req.query;
    const filter = {};
    if (date) filter.appointmentDate = new Date(date);
    if (doctor) filter.doctor = doctor;
    if (service) filter.service = service;
    if (status) filter.status = status;

    const appointments = await Appointment.find(filter)
      .populate('patient', 'name email phone')
      .populate('doctor', 'name specialization')
      .populate('service', 'name price durationMinutes')
      .sort({ appointmentDate: -1 });

    res.status(200).json({ success: true, message: 'Appointments fetched', data: appointments });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch appointments', data: { error: error.message } });
  }
};

// PATCH /api/admin/appointments/:id/status — admin confirms, rejects, reschedules, or completes
const updateAppointmentStatus = async (req, res) => {
  try {
    const { status, cancellationReason, appointmentDate, startTime } = req.body;
    const allowedStatuses = ['confirmed', 'rejected', 'rescheduled', 'cancelled', 'completed'];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value', data: {} });
    }

    let appointment = await Appointment.findById(req.params.id).populate(['patient', 'doctor', 'service']);
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found', data: {} });
    }

    appointment.status = status;
    if (status === 'rescheduled' && appointmentDate && startTime) {
      appointment.appointmentDate = new Date(appointmentDate);
      appointment.startTime = startTime;
    }
    if (['rejected', 'cancelled'].includes(status) && cancellationReason) {
      appointment.cancellationReason = cancellationReason;
    }
    appointment.statusHistory.push({ status, changedBy: req.user.id });
    await appointment.save();

    await notifyStatusChange(appointment, status);

    res.status(200).json({ success: true, message: `Appointment ${status}`, data: appointment });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update appointment status', data: { error: error.message } });
  }
};

module.exports = {
  createAppointment,
  getMyAppointments,
  cancelMyAppointment,
  getAllAppointments,
  updateAppointmentStatus,
};
