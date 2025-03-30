import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import logger from "./logger";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath: string) => {
  console.log(
    process.env.CLOUDINARY_CLOUD_NAME,
    process.env.CLOUDINARY_API_KEY,
    process.env.CLOUDINARY_API_SECRET
  );
  try {
    if (!localFilePath) {
      logger.warn("No local file path provided to uploadOnCloudinary");
      return null;
    }
    if (!fs.existsSync(localFilePath)) {
      logger.error(`File not found at path: ${localFilePath}`);
      return null;
    }
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    logger.info("File uploaded successfully. response url: " + response.url);
    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    if (localFilePath && fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }
    logger.error("error occured", error);
    return null;
  }
};

const deleteFromCloudinary = async (publicID: string) => {
  if (!publicID) {
    logger.warn("No public ID provided for deletion");
    return;
  }
  try {
    const result = await cloudinary.uploader.destroy(publicID);
    logger.info(`Deleted from Cloudinary. Public ID: ${publicID}`, result);
  } catch (error) {
    logger.error("error occured", error);
    throw error;
  }
};

export { uploadOnCloudinary, deleteFromCloudinary };
