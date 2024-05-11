import mongoose, { Schema } from "mongoose";

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    productFeaturedImage: {
      type: String,
      required: true,
    },
    thumbnail: [
      {
        type: String,
        required: true,
      },
    ],
    details: {
      type: String,
      required: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
    },
    whoCreated: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    slug: {
      type: String,
      required: true,
    },
    inventory: [
      {
        type: Schema.Types.ObjectId,
        ref: "Inventory",
      },
    ],
  },
  { timestamps: true }
);

export const Product = mongoose.model("Product", productSchema);
