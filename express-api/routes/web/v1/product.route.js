// product creation
// product read single and all
// product update
// product delete

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
// authUser ==> check user login or not? ==> if login then --> req.user (give you back)
// authAdmin ==> req.user ==> check role ==> Admin or not? --> jump to next router

// all product
router.get(
  "/",
  userMiddleware.authUser,
  productController.allProduct,
);

// get categories
router.get(
  "/categories",
  productController.getCategories
);


// single product
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
