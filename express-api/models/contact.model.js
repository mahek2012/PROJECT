const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  subject: {
    type: String,
    trim: true
  },
  message: {
    type: String,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    default: null
  },
  status: {
    type: String,
    enum: ['pending', 'seen', 'replied'],
    default: 'pending'
  },
  adminReply: {
    type: String,
    default: ''
  },
  repliedAt: {
    type: Date
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Contact', contactSchema);
