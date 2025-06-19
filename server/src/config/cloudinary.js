import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

// Upload from file path (legacy - for backward compatibility)
const uploadOnCloudinary = async (localFilePath, folderName) => {
  try {
    if (!localFilePath) {
      return null;
    }

    // Check if file exists before uploading
    if (!fs.existsSync(localFilePath)) {
      throw new Error("File not found");
    }

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
      folder: folderName,
    });

    // Clean up the local file after successful upload
    try {
      fs.unlinkSync(localFilePath);
    } catch (unlinkError) {
      console.error("Failed to delete local file:", unlinkError);
    }

    return response;
  } catch (error) {
    // Clean up the local file even if upload fails
    try {
      if (fs.existsSync(localFilePath)) {
        fs.unlinkSync(localFilePath);
      }
    } catch (unlinkError) {
      console.error("Failed to delete local file after error:", unlinkError);
    }
    
    console.error("Cloudinary upload error:", error);
    throw new Error("Image upload failed: " + error.message);
  }
};

// Upload from memory buffer (recommended for production)
const uploadBufferToCloudinary = async (buffer, folderName, fileName = 'image') => {
  try {
    if (!buffer) {
      throw new Error("Buffer is required");
    }

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: "auto",
          folder: folderName,
          public_id: `${fileName}_${Date.now()}`,
        },
        (error, result) => {
          if (error) {
            console.error("Cloudinary buffer upload error:", error);
            reject(new Error("Image upload failed: " + error.message));
          } else {
            resolve(result);
          }
        }
      );

      uploadStream.end(buffer);
    });
  } catch (error) {
    console.error("Cloudinary buffer upload error:", error);
    throw new Error("Image upload failed: " + error.message);
  }
};

export const deleteFromCloudinary = async (publicId) => {
  try {
    if (!publicId) {
      return null;
    }

    return await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    throw new Error("Image delete failed");
  }
};

export { uploadOnCloudinary, uploadBufferToCloudinary };


