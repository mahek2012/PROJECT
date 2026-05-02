const mongoose = require("mongoose");

const paymentMethodSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
    }, // e.g., 'upi', 'card', 'cod'
    isEnabled: {
      type: Boolean,
      default: true,
    },
    description: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("paymentMethod", paymentMethodSchema);
