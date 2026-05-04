const express = require("express");
const userMiddleware = require("../../../middlewares/user.middleware");
const adminMiddleware = require("../../../middlewares/admin.middleware");
const productController = require("../../../controllers/product.controller");
const router = express.Router();

// create product
router.post(
  "/add",
  userMiddleware.authUser,
  adminMiddleware.authAdmin,
  productController.createProduct,
);

// all products
router.get(
  "/",
  userMiddleware.authUser,
  productController.allProduct,
);

// get categories -- must be before /:id
router.get(
  "/categories",
  productController.getCategories
);

// Smart Search -- must be before /:id
router.get(
  "/smart-search",
  productController.smartSearch
);

// Recommendations -- must be before /:id
router.get(
  "/recommendations/:id",
  productController.getRecommendations
);

// single product -- /:id must come AFTER specific routes
router.get(
  "/:id",
  userMiddleware.authUser,
  productController.singleProduct,
);

// update product
router.put(
  "/:id",
  userMiddleware.authUser,
  adminMiddleware.authAdmin,
  productController.updateProduct,
);

// delete product
router.delete(
  "/:id",
  userMiddleware.authUser,
  adminMiddleware.authAdmin,
  productController.deleteProduct,
);

// reviews
router.get(
  "/:id/reviews",
  productController.getProductReviews
);

router.post(
  "/:id/reviews",
  userMiddleware.authUser,
  productController.addReview
);

module.exports = router;
