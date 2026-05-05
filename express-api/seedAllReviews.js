const mongoose = require('mongoose');
const productModel = require('./models/product.model');
const reviewModel = require('./models/review.model');

const MONGO_URL = "mongodb://127.0.0.1:27017/rest-apis";
const USER_ID = "69f2d0a3895ba628e3460e4c";

async function seedAllProducts() {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("Connected to MongoDB");

    const allProducts = await productModel.find({});
    console.log(`Found ${allProducts.length} total products`);

    let totalAdded = 0;
    for (const product of allProducts) {
      // Check if product already has reviews
      const existingCount = await reviewModel.countDocuments({ productId: product._id });
      
      if (existingCount === 0) {
        const reviewsToCreate = [
          {
            userId: USER_ID,
            productId: product._id,
            rating: 5,
            comment: `This ${product.category} item is fantastic! I've been using it for a week and the quality is amazing. Truly a great purchase.`,
            isApproved: true
          },
          {
            userId: USER_ID,
            productId: product._id,
            rating: 4,
            comment: `Overall a good experience. The ${product.brand} brand never disappoints. Just wish the shipping was slightly faster.`,
            isApproved: true
          }
        ];
        
        await reviewModel.insertMany(reviewsToCreate);
        totalAdded += 2;
      }
    }

    console.log(`Successfully added reviews for all products! Total new reviews: ${totalAdded}`);
    process.exit();
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
}

seedAllProducts();
