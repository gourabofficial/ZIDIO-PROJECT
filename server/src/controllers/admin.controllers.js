import { Product } from "../model/product.model.js";
import { handleImageUpload } from "../config/cloudinary.js";
import { Collection } from "../model/collection.model.js";


export const addProduct = async (req, res) => {
  try {
    const { name, description, price, category, size, isNewArrival, isTranding, isHotItem, collections, offerStatus, discount } = req.body;
    
    // Upload images to Cloudinary
    const imagePromises = req.files.map(file => handleImageUpload(file));
    const uploadedImages = await Promise.all(imagePromises);
    
    // Format images using Cloudinary response
    const images = uploadedImages.map(image => ({
      imageUrl: image.secure_url,
      imageId: image.public_id
    }));

    const newProduct = new Product({
      name,
      description,
      price,
      images,
      category,
      size,
      isNewArrival,
      isTranding,
      isHotItem,
      collections,
      offerStatus,
      discount
    });

    await newProduct.save();
    res.status(201).json({ message: "Product added successfully", product: newProduct });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export const updateProduct = async (req, res) => {
  try {
    
  } catch (error) {
    
  }
}

export const addCollection = async (req, res) => {
  try {
    
  } catch (error) {
    
  }
}