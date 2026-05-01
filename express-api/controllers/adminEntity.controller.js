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
exports.payments = { getAll: getAll(Payment), create: create(Payment), update: update(Payment), delete: remove(Payment) };
exports.shipping = { getAll: getAll(Shipping), create: create(Shipping), update: update(Shipping), delete: remove(Shipping) };
