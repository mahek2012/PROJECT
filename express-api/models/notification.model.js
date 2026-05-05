const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['cart_reminder', 'price_drop', 'stock_alert', 'order_update', 'promo'],
    default: 'promo'
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'product'
  },
  isRead: {
    type: Boolean,
    default: false
  },
  link: {
    type: String
  }
}, { timestamps: true });

module.exports = mongoose.model('notification', notificationSchema);
