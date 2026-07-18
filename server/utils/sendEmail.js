const nodemailer = require('nodemailer');

// This transporter is reused for every email the app sends.
// It authenticates with Gmail using an App Password, not your real password.
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

// Generic send function — every email in the app goes through this.
// `to` = recipient email, `subject` = email subject line, `html` = email body content
const sendEmail = async ({ to, subject, html }) => {
  try {
    await transporter.sendMail({
      from: `"Rashid Dental Clinic" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log(`Email sent to ${to}: ${subject}`);
  } catch (error) {
    // We log the error but don't throw — a failed email should never
    // crash the appointment update itself, just get logged for review.
    console.error(`Failed to send email to ${to}:`, error.message);
  }
};

module.exports = sendEmail;
