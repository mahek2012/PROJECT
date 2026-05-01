const mongoose = require("mongoose");

let OrderSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true
    },
    items: [
      { 
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "product" }, 
        name: String,
        image: String,
        quantity: Number, 
        price: Number, 
        total: Number 
      },
    ],
    totalbill: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "delivered", "cancelled", "returned"],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      default: "COD"
    },
    shippingAddress: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("order", OrderSchema);

