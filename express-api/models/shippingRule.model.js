const mongoose = require("mongoose");

const shippingRuleSchema = mongoose.Schema(
  {
    zoneName: {
      type: String,
      required: true,
    },
    regions: [String], // Countries, States, or Cities
    deliveryTime: {
      type: String,
      default: "3-5 Business Days"
    },
    chargeType: {
      type: String,
      enum: ["flat", "weight_based", "distance_based"],
      default: "flat",
    },
    baseCharge: {
      type: Number,
      required: true,
    },
    freeShippingThreshold: {
      type: Number,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("shippingRule", shippingRuleSchema);
