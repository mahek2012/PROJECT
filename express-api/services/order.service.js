const orderModel = require("../models/order.model");
const productModel = require("../models/product.model");
const paymentModel = require("../models/payment.model");
const mongoose = require("mongoose");




// create order
module.exports.CreateOrder = async ({ userId, items, shippingAddress, paymentMethod }) => {
  console.log("Creating order for user:", userId);
  let totalAmount = 0;
  let orderItems = [];

  for (let item of items) {
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

  console.log("Saving order to database...");
  const order = await orderModel.create({
    userId,
    items: orderItems,
    totalbill: totalAmount,
    shippingAddress: parsedAddress,
    paymentMethod: paymentMethod || "COD",
  });

  console.log("Order saved. Creating payment record...");
  try {
    const method = (paymentMethod || "cod").toLowerCase();
    const cleanMethod = method.includes("card") ? "card" : method.includes("upi") ? "upi" : method.includes("net") ? "netbanking" : "cod";

    const payment = await paymentModel.create({
      orderId: order._id,
      userId: userId,
      amount: totalAmount,
      method: cleanMethod,
      status: cleanMethod === "cod" ? "pending" : "completed",
      transactionId: "TXN-" + Math.random().toString(36).substring(2, 11).toUpperCase(),
    });
    console.log("Payment record created successfully:", payment.transactionId);
  } catch (paymentError) {
    console.error("CRITICAL: Failed to create payment record for order", order._id, paymentError);
    // Even if payment record fails, we have the order, but this shouldn't happen.
  }

  // Clear user's cart after successful order
  await mongoose.model('cart').deleteMany({ userId });

  return order;
};




// get order history or show order
module.exports.GetOrder = async(userId)=>{
    return await orderModel.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      { $sort: { createdAt: -1 } },

      {
        $lookup: {
          from: "payments",
          localField: "_id",
          foreignField: "orderId",
          as: "paymentDetails"
        }
      },
      {
        $addFields: {
          payment: { $arrayElemAt: ["$paymentDetails", 0] }
        }
      }
    ]);
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