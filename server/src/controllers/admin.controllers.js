import { uploadOnCloudinary } from "../config/cloudinary.js";
import { Product } from "../model/product.model.js";
import { HomeContent } from "../model/homeContent.model.js";
import { v4 as uuidv4 } from "uuid";
import mongoose from "mongoose";

export const addProduct = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
        success: false,
      });
    }

    const { name, description, price, category, discount, size, offerStatus } =
      req.body;
    if (!name || !description || !price || !category) {
      return res.status(400).json({
        message: "Please provide all required fields",
        success: false,
      });
    }

    // Upload images to Cloudinary
    const imageUrls = [];
    const cloudinaryFolder = "products";

    // If there are files to upload
    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map((file) =>
        uploadOnCloudinary(file.path, cloudinaryFolder)
      );

      // Wait for all uploads to complete
      const uploadResults = await Promise.all(uploadPromises);

      // Extract image URLs and other details
      uploadResults.forEach((result) => {
        if (result) {
          imageUrls.push({
            url: result.secure_url,
            public_id: result.public_id,
            width: result.width,
            height: result.height,
          });
        }
      });
    }

    // format properly images url and ids
    const formattedImages = imageUrls.map((image) => ({
      imageUrl: image.url,
      imageId: image.public_id,
    }));

    // Create unique product_id using UUID
    const product_id = uuidv4();

    // product creation with product_id instead of id
    const newProduct = await Product.create({
      product_id,
      name,
      description,
      price,
      category,
      discount,
      size,
      offerStatus,
      images: formattedImages,
    });

    if (!newProduct) {
      return res.status(500).json({
        message: "Failed to create product",
        success: false,
      });
    }

    console.log("New product created:", newProduct);

    return res.status(201).json({
      message: "Product created successfully",
      success: true,
      product: {
        _id: newProduct._id,
        product_id: newProduct.product_id,
        name: newProduct.name
      }
    });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add product",
      error: error.message,
    });
  }
};

export const updateHomeContent = async (req, res) => {
  try {
    const { newArrivals, hotItems, trendingItems } = req.body;

    // Check if at least one field is provided and is a valid array
    if (
      (!newArrivals ||
        !Array.isArray(newArrivals) ||
        newArrivals.length === 0) &&
      (!hotItems || !Array.isArray(hotItems) || hotItems.length === 0) &&
      (!trendingItems ||
        !Array.isArray(trendingItems) ||
        trendingItems.length === 0)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Please provide at least one field with valid product IDs to update",
      });
    }

    // Allow both MongoDB ObjectIDs and product_id strings
    const allIds = [
      ...(newArrivals || []),
      ...(hotItems || []),
      ...(trendingItems || []),
    ];
    
    // Check for invalid MongoDB ObjectIDs (only for IDs that look like they should be ObjectIDs)
    const potentialObjectIds = allIds.filter(id => /^[0-9a-fA-F]{24}$/.test(id));
    const invalidIds = potentialObjectIds.filter(
      (id) => !mongoose.Types.ObjectId.isValid(id)
    );

    if (invalidIds.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID format detected",
        invalidIds,
      });
    }

    // Check if products exist - by _id or product_id
    const uniqueIds = [...new Set(allIds)];
    const existingProductsByObjectId = await Product.find({ 
      _id: { $in: uniqueIds.filter(id => mongoose.Types.ObjectId.isValid(id)) } 
    });
    
    const existingProductsByProductId = await Product.find({ 
      product_id: { $in: uniqueIds } 
    });
    
    const existingProducts = [...existingProductsByObjectId, ...existingProductsByProductId];
    const foundIds = [
      ...existingProductsByObjectId.map(p => p._id.toString()), 
      ...existingProductsByProductId.map(p => p.product_id)
    ];
    
    // Check if all IDs were found
    if (new Set(foundIds).size !== new Set(uniqueIds).size) {
      const nonExistentIds = uniqueIds.filter(id => !foundIds.includes(id));
      
      return res.status(404).json({
        success: false,
        message: "Some product IDs do not exist in the database",
        nonExistentIds,
      });
    }

    let homeContent = await HomeContent.findOne();

    if (!homeContent) {
      homeContent = await HomeContent.create({
        newArrival: [],
        hotItems: [],
        trandingItems: [],
      });
    }

    // Helper function to add products to a collection
    const addProductsToCollection = (productIds, collection) => {
      // Get existing product IDs
      const existingIds = collection.map(item => 
        item.productId ? item.productId.toString() : item.product_id
      );
      
      // Filter out IDs that already exist
      const newIds = productIds.filter(id => !existingIds.includes(id));
      
      // Create entries for each ID, handling both ObjectID and product_id formats
      const newEntries = newIds.map(id => {
        if (mongoose.Types.ObjectId.isValid(id)) {
          return { productId: id };
        } else {
          return { product_id: id, productId: existingProductsByProductId.find(p => p.product_id === id)?._id };
        }
      });
      
      // Add new entries to the collection
      collection.push(...newEntries);
    };

    // Apply changes to each collection
    if (newArrivals && Array.isArray(newArrivals)) {
      addProductsToCollection(newArrivals, homeContent.newArrival);
    }

    if (hotItems && Array.isArray(hotItems)) {
      addProductsToCollection(hotItems, homeContent.hotItems);
    }

    if (trendingItems && Array.isArray(trendingItems)) {
      addProductsToCollection(trendingItems, homeContent.trandingItems);
    }

    await homeContent.save();

    return res.status(200).json({
      success: true,
      message: "Home content updated successfully",
    });
  } catch (error) {
    console.error("Error updating home content:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update home content",
      error: error.message,
    });
  }
};

export const getHomeContent = async (req, res) => {
  try {
    let homeContent = await HomeContent.findOne()
      .populate({
        path: "newArrival.productId",
        model: "Product",
        select: "_id product_id name description price images category size offerStatus discount"
      })
      .populate({
        path: "hotItems.productId",
        model: "Product",
        select: "_id product_id name description price images category size offerStatus discount"
      })
      .populate({
        path: "trandingItems.productId",
        model: "Product",
        select: "_id product_id name description price images category size offerStatus discount"
      });
    
    console.log("Home content:", homeContent);

    if (!homeContent) {
      homeContent = await HomeContent.create({
        newArrival: [],
        hotItems: [],
        trandingItems: [],
      });
    }

    // Transform the response to include product_id
    const transformProduct = (item) => {
      if (!item || !item.productId) return null;
      return {
        ...item.productId._doc,
        id: item.productId.product_id || item.productId._id
      };
    };

    const response = {
      newArrivals: homeContent.newArrival.map(transformProduct).filter(Boolean),
      hotItems: homeContent.hotItems.map(transformProduct).filter(Boolean),
      trendingItems: homeContent.trandingItems.map(transformProduct).filter(Boolean)
    };

    return res.status(200).json({
      success: true,
      message: "Home content fetched successfully",
      data: response,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to get home content",
      error: error.message,
    });
  }
};
