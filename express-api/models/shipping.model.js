const mongoose = require("mongoose");

const shippingSchema = mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "order",
      required: true,
    },
    address: {
      fullName: String,
      phone: String,
      street: String,
      city: String,
      state: String,
      pincode: String,
      country: String,
    },
    carrier: {
      type: String,
      default: "Internal",
    },
    trackingNumber: {
      type: String,
    },
    status: {
      type: String,
      enum: ["preparing", "shipped", "out_for_delivery", "delivered", "returned"],
      default: "preparing",
    },
    estimatedDelivery: {
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("shipping", shippingSchema);
