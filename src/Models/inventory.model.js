import mongoose, { Schema } from "mongoose";

const inventorySchema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: "Product",
  },
  buyPrice: {
    type: Number,
    required: true,
  },
  sellPrice: {
    type: Number,
    required: true,
  },
  discountPrice: {
    type: Number,
  },
  discountPercentage: {
    type: Number,
  },
  quantity: {
    type: Number,
    required: true,
    default: 1,
  },
  inStock: {
    type: Number,
    required: true,
  },
  variation: {
    type: Schema.Types.ObjectId,
    ref: "Variation",
  },
});

export const Inventory = mongoose.model("Inventory", inventorySchema);
