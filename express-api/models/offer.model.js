const mongoose = require("mongoose");

const offerSchema = mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },
    discount: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      enum: ["percentage", "fixed"],
      default: "percentage",
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    description: {
      type: String,
    },
    minCartValue: {
      type: Number,
      default: 0,
    },
    autoApply: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("offer", offerSchema);
