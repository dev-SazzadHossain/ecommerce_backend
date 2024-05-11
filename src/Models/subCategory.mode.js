import mongoose, { Schema } from "mongoose";

const subCategorySchema = new Schema(
  {
    name: {
      type: String,
      require: true,
      unique: true,
      lowercase: true,
    },
    details: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
    },
    whoCreate: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export const SubCategory = mongoose.model("SubCategory", subCategorySchema);
