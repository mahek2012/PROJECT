const mongoose = require('mongoose');
const productModel = require('./models/product.model');
const reviewModel = require('./models/review.model');

const MONGO_URL = "mongodb://127.0.0.1:27017/rest-apis";
const USER_ID = "69f2d0a3895ba628e3460e4c";

async function seedReviews() {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("Connected to MongoDB");

    const categories = await productModel.distinct('category');
    console.log(`Found ${categories.length} categories`);

    for (const cat of categories) {
      // Find a product in this category
      const product = await productModel.findOne({ category: cat });
      if (product) {
        // Add 2-3 reviews for this product
        const reviewsToCreate = [
          {
            userId: USER_ID,
            productId: product._id,
            rating: 5,
            comment: `Amazing ${cat} product! The quality is top notch and it's definitely value for money. Highly recommended.`,
            isApproved: true
          },
          {
            userId: USER_ID,
            productId: product._id,
            rating: 4,
            comment: `Good product, but the delivery was a bit slow. Overall satisfied with the performance.`,
            isApproved: true
          }
        ];

        // Add a negative one for some variety
        if (Math.random() > 0.5) {
          reviewsToCreate.push({
            userId: USER_ID,
            productId: product._id,
            rating: 2,
            comment: `The size was a bit small for me. Quality is okay but could be better.`,
            isApproved: true
          });
        }

        await reviewModel.insertMany(reviewsToCreate);
        console.log(`Added reviews for product: ${product.name} (${cat})`);
      }
    }

    console.log("Seeding completed successfully!");
    process.exit();
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
}

seedReviews();
