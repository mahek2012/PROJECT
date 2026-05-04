const productService = require("../services/product.service");
const productModel = require("../models/product.model");
const reviewModel = require("../models/review.model");

// add new products
module.exports.createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      stock,
      price,
      discount,
      isNewProduct,
      sku,
      images,
      brand,
      category,
      sizes,
      colors,
    } = req.body;

    // Validate required fields early and return clear message
    if (!name || !description || !stock || !price || !sku || !brand || !category) {
      return res.status(400).json({
        message: "Sabhi zaroori fields bharne chahiye: name, description, stock, price, sku, brand, category",
      });
    }

    // Ensure images is always an array
    const imagesArray = Array.isArray(images)
      ? images
      : images
      ? [images]
      : ["https://placehold.co/400x400?text=No+Image"];

    const isExist = await productModel.findOne({ sku: sku });
    if (isExist) {
      return res.status(400).json({ message: "Is SKU ka product pehle se registered hai" });
    }

    const product = await productService.createProduct({
      name,
      description,
      stock: Number(stock),
      price: Number(price),
      discount: Number(discount) || 0,
      isNewProduct: isNewProduct === true || isNewProduct === "true",
      sku,
      images: imagesArray,
      brand,
      category,
      sizes,
      colors,
    });


    return res.status(201).json({ message: "Product successfully add ho gaya", product });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// all products
module.exports.allProduct = async (req, res) => {
  try {
    const products = await productService.AllProduct();
    const totalProducts = await productModel.countDocuments();


    if (!products) {
      return res.status(404).json({ message: "Products Not Found !!" });
    }

    return res.status(200).json({ 
      message: "Fetch All Products:", 
      products,
      totalProducts 
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// get categories
module.exports.getCategories = async (req, res) => {
  try {
    const categories = await productModel.distinct('category');
    return res.status(200).json(categories);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};



// single product
module.exports.singleProduct = async (req, res) => {
  try {
    const product = await productService.singleProduct(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product Not Found !!" });
    }

    return res.status(200).json({ message: "Product Found !!", product });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// update product
module.exports.updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    const {
      name,
      description,
      stock,
      price,
      discount,
      isNewProduct,
      sku,
      images,
      brand,
      category,
      sizes,
      colors,
    } = req.body;

    // Normalize images to array
    const imagesArray = Array.isArray(images)
      ? images
      : images
      ? [images]
      : undefined;

    const updatedProduct = await productService.updateProduct({
      productId,
      name,
      description,
      stock: stock !== undefined ? Number(stock) : undefined,
      price: price !== undefined ? Number(price) : undefined,
      discount: discount !== undefined ? Number(discount) : undefined,
      isNewProduct: isNewProduct === true || isNewProduct === "true",
      sku,
      images: imagesArray,
      brand,
      category,
      sizes,
      colors,
    });


    return res.status(200).json({ message: "Product successfully update ho gaya", updatedProduct });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// delete product
module.exports.deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    const deletedProduct = await productService.deleteProduct(productId);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product Not Found !!" });
    }

    return res.status(200).json({ message: "Product Deleted Successfully" });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// add review
module.exports.addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const productId = req.params.id;
    const userId = req.user._id;

    if (!rating || !comment) {
      return res.status(400).json({ message: "Rating and comment are required." });
    }

    const review = await reviewModel.create({
      userId,
      productId,
      rating: Number(rating),
      comment
    });

    return res.status(201).json({ success: true, message: "Review added successfully", review });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

// get product reviews
module.exports.getProductReviews = async (req, res) => {
  try {
    const productId = req.params.id;
    const reviews = await reviewModel.find({ productId, isApproved: true }).populate('userId', 'fullname email profilePic').sort({ createdAt: -1 });
    return res.status(200).json({ success: true, reviews });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

// get recommendations
module.exports.getRecommendations = async (req, res) => {
  try {
    const productId = req.params.id;
    const recommendations = await productService.getRecommendedProducts(productId);
    return res.status(200).json({ success: true, products: recommendations });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

// Smart Search
module.exports.smartSearch = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(200).json({ success: true, products: [] });
    
    const products = await productService.smartSearch(q);
    return res.status(200).json({ success: true, products });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};
