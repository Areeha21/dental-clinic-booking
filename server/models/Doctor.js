const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    specialization: {
      type: String,
      required: true,
      trim: true,
    },
    bio: {
      type: String,
      default: '',
    },
    profileImage: {
      type: String, // URL to image, e.g. from Cloudinary or a static path
      default: '',
    },
    availableDays: {
      // e.g. ['Monday', 'Wednesday', 'Friday']
      type: [String],
      enum: [
        'Monday', 'Tuesday', 'Wednesday', 'Thursday',
        'Friday', 'Saturday', 'Sunday',
      ],
      default: [],
    },
    workingHours: {
      start: { type: String, default: '09:00' }, // 24hr "HH:mm"
      end: { type: String, default: '17:00' },
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Doctor', doctorSchema);
