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
