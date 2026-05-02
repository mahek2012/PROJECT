const wishlistService = require("../services/wishlist.service");

// add item to wishlist
module.exports.AddToWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;

    await wishlistService.AddToWishlist({ userId, productId });
    
    // Always return the updated full wishlist
    const wishlist = await wishlistService.GetWishlist(userId);

    return res.status(200).json({ success: true, message: "Added to wishlist", wishlist });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

// get wishlist
module.exports.GetWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const wishlist = await wishlistService.GetWishlist(userId);

    return res.status(200).json({ 
      success: true, 
      wishlist: wishlist || [] 
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

// remove item from wishlist
module.exports.RemoveFromWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    await wishlistService.RemoveFromWishlist({ userId, productId });

    return res.status(200).json({ success: true, message: "Removed from wishlist", productId });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};