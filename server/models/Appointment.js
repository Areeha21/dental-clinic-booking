const mongoose = require('mongoose');
const crypto = require('crypto');

const appointmentSchema = new mongoose.Schema(
  {
    bookingReference: {
      type: String,
      unique: true,
      default: () => `APT-${crypto.randomBytes(4).toString('hex').toUpperCase()}`,
    },
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
      required: true,
    },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      required: true,
    },
    appointmentDate: {
      type: Date,
      required: true, // store just the calendar date (midnight UTC)
    },
    startTime: {
      type: String, // "HH:mm", 24hr format
      required: true,
    },
    endTime: {
      type: String, // computed from startTime + service.durationMinutes
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'rejected', 'rescheduled', 'cancelled', 'completed'],
      default: 'pending',
    },
    reason: {
      type: String, // short reason for visit, NOT detailed medical history
      maxlength: 300,
      default: '',
    },
    cancellationReason: {
      type: String,
      default: '',
    },
    // Optional: keep a lightweight audit trail of status changes
    statusHistory: [
      {
        status: String,
        changedAt: { type: Date, default: Date.now },
        changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      },
    ],
  },
  { timestamps: true }
);

// Prevents two appointments for the same doctor at the same date + start time,
// but only while the appointment is still "active" (not cancelled/rejected).
// Partial index means cancelled/rejected slots don't block rebooking.
appointmentSchema.index(
  { doctor: 1, appointmentDate: 1, startTime: 1 },
  {
    unique: true,
    partialFilterExpression: {
      status: { $in: ['pending', 'confirmed', 'rescheduled'] },
    },
  }
);

module.exports = mongoose.model('Appointment', appointmentSchema);
