const wishlistModel = require("../models/wishlist.model")

// add items into wishlist
module.exports.AddToWishlist = async ({ userId, productId }) => {
  let wishlistItem = await wishlistModel.findOne({ userId, productId });

  if (!wishlistItem) {
    wishlistItem = new wishlistModel({ userId, productId });
    return await wishlistItem.save();
  }
  return wishlistItem;
};

// get wishlist
module.exports.GetWishlist = async (userId) => {
  return await wishlistModel.find({ userId }).populate("productId");
};

// remove from wishlist
module.exports.RemoveFromWishlist = async ({ userId, productId }) => {
  return await wishlistModel.findOneAndDelete({ userId, productId });
};