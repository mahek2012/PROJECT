const express = require("express");
const router = express.Router();
const middleware = require("../../../middlewares/admin.middleware");
const usermiddleware = require("../../../middlewares/user.middleware");
const adminController = require("../../../controllers/admin.controller");
const adminEntityController = require("../../../controllers/adminEntity.controller");

// Admin Auth Middleware chain
const adminAuth = [usermiddleware.authUser, middleware.authAdmin];

// User Management
router.get("/all/user", adminAuth, adminController.AllUser);
router.delete("/user/:id", adminAuth, adminController.deleteUser);
router.put("/user/:id/role", adminAuth, adminController.updateUserRole);
router.put("/user/:id/status", adminAuth, adminController.updateUserStatus);


// Dashboard Stats
router.get("/stats", adminAuth, adminEntityController.getStats);

// Categories
router.get("/categories", adminAuth, adminEntityController.categories.getAll);
router.post("/categories", adminAuth, adminEntityController.categories.create);
router.put("/categories/:id", adminAuth, adminEntityController.categories.update);
router.delete("/categories/:id", adminAuth, adminEntityController.categories.delete);

// Reviews
router.get("/reviews", adminAuth, adminEntityController.reviews.getAll);
router.post("/reviews", adminAuth, adminEntityController.reviews.create);
router.put("/reviews/:id", adminAuth, adminEntityController.reviews.update);
router.delete("/reviews/:id", adminAuth, adminEntityController.reviews.delete);

// Offers
router.get("/offers", adminAuth, adminEntityController.offers.getAll);
router.post("/offers", adminAuth, adminEntityController.offers.create);
router.put("/offers/:id", adminAuth, adminEntityController.offers.update);
router.delete("/offers/:id", adminAuth, adminEntityController.offers.delete);

// Notifications
router.get("/notifications", adminAuth, adminEntityController.notifications.getAll);
router.post("/notifications", adminAuth, adminEntityController.notifications.create);
router.put("/notifications/:id", adminAuth, adminEntityController.notifications.update);
router.delete("/notifications/:id", adminAuth, adminEntityController.notifications.delete);

// Settings
router.get("/settings", adminAuth, adminEntityController.settings.getAll);
router.post("/settings", adminAuth, adminEntityController.settings.create);
router.put("/settings/:id", adminAuth, adminEntityController.settings.update);
router.delete("/settings/:id", adminAuth, adminEntityController.settings.delete);

// Payments
router.get("/payments", adminAuth, adminEntityController.payments.getAll);
router.post("/payments", adminAuth, adminEntityController.payments.create);
router.put("/payments/:id", adminAuth, adminEntityController.payments.update);
router.delete("/payments/:id", adminAuth, adminEntityController.payments.delete);

// Shipping
router.get("/shipping", adminAuth, adminEntityController.shipping.getAll);
router.post("/shipping", adminAuth, adminEntityController.shipping.create);
router.put("/shipping/:id", adminAuth, adminEntityController.shipping.update);
router.delete("/shipping/:id", adminAuth, adminEntityController.shipping.delete);

// Shipping Rules
router.get("/shipping-rules", adminAuth, adminEntityController.shippingRules.getAll);
router.post("/shipping-rules", adminAuth, adminEntityController.shippingRules.create);
router.put("/shipping-rules/:id", adminAuth, adminEntityController.shippingRules.update);
router.delete("/shipping-rules/:id", adminAuth, adminEntityController.shippingRules.delete);

// Payment Methods
router.get("/payment-methods", adminAuth, adminEntityController.paymentMethods.getAll);
router.post("/payment-methods", adminAuth, adminEntityController.paymentMethods.create);
router.put("/payment-methods/:id", adminAuth, adminEntityController.paymentMethods.update);
router.delete("/payment-methods/:id", adminAuth, adminEntityController.paymentMethods.delete);


module.exports = router;

