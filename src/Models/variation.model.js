import mongoose, { Schema } from "mongoose";

const variationSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  whoCreated: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

export const Variation = mongoose.model("Variation", variationSchema);
