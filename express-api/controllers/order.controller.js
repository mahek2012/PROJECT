const orderService = require("../services/order.service");

// create order
module.exports.CreateOrder = async (req, res) => {
  try {
    const userId = req.user._id;

    const { items, shippingAddress, paymentMethod } = req.body;

    const order = await orderService.CreateOrder({ userId, items, shippingAddress, paymentMethod });

    if (!order) {
      return res.status(404).json("Products not Found");
    }

    return res
      .status(200)
      .json({ message: "Order Created Successfully", order });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// get order deatils and show order stauts
module.exports.GetOrder = async (req, res) => {
  try {
    const userId = req.user._id;


    const order = await orderService.GetOrder(userId);

    if (!order) return res.status(404).json({ message: "Order Not Found !!" });

    return res
      .status(200)
      .json({ message: "Order Featch Successfully", order });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// Admin: Get all orders
module.exports.FetchAllOrders = async (req, res) => {
  try {
    const orders = await orderService.GetAllOrders();
    return res.status(200).json({ success: true, orders });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Admin: Update order
module.exports.UpdateOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, paymentStatus } = req.body;
    const order = await orderService.UpdateOrderStatus(orderId, status, paymentStatus);
    return res.status(200).json({ success: true, message: "Order updated", order });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Cancel Order
module.exports.CancelOrder = async (req, res) => {
  try {
    const userId = req.user._id;

    const { id } = req.params;
    const order = await orderService.CancelOrder(id, userId);
    return res.status(200).json({ success: true, message: "Order cancelled successfully", order });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

