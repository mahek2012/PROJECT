const express = require("express");
const userMiddleware = require("../../../middlewares/user.middleware");
const notificationController = require("../../../controllers/notification.controller");
const router = express.Router();

router.get("/", userMiddleware.authUser, notificationController.getNotifications);
router.put("/mark-read/:id", userMiddleware.authUser, notificationController.markAsRead);
router.put("/mark-all-read", userMiddleware.authUser, notificationController.markAllAsRead);

module.exports = router;
