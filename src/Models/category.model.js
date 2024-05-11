import mongoose, { Schema } from "mongoose";

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
    },
    details: {
      type: String,
      required: true,
    },
    categoryImage: {
      type: String, //TODO: cloudinary url
      required: true,
    },
    slug: {
      type: String,
      unique: true,
    },
    whoCreated: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export const Category = mongoose.model("Category", categorySchema);
