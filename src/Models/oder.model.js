import mongoose, { Schema } from "mongoose";

const oderSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    inventory: {
      type: Schema.Types.ObjectId,
      ref: "Inventory",
    },
  },
  { timestamps: true }
);

export const Oder = mongoose.model("Oder", oderSchema);
