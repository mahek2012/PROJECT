const orderModel = require("../models/order.model");
const productModel = require("../models/product.model");


// create order
module.exports.CreateOrder = async ({ userId, items, shippingAddress, paymentMethod }) => {
  let totalAmount = 0;

  let orderItems = [];

  for (let item of items) {
    console.log(item);
    const productId = item.productId || item.id || item._id;
    const product = await productModel.findOne({ _id: productId });

    if (!product) throw new Error("Product Not Found");

    const itemsTotal = product.price * item.quantity;

    totalAmount += itemsTotal;

    orderItems.push({
      productId: product._id,
      name: product.name,
      image: product.images?.[0] || "https://placehold.co/400x400?text=No+Image",
      quantity: item.quantity,
      price: product.price,
      total: itemsTotal,
    });
  }

  let parsedAddress = shippingAddress;
  if (typeof shippingAddress === 'string') {
    const parts = shippingAddress.split(', ');
    parsedAddress = {
      street: parts[0] || '',
      city: parts[1] || '',
      zipCode: parts[2] || '',
      country: parts[3] || ''
    };
  }

  return await orderModel.create({
    userId,
    items: orderItems,
    totalbill: totalAmount,
    shippingAddress: parsedAddress,
    paymentMethod: paymentMethod || "COD",
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

// Cancel Order
module.exports.CancelOrder = async (orderId, userId) => {
  const order = await orderModel.findOne({ _id: orderId, userId });
  if (!order) throw new Error("Order not found or unauthorized");
  if (order.status !== "pending") throw new Error("Cannot cancel order at this stage");
  
  order.status = "cancelled";
  return await order.save();
};