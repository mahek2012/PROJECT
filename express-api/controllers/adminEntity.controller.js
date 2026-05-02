const Category = require("../models/category.model");
const Review = require("../models/review.model");
const Offer = require("../models/offer.model");
const Notification = require("../models/notification.model");
const Setting = require("../models/setting.model");
const Payment = require("../models/payment.model");
const Shipping = require("../models/shipping.model");
const User = require("../models/user.model");
const Order = require("../models/order.model");
const Product = require("../models/product.model");
const ShippingRule = require("../models/shippingRule.model");
const PaymentMethod = require("../models/paymentMethod.model");


// Generic CRUD handlers
const getAll = (Model) => async (req, res) => {
  try {
    const data = await Model.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const create = (Model) => async (req, res) => {
  try {
    const data = await Model.create(req.body);
    res.status(201).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const update = (Model) => async (req, res) => {
  try {
    const data = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const remove = (Model) => async (req, res) => {
  try {
    await Model.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllPayments = async (req, res) => {
  try {
    // 1. Find all orders
    const allOrders = await Order.find().lean();
    
    // 2. Find all existing payments to see what's missing
    const existingPayments = await Payment.find().lean();
    const orderIdsWithPayments = new Set(
      existingPayments
        .filter(p => p.orderId)
        .map(p => p.orderId.toString())
    );

    // 3. Create missing payment records for existing orders (Data Healing)
    const missingPayments = allOrders.filter(order => !orderIdsWithPayments.has(order._id.toString()));
    
    if (missingPayments.length > 0) {
      console.log(`[Healing] Found ${missingPayments.length} orders without payment records.`);
      const paymentPromises = missingPayments.map(order => {
        const method = (order.paymentMethod || "cod").toLowerCase();
        const cleanMethod = method.includes("card") ? "card" : method.includes("upi") ? "upi" : "cod";
        
        return Payment.create({
          orderId: order._id,
          userId: order.userId,
          amount: order.totalbill || 0,
          method: cleanMethod,
          status: cleanMethod === "cod" ? "pending" : "completed",
          transactionId: "TXN-OLD-" + order._id.toString().slice(-6).toUpperCase()
        });
      });
      await Promise.all(paymentPromises);
      console.log(`[Healing] Successfully created missing records.`);
    }

    // 4. Now fetch the full populated list
    const data = await Payment.find()
      .populate("userId", "fullName username email")
      .populate("orderId")
      .sort({ createdAt: -1 });

      
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("FATAL ERROR in getAllPayments:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};



const getAllShipping = async (req, res) => {
  try {
    const data = await Shipping.find()
      .populate("orderId")
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// Specialized handlers
exports.getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalRevenue = await Order.aggregate([
      { $group: { _id: null, total: { $sum: "$totalbill" } } }
    ]);

    // Monthly Sales Data for Graph
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlySales = await Order.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { $month: "$createdAt" },
          sales: { $sum: "$totalbill" },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    // Map month numbers to names
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const formattedSales = monthlySales.map(item => ({
      month: monthNames[item._id - 1],
      revenue: item.sales,
      orders: item.count
    }));

    // Monthly User Growth
    const userGrowth = await User.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { $month: "$createdAt" },
          users: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    const formattedUserGrowth = userGrowth.map(item => ({
      month: monthNames[item._id - 1],
      users: item.users
    }));

    // Top Products
    const topProducts = await Product.find()
      .limit(5)
      .select("name price category images");

    // Category Performance
    const categoryPerformance = await Product.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
          avgPrice: { $avg: "$price" }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalOrders,
        totalProducts,
        totalRevenue: totalRevenue[0]?.total || 0,
        salesData: formattedSales,
        userGrowth: formattedUserGrowth,
        topProducts,
        categoryPerformance: categoryPerformance.map(c => ({
          name: c._id,
          value: c.count,
          avgPrice: Math.round(c.avgPrice)
        }))
      }
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Exports for each model
exports.categories = { getAll: getAll(Category), create: create(Category), update: update(Category), delete: remove(Category) };
exports.reviews = { getAll: getAll(Review), create: create(Review), update: update(Review), delete: remove(Review) };
exports.offers = { getAll: getAll(Offer), create: create(Offer), update: update(Offer), delete: remove(Offer) };
exports.notifications = { getAll: getAll(Notification), create: create(Notification), update: update(Notification), delete: remove(Notification) };
exports.settings = { getAll: getAll(Setting), create: create(Setting), update: update(Setting), delete: remove(Setting) };
exports.payments = { getAll: getAllPayments, create: create(Payment), update: update(Payment), delete: remove(Payment) };
exports.shipping = { getAll: getAllShipping, create: create(Shipping), update: update(Shipping), delete: remove(Shipping) };
exports.shippingRules = { getAll: getAll(ShippingRule), create: create(ShippingRule), update: update(ShippingRule), delete: remove(ShippingRule) };
exports.paymentMethods = { getAll: getAll(PaymentMethod), create: create(PaymentMethod), update: update(PaymentMethod), delete: remove(PaymentMethod) };


