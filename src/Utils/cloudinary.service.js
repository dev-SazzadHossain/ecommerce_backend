import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.COLUDINAEY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

const cloudinaryService = async (localPath) => {
  try {
    if (localPath) {
      const response = await cloudinary.uploader.upload(localPath, {
        resource_type: "auto",
      });
      // *remove localPath
      if (fs.existsSync(localPath)) {
        fs.unlinkSync(localPath);
      }
      return response;
    }
  } catch (error) {
    if (fs.existsSync(localPath)) {
      fs.unlinkSync(localPath);
    }
    console.log(`cloudinary upload error:${error.message}`);
  }
};

export default cloudinaryService;
