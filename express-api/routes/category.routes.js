const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/category.controller");
const userMiddleware = require("../middlewares/user.middleware");
const adminMiddleware = require("../middlewares/admin.middleware");


router.post(
  "/create",
  userMiddleware.authUser,
  adminMiddleware.authAdmin,
  categoryController.createCategory
);

router.get("/all", categoryController.getAllCategories);

router.put(
  "/update/:id",
  userMiddleware.authUser,
  adminMiddleware.authAdmin,
  categoryController.updateCategory
);

router.delete(
  "/delete/:id",
  userMiddleware.authUser,
  adminMiddleware.authAdmin,
  categoryController.deleteCategory
);

module.exports = router;
