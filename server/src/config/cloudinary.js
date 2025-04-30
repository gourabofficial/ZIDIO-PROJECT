import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';

const connectCloudinary = async () => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY,
  });
};

const storage = multer.memoryStorage();
const upload = multer({ storage });

// Keep only the working Promise-based implementation
async function handleImageUpload(file) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: 'auto' },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
    stream.end(file.buffer);  
  });
}

export { upload, handleImageUpload }; 
export default connectCloudinary;
