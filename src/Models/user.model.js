import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      lowercase: true,
    },
    lastName: {
      type: String,
      required: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
    },
    addressOne: {
      type: String,
      required: true,
    },
    addressTwo: {
      type: String,
    },
    city: {
      type: String,
      required: true,
      enum: [
        "dhaka",
        "barishal",
        "khulna",
        "chittagong",
        "rajshahi",
        "sylhet",
        "rangpur",
        "comilla",
        "narayanganj",
        "gazipur",
      ],
    },
    postCode: {
      type: String,
      required: true,
    },
    division: {
      type: String,
      required: true,
    },
    district: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: ["user", "admin", "editor"],
      default: "user",
    },
    isVerified: {
      type: Boolean,
      required: true,
      enum: [true, false],
      default: false,
    },
    verifyOtp: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

//* password hashing and save password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});
//* password hashing and save password

//* Check password correct
userSchema.methods.isPasswordCorrect = async function (password) {
  if (!password) {
    return false;
  }
  const response = await bcrypt.compare(password, this.password);
  return response;
};
//* Check password correct

// * accessToken generate
userSchema.methods.generateAccessToken = async function () {
  const response = await jwt.sign(
    {
      _id: this?._id,
      firstName: this?.firstName,
      lastName: this?.lastName,
      email: this?.email,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
  return response;
};
// * accessToken generate

// * refreshToken generate
userSchema.methods.generateRefreshToken = async function () {
  const response = await jwt.sign(
    { _id: this?.id, email: this?.email },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
  );
  return response;
};
// * refreshToken generate

export const User = mongoose.model("User", userSchema);
