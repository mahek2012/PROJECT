const mongoose = require("mongoose");

const categorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
    },
    image: {
      type: String,
    },
    icon: {
      type: String,
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "category",
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },

  },
  { timestamps: true }
);

module.exports = mongoose.model("category", categorySchema);
