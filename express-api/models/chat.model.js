const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    default: null
  },
  sessionId: String,
  messages: [
    {
      sender: { type: String, enum: ['user', 'bot'] },
      text: String,
      timestamp: { type: Date, default: Date.now },
      type: { type: String, enum: ['text', 'product', 'order_status'], default: 'text' },
      metadata: mongoose.Schema.Types.Mixed
    }
  ],
  status: { type: String, enum: ['active', 'closed'], default: 'active' }
}, { timestamps: true });

module.exports = mongoose.model('Chat', chatSchema);
