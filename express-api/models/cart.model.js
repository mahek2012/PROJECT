const mongoose = require("mongoose");

let CartSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: "product",
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    default: 1
  }
}, { timestamps: true });

module.exports = mongoose.model("cart", CartSchema);
