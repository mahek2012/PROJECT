const categoryModel = require("../models/category.model");

module.exports.createCategory = async (data) => {
  const { name, description, image, icon, parent } = data;
  if (!name) {
    throw new Error("Name is required");
  }

  const category = await categoryModel.create({
    name,
    description,
    image,
    icon,
    parent: parent || null,
  });

  return category;
};

module.exports.getAllCategories = async () => {
  return await categoryModel.find().populate("parent", "name");
};

module.exports.updateCategory = async (id, data) => {
  const updatedCategory = await categoryModel.findByIdAndUpdate(id, data, {
    new: true,
  });
  if (!updatedCategory) {
    throw new Error("Category not found");
  }
  return updatedCategory;
};

module.exports.deleteCategory = async (id) => {
  const deletedCategory = await categoryModel.findByIdAndDelete(id);
  if (!deletedCategory) {
    throw new Error("Category not found");
  }
  return deletedCategory;
};
