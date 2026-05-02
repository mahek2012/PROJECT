const cartModel = require("../models/cart.model");
const cartService = require("../services/cart.service");

// Add To Cart
module.exports.AddToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity, behavior } = req.body;

    await cartService.addToCart({ userId, productId, quantity, behavior });
    
    // Always return the updated full cart
    const cart = await cartService.GetCart(userId);

    return res.status(200).json({ success: true, message: "Added to cart", cart });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};



// Get Cart
module.exports.GetCart = async (req, res) => {
  try {
    const userId = req.user.id;
    let cart = await cartService.GetCart(userId);

    return res.status(200).json({ 
      success: true, 
      cart: cart || [] 
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

// remove single item from cart
module.exports.RemoveItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const productId = req.params.id;

    await cartService.RemoveSingleProduct({ userId, productId });

    return res.status(200).json({ success: true, message: "Removed from cart", productId });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};
