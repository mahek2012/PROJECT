const productService = require("../services/product.service");
const productModel = require("../models/product.model");
const userModel = require("../models/user.model");
const reviewModel = require("../models/review.model");
const aiService = require("../services/ai.service");
const notificationController = require("./notification.controller");

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

    // Increment views (Demand Analysis)
    product.views = (product.views || 0) + 1;
    await product.save();

    // Calculate Dynamic Price
    let dynamicPrice = product.price;
    let priceStatus = "stable"; // stable, dropped, increased
    let urgencyMessage = "";

    // 1. High Demand Logic (Views > 50)
    if (product.views > 50) {
      dynamicPrice *= 1.05; // +5%
      priceStatus = "increased";
      urgencyMessage = "High demand product! Price may increase soon.";
    }

    // 2. Low Stock Logic (Stock < 10)
    if (product.stock < 10 && product.stock > 0) {
      dynamicPrice *= 1.10; // +10%
      priceStatus = "increased";
      urgencyMessage = `⚡ Only ${product.stock} left at this price! Buy now.`;
    }

    // 3. Discount Logic
    if (product.discount > 0) {
      dynamicPrice *= (1 - product.discount / 100);
      priceStatus = "dropped";
      if (!urgencyMessage) urgencyMessage = "🔥 Price Dropped - Limited Time Offer!";
    }

    // Final rounding
    dynamicPrice = Math.round(dynamicPrice);

    return res.status(200).json({ 
      message: "Product Found !!", 
      product,
      dynamicPrice,
      priceStatus,
      urgencyMessage
    });
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

    const product = await productModel.findById(productId);
    const oldPrice = product.price;
    const oldStock = product.stock;

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

    // AI Notification Trigger: Price Drop (Send to ALL users)
    if (updatedProduct.price < oldPrice) {
      const allUsers = await userModel.find({}, '_id');
      for (const u of allUsers) {
        await notificationController.createNotification({
          userId: u._id,
          title: "💰 Price Drop Alert!",
          message: `${updatedProduct.name} price dropped from ₹${oldPrice} to ₹${updatedProduct.price}`,
          type: "price_drop",
          productId: updatedProduct._id,
          link: `/product/${updatedProduct._id}`
        });
      }
    }

    // AI Notification Trigger: Stock Alert (Send to Admin)
    if (updatedProduct.stock < 5 && oldStock >= 5) {
      const admins = await userModel.find({ role: 'admin' }, '_id');
      for (const adm of admins) {
        await notificationController.createNotification({
          userId: adm._id,
          title: "⚡ Low Stock Alert!",
          message: `Only ${updatedProduct.stock} units left for ${updatedProduct.name}. Restock soon!`,
          type: "stock_alert",
          productId: updatedProduct._id,
          link: `/admin/inventory`
        });
      }
    }


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
// get review analysis (AI)
module.exports.getReviewAnalysis = async (req, res) => {
  try {
    const productId = req.params.id;
    const reviews = await reviewModel.find({ productId, isApproved: true });
    
    const analysis = await aiService.analyzeReviews(reviews);
    
    return res.status(200).json({ success: true, analysis });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Admin: Inventory Insights (AI)
module.exports.getInventoryInsights = async (req, res) => {
  try {
    const allProducts = await productModel.find({});
    
    // 1. Low Stock Alerts (< 10)
    const lowStock = allProducts.filter(p => p.stock < 10);
    
    // 2. Fast Selling (Top 5 by soldQuantity)
    const fastSelling = [...allProducts]
      .sort((a, b) => (b.soldQuantity || 0) - (a.soldQuantity || 0))
      .slice(0, 5);
      
    // 3. Reorder Suggestions
    const reorderSuggestions = allProducts
      .filter(p => p.stock < 15)
      .map(p => {
        const salesSpeed = (p.soldQuantity || 1) / 30; // assume 30 days
        const daysRemaining = Math.round(p.stock / (salesSpeed || 1));
        return {
          productId: p._id,
          name: p.name,
          currentStock: p.stock,
          daysRemaining: daysRemaining < 0 ? 0 : daysRemaining,
          priority: daysRemaining < 5 ? "High" : "Medium"
        };
      })
      .sort((a, b) => a.daysRemaining - b.daysRemaining)
      .slice(0, 5);

    return res.status(200).json({ 
      success: true, 
      inventory: {
        lowStock,
        fastSelling,
        reorderSuggestions
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Generate Description (AI)
module.exports.generateDescription = async (req, res) => {
  try {
    const { name, category, brand } = req.body;
    if (!name || !category) {
      return res.status(400).json({ success: false, message: "Product name and category are required" });
    }

    const description = await aiService.generateProductDescription({ name, category, brand });
    return res.status(200).json({ success: true, description });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
