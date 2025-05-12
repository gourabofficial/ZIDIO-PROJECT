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

    // console.log("Image URLs:", imageUrls);

    // format properly images url and ids
    const formattedImages = imageUrls.map((image) => ({
      imageUrl: image.url,
      imageId: image.public_id,
    }));

    // id creation
    const id = uuidv4();

    // product creation
    const newPorduct = await Product.create({
      id,
      name,
      description,
      price,
      category,
      discount,
      size,
      offerStatus,
      images: formattedImages,
    });

    if (!newPorduct) {
      return res.status(500).json({
        message: "Failed to create product",
        success: false,
      });
    }

    console.log("New product created:", newPorduct);

    return res.status(201).json({
      message: "Product created successfully",
      success: true,
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

    // Validate MongoDB ObjectIDs and check products exist
    const allIds = [
      ...(newArrivals || []),
      ...(hotItems || []),
      ...(trendingItems || []),
    ];
    const invalidIds = allIds.filter(
      (id) => !mongoose.Types.ObjectId.isValid(id)
    );

    if (invalidIds.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID format detected",
        invalidIds,
      });
    }

    // Check if products exist
    const uniqueIds = [...new Set(allIds)];
    const existingProducts = await Product.find({ _id: { $in: uniqueIds } });

    if (existingProducts.length !== uniqueIds.length) {
      const foundIds = existingProducts.map((p) => p._id.toString());
      const nonExistentIds = uniqueIds.filter((id) => !foundIds.includes(id));

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

    // Append new product IDs to existing arrays (no duplicates)
    if (newArrivals && Array.isArray(newArrivals)) {
      // Get existing product IDs
      const existingIds = homeContent.newArrival.map((item) =>
        item.productId.toString()
      );
      // Filter out IDs that already exist
      const newIds = newArrivals.filter((id) => !existingIds.includes(id));
      // Add new items to the array
      homeContent.newArrival.push(...newIds.map((id) => ({ productId: id })));
    }

    if (hotItems && Array.isArray(hotItems)) {
      const existingIds = homeContent.hotItems.map((item) =>
        item.productId.toString()
      );
      const newIds = hotItems.filter((id) => !existingIds.includes(id));
      homeContent.hotItems.push(...newIds.map((id) => ({ productId: id })));
    }

    if (trendingItems && Array.isArray(trendingItems)) {
      const existingIds = homeContent.trandingItems.map((item) =>
        item.productId.toString()
      );
      const newIds = trendingItems.filter((id) => !existingIds.includes(id));
      homeContent.trandingItems.push(
        ...newIds.map((id) => ({ productId: id }))
      );
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
        select: "_id id name description price images category size offerStatus discount" // Added id field
      })
      .populate({
        path: "hotItems.productId",
        model: "Product",
        select: "_id id name description price images category size offerStatus discount" // Added id field
      })
      .populate({
        path: "trandingItems.productId",
        model: "Product",
        select: "_id id name description price images category size offerStatus discount" // Added id field
      });
    
    console.log("Home content:", homeContent);

    if (!homeContent) {
      homeContent = await HomeContent.create({
        newArrival: [],
        hotItems: [],
        trandingItems: [],
      });
    }

    const response = {
      newArrivals: homeContent.newArrival.map(item => item.productId),
      hotItems: homeContent.hotItems.map(item => item.productId),
      trendingItems: homeContent.trandingItems.map(item => item.productId)
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
