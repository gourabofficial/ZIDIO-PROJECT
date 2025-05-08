import { Product } from "../model/product.model.js";
import { handleImageUpload } from "../config/cloudinary.js";
import { Collection } from "../model/collection.model.js";


export const addProduct = async (req, res) => {
  try {
    const { name, description, price, category, size, isNewArrival, isTranding, isHotItem, collections, offerStatus, discount } = req.body;
    
    // Get user ID from Clerk auth context
    const userId = req.auth.userId;
    

    
    if (!userId)
    
    {
      return res.status(400).json({ message: "User id is required" });
    }
    
    // Upload images to Cloudinary (if files exist)
    let images = [];
    if (req.files && req.files.length > 0) {
      const imagePromises = req.files.map(file => handleImageUpload(file));
      const uploadedImages = await Promise.all(imagePromises);
      
      // Format images using Cloudinary response
      images = uploadedImages.map(image => ({
        imageUrl: image.secure_url,
        imageId: image.public_id
      }));
    }

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
      discount,
      userId  // Add the userId here
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
    const { id } = req.params;
    const { 
      name, 
      description, 
      price, 
      category, 
      size, 
      isNewArrival, 
      isTranding, 
      isHotItem, 
      collections, 
      offerStatus, 
      discount 
    } = req.body;
    
    // Check if product exists
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    
    // Create update object with existing fields
    const updateData = {
      name: name || product.name,
      description: description || product.description,
      price: price || product.price,
      category: category || product.category,
      size: size || product.size,
      isNewArrival: isNewArrival !== undefined ? isNewArrival : product.isNewArrival,
      isTranding: isTranding !== undefined ? isTranding : product.isTranding,
      isHotItem: isHotItem !== undefined ? isHotItem : product.isHotItem,
      collections: collections || product.collections,
      offerStatus: offerStatus !== undefined ? offerStatus : product.offerStatus,
      discount: discount !== undefined ? discount : product.discount
    };
    
    // Handle image upload if new images are provided
    if (req.files && req.files.length > 0) {
      const imagePromises = req.files.map(file => handleImageUpload(file));
      const uploadedImages = await Promise.all(imagePromises);
      
      // Format new images
      const newImages = uploadedImages.map(image => ({
        imageUrl: image.secure_url,
        imageId: image.public_id
      }));
      
      // Add new images to existing ones
      updateData.images = [...product.images, ...newImages];
    }
    
    // Update the product
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );
    
    res.status(200).json({ 
      message: "Product updated successfully", 
      product: updatedProduct 
    });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export const removeProduct = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if product exists
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    
    // Remove product
    await Product.findByIdAndDelete(id);
    
    // Remove product reference from collections
    await Collection.updateMany(
      { products: id },
      { $pull: { products: id } }
    );
    
    res.status(200).json({ message: "Product removed successfully" });
  } catch (error) {
    console.error("Error removing product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export const addCollection = async (req, res) => {
  try {
    
  } catch (error) {
    
  }
}