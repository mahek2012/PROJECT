const productModel = require("../models/product.model");

// create product
module.exports.createProduct = async ({
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
}) => {
  if (
    !name ||
    !description ||
    !stock ||
    !price ||
    !sku ||
    !images ||
    !brand ||
    !category
  ) {
    throw new Error("All Feild Are Required !!");
  }

  let product = await productModel.create({
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
  });

  return product;
};

// get single product
module.exports.singleProduct = async (id) => {
  const product = await productModel.findOne({ _id: id });

  return product;
};

// all product
module.exports.AllProduct = async () => {
  return await productModel.find();
};

// update product
module.exports.updateProduct = async ({
  productId,
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
}) => {
  const updatedProduct = await productModel.findOneAndUpdate(
    { _id: productId },
    {
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
    },
    { new: true },
  );


  if (!updatedProduct) {
    throw new Error("Product not Found");
  }

  return updatedProduct;
};

// delete product
module.exports.deleteProduct = async (id) => {
  return await productModel.findOneAndDelete({ _id: id });
};

// get smart recommendations
module.exports.getRecommendedProducts = async (productId) => {
  // 1. Get current product details
  const currentProduct = await productModel.findById(productId);
  if (!currentProduct) return [];

  // 2. Find products in same category
  // 3. Match keywords in name (basic AI behavior)
  const keywords = currentProduct.name.split(' ').filter(word => word.length > 3);
  
  const recommendations = await productModel.find({
    _id: { $ne: productId }, // Exclude current product
    $or: [
      { category: currentProduct.category },
      { name: { $regex: keywords.join('|'), $options: 'i' } }
    ]
  }).limit(8);

  return recommendations;
};

// Smart Search with Intent Parsing and Typo Correction
module.exports.smartSearch = async (query) => {
  const text = query.toLowerCase();
  
  // 1. Basic Typo Mapping (Common e-commerce typos)
  const typoMap = {
    'shooes': 'shoes',
    'shose': 'shoes',
    'tshrt': 't-shirt',
    'tshert': 't-shirt',
    'pnt': 'pant',
    'dres': 'dress',
    'frock': 'dress',
    'mobail': 'mobile',
    'phne': 'phone',
    'electrnic': 'electronic'
  };

  let cleanedQuery = text;
  Object.keys(typoMap).forEach(typo => {
    cleanedQuery = cleanedQuery.replace(new RegExp(typo, 'g'), typoMap[typo]);
  });

  // 2. Intent Parsing
  let mongoQuery = {};
  
  // Price Intent (e.g., "under 1000", "below 500")
  const priceMatch = cleanedQuery.match(/(?:under|below|less than|se kam)\s*(\d+)/i);
  if (priceMatch) {
    mongoQuery.price = { $lte: parseInt(priceMatch[1]) };
    cleanedQuery = cleanedQuery.replace(priceMatch[0], '').trim();
  }

  // Color Intent (Common colors)
  const colors = ['black', 'white', 'red', 'blue', 'green', 'yellow', 'pink', 'grey', 'gray'];
  const colorMatch = colors.find(color => cleanedQuery.includes(color));
  if (colorMatch) {
    mongoQuery.$or = mongoQuery.$or || [];
    mongoQuery.$or.push({ colors: { $regex: colorMatch, $options: 'i' } });
    mongoQuery.$or.push({ name: { $regex: colorMatch, $options: 'i' } });
    cleanedQuery = cleanedQuery.replace(colorMatch, '').trim();
  }

  // 3. Final Search on Remaining Keywords
  if (cleanedQuery) {
    mongoQuery.$or = mongoQuery.$or || [];
    mongoQuery.$or.push({ name: { $regex: cleanedQuery, $options: 'i' } });
    mongoQuery.$or.push({ category: { $regex: cleanedQuery, $options: 'i' } });
    mongoQuery.$or.push({ brand: { $regex: cleanedQuery, $options: 'i' } });
    mongoQuery.$or.push({ description: { $regex: cleanedQuery, $options: 'i' } });
  }

  const products = await productModel.find(mongoQuery).limit(20);
  return products;
};
