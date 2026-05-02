const mongoose = require("mongoose");

const WishlistSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "product",
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model("wishlist", WishlistSchema)