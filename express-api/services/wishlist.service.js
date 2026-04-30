const wishlistModel = require("../models/wishlist.model")

// add items into wishlist
module.exports.AddToWishlist =async ({userId, item}) =>{

    let wishlist = await wishlistModel.findOne({userId});

    if(!wishlist) wishlist = new wishlistModel({userId, productIds: []})

    wishlist.productIds.push(item)
    return await wishlist.save();
}