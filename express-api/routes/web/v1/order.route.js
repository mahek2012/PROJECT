const express = require("express");
const router = express.Router();
const userMiddleware = require("../../../middlewares/user.middleware");
const adminMiddleware = require("../../../middlewares/admin.middleware");
const orderController = require("../../../controllers/order.controller");


// create order
router.post("/", userMiddleware.authUser, orderController.CreateOrder)

// get order - show history or recent order
router.get("/my-orders", userMiddleware.authUser, orderController.GetOrder)

// Admin: All orders
router.get("/admin/all", userMiddleware.authUser, adminMiddleware.authAdmin, orderController.FetchAllOrders);

// Admin: Update order
router.put("/admin/:orderId", userMiddleware.authUser, adminMiddleware.authAdmin, orderController.UpdateOrder);




// remove Items for Order



// Cancel Order
router.put("/:id/cancel", userMiddleware.authUser, orderController.CancelOrder);




module.exports = router;