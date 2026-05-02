const cartModel = require("../models/cart.model");

// add item to cart
module.exports.addToCart = async ({ userId, productId, quantity, behavior }) => {
  let cartItem = await cartModel.findOne({ userId, productId });

  if (cartItem) {
    if (behavior === 'set') {
      cartItem.quantity = quantity;
    } else {
      cartItem.quantity += (quantity || 1);
    }
    return await cartItem.save();
  } else {
    cartItem = new cartModel({ userId, productId, quantity: quantity || 1 });
    return await cartItem.save();
  }
};


// get Cart
module.exports.GetCart = async (userId) => {
  return await cartModel.find({ userId }).populate("productId");
};

// delete single product from cart
module.exports.RemoveSingleProduct = async ({ userId, productId }) => {
  return await cartModel.findOneAndDelete({ userId, productId });
};
