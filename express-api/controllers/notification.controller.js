const notificationModel = require("../models/notification.model");

// Get all notifications for a user
module.exports.getNotifications = async (req, res) => {
  try {
    const userId = req.user._id;
    const notifications = await notificationModel.find({ userId }).sort({ createdAt: -1 }).limit(20);
    return res.status(200).json({ success: true, notifications });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Mark notification as read
module.exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    await notificationModel.findByIdAndUpdate(id, { isRead: true });
    return res.status(200).json({ success: true, message: "Marked as read" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Mark all as read
module.exports.markAllAsRead = async (req, res) => {
  try {
    const userId = req.user._id;
    await notificationModel.updateMany({ userId }, { isRead: true });
    return res.status(200).json({ success: true, message: "All marked as read" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Helper function to create notification (AI Logic)
module.exports.createNotification = async ({ userId, title, message, type, productId, link }) => {
  try {
    const notification = await notificationModel.create({
      userId,
      title,
      message,
      type,
      productId,
      link
    });
    console.log(`[AI Notification] Sent to user ${userId}: ${title}`);
    return notification;
  } catch (error) {
    console.error("Failed to create notification:", error);
  }
};
