import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import fs from "fs";
dotenv.config();
const uploadOnCloudinary = async (file) => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  try {
    const result = await cloudinary.uploader.upload(file, {
      folder: "GrubGo",
    });
    fs.unlinkSync(file); // Remove file from local uploads folder
    return result.secure_url;
  } catch (error) {
    fs.unlinkSync(file); // Remove file from local uploads folder
    console.error("Error uploading to Cloudinary:", error);
  }
};

export default uploadOnCloudinary;
