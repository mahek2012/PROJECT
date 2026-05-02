const mongoose = require("mongoose");

const paymentSchema = mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "order",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    method: {
      type: String,
      enum: ["card", "upi", "cod", "netbanking"],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed", "refunded"],
      default: "pending",
    },
    transactionId: {
      type: String,
    },
    refundReason: {
      type: String,
    },
  },

  { timestamps: true }
);

module.exports = mongoose.model("payment", paymentSchema);
