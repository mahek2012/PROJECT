const orderModel = require("../models/order.model");
const productModel = require("../models/product.model");


// create order
module.exports.CreateOrder = async ({ userId, items }) => {
  let totalAmount = 0;

  let orderItems = [];

  for (let item of items) {
    console.log(item);
    const productId = item.productId;
    const product = await productModel.findOne({ _id: productId });

    if (!product) throw new Error("Product Not Found");

    const itemsTotal = product.price * item.quantity;

    totalAmount += itemsTotal;

    orderItems.push({
      productId: product._id,
      quantity: item.quantity,
      price: product.price,
      total: itemsTotal,
    });
  }

  return await orderModel.create({
    userId,
    items: orderItems,
    totalbill: totalAmount,
  });
};

// get order history or show order
module.exports.GetOrder = async(userId)=>{
    return await orderModel.find({userId}).sort({ createdAt: -1 });
}

// Admin: Get all orders
module.exports.GetAllOrders = async () => {
    return await orderModel.find()
        .populate('userId', 'username email')
        .sort({ createdAt: -1 });
};

// Admin: Update order status
module.exports.UpdateOrderStatus = async (orderId, status, paymentStatus) => {
    const updateData = {};
    if (status) updateData.status = status;
    if (paymentStatus) updateData.paymentStatus = paymentStatus;

    return await orderModel.findByIdAndUpdate(
        orderId,
        updateData,
        { new: true }
    ).populate('userId', 'username email');
};

// Get single order for invoice
module.exports.GetOrderById = async (id) => {
    return await orderModel.findById(id).populate('userId', 'username email');
};