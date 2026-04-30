const mongoose = require("mongoose");

let CartSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "product"
      },
      quantity: Number,
    },
  ],
});

module.exports = mongoose.model("cart", CartSchema);
