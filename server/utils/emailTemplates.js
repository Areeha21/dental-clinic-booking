// Each function returns { subject, html } for a given appointment status.
// Keeping templates separate from sendEmail.js keeps the wording easy to
// edit later without touching the sending logic.

const formatDate = (date) =>
  new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

const baseStyle = `font-family: Arial, sans-serif; color: #1a1a1a; line-height: 1.6;`;

const appointmentPendingTemplate = (appointment) => ({
  subject: 'Appointment Request Received — Rashid Dental Clinic',
  html: `
    <div style="${baseStyle}">
      <h2 style="color: #0a2540;">Appointment Request Received</h2>
      <p>Hi ${appointment.patient.name},</p>
      <p>We've received your appointment request for <strong>${appointment.service.name}</strong>
      with <strong>${appointment.doctor.name}</strong> on
      <strong>${formatDate(appointment.appointmentDate)}</strong> at
      <strong>${appointment.startTime}</strong>.</p>
      <p>Your booking reference is <strong>${appointment.bookingReference}</strong>.
      We'll email you again once the clinic confirms your appointment.</p>
      <p>— Rashid Dental Clinic</p>
    </div>
  `,
});

const appointmentConfirmedTemplate = (appointment) => ({
  subject: 'Appointment Confirmed — Rashid Dental Clinic',
  html: `
    <div style="${baseStyle}">
      <h2 style="color: #0a2540;">Your Appointment is Confirmed</h2>
      <p>Hi ${appointment.patient.name},</p>
      <p>Your appointment for <strong>${appointment.service.name}</strong> with
      <strong>${appointment.doctor.name}</strong> on
      <strong>${formatDate(appointment.appointmentDate)}</strong> at
      <strong>${appointment.startTime}</strong> has been confirmed.</p>
      <p>Booking reference: <strong>${appointment.bookingReference}</strong></p>
      <p>We look forward to seeing you.</p>
      <p>— Rashid Dental Clinic</p>
    </div>
  `,
});

const appointmentRejectedTemplate = (appointment) => ({
  subject: 'Appointment Update — Rashid Dental Clinic',
  html: `
    <div style="${baseStyle}">
      <h2 style="color: #0a2540;">Appointment Not Available</h2>
      <p>Hi ${appointment.patient.name},</p>
      <p>Unfortunately, we're unable to confirm your appointment request for
      <strong>${formatDate(appointment.appointmentDate)}</strong> at
      <strong>${appointment.startTime}</strong>.
      ${appointment.cancellationReason ? `Reason: ${appointment.cancellationReason}` : ''}</p>
      <p>Please feel free to book another time that works for you.</p>
      <p>— Rashid Dental Clinic</p>
    </div>
  `,
});

const appointmentCancelledTemplate = (appointment) => ({
  subject: 'Appointment Cancelled — Rashid Dental Clinic',
  html: `
    <div style="${baseStyle}">
      <h2 style="color: #0a2540;">Appointment Cancelled</h2>
      <p>Hi ${appointment.patient.name},</p>
      <p>Your appointment on <strong>${formatDate(appointment.appointmentDate)}</strong> at
      <strong>${appointment.startTime}</strong> has been cancelled.
      ${appointment.cancellationReason ? `Reason: ${appointment.cancellationReason}` : ''}</p>
      <p>— Rashid Dental Clinic</p>
    </div>
  `,
});

const appointmentCompletedTemplate = (appointment) => ({
  subject: 'Thank You for Visiting — Rashid Dental Clinic',
  html: `
    <div style="${baseStyle}">
      <h2 style="color: #0a2540;">Thank You</h2>
      <p>Hi ${appointment.patient.name},</p>
      <p>Thank you for visiting Rashid Dental Clinic for your
      <strong>${appointment.service.name}</strong> appointment. We hope you had a great experience.</p>
      <p>— Rashid Dental Clinic</p>
    </div>
  `,
});

module.exports = {
  appointmentPendingTemplate,
  appointmentConfirmedTemplate,
  appointmentRejectedTemplate,
  appointmentCancelledTemplate,
  appointmentCompletedTemplate,
};
