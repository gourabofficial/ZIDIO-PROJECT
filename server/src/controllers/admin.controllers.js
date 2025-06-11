import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../config/cloudinary.js";
import { Product } from "../model/product.model.js";
import { HomeContent } from "../model/homeContent.model.js";
import { Inventory } from "../model/inventory.model.js";
import { v4 as uuidv4 } from "uuid";
import mongoose from "mongoose";
import { User } from "../model/user.model.js";
import { Order } from "../model/order.model.js";
import { Cart } from "../model/cart.model.js";
import { Address } from "../model/address.model.js";
import { ProductReview } from "../model/review.model.js";
import { clerkClient } from '@clerk/clerk-sdk-node';

// Utility function to restore stock for cancelled orders
const restoreStockForOrder = async (orderProducts) => {
  try {
    for (const item of orderProducts) {
      const inventory = await Inventory.findOne({ productId: item.productId });
      
      if (inventory) {
        // Find the specific size stock entry
        const sizeStock = inventory.stocks.find(stock => stock.size === item.selectedSize);
        
        if (sizeStock) {
          // Restore the stock
          sizeStock.quantity += item.quantity;
          
          // Recalculate total quantity
          inventory.totalQuantity = inventory.stocks.reduce((total, stock) => total + stock.quantity, 0);
          
          // Save the updated inventory
          await inventory.save();
          
          console.log(`Stock restored for product ${item.productId}, size ${item.selectedSize}: ${item.quantity} units`);
        }
      } else {
        console.error(`Inventory not found for product ${item.productId}`);
      }
    }
  } catch (error) {
    console.error('Error restoring stock:', error);
  }
};



export const addProduct = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
        success: false,
      });
    }

    const {
      name,
      description,
      price,
      category,
      collections,
      discount,
      size,
      offerStatus,
    } = req.body;
    console.log("Request body:", req.body);
    if (!name || !description || !price || !category || !collections) {
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
      collections,
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

    // Create inventory for the product with default quantity 1 for all sizes
    const inventoryStocks = size.map((productSize) => ({
      size: productSize,
      quantity: 1,
    }));

    // Calculate total quantity from stocks
    const totalQuantity = inventoryStocks.reduce((total, stock) => total + stock.quantity, 0);

    const newInventory = await Inventory.create({
      productId: newProduct._id,
      stocks: inventoryStocks,
      totalQuantity: totalQuantity,
    });

    console.log("New product created:", newProduct);
    console.log("New inventory created:", newInventory);

    return res.status(201).json({
      message: "Product created successfully",
      success: true,
      product: {
        _id: newProduct._id,
        product_id: newProduct.product_id,
        name: newProduct.name,
      },
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
    const potentialObjectIds = allIds.filter((id) =>
      /^[0-9a-fA-F]{24}$/.test(id)
    );
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
      _id: {
        $in: uniqueIds.filter((id) => mongoose.Types.ObjectId.isValid(id)),
      },
    });

    const existingProductsByProductId = await Product.find({
      product_id: { $in: uniqueIds },
    });

    const existingProducts = [
      ...existingProductsByObjectId,
      ...existingProductsByProductId,
    ];
    const foundIds = [
      ...existingProductsByObjectId.map((p) => p._id.toString()),
      ...existingProductsByProductId.map((p) => p.product_id),
    ];

    // Check if all IDs were found
    if (new Set(foundIds).size !== new Set(uniqueIds).size) {
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

    // Helper function to convert IDs to the right format for storage
    const formatProductIds = (productIds) => {
      if (!productIds || !Array.isArray(productIds)) return [];

      return productIds.map((id) => {
        if (mongoose.Types.ObjectId.isValid(id)) {
          return { productId: id };
        } else {
          // Find the corresponding ObjectId for the product_id
          const product = existingProductsByProductId.find(
            (p) => p.product_id === id
          );
          return { product_id: id, productId: product?._id };
        }
      });
    };

    // Replace existing collections with new ones
    if (newArrivals && Array.isArray(newArrivals)) {
      homeContent.newArrival = formatProductIds(newArrivals);
    }

    if (hotItems && Array.isArray(hotItems)) {
      homeContent.hotItems = formatProductIds(hotItems);
    }

    if (trendingItems && Array.isArray(trendingItems)) {
      homeContent.trandingItems = formatProductIds(trendingItems);
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
        select:
          "_id product_id name description price images category size offerStatus discount",
      })
      .populate({
        path: "hotItems.productId",
        model: "Product",
        select:
          "_id product_id name description price images category size offerStatus discount",
      })
      .populate({
        path: "trandingItems.productId",
        model: "Product",
        select:
          "_id product_id name description price images category size offerStatus discount",
      });

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
        id: item.productId.product_id || item.productId._id,
      };
    };

    const response = {
      newArrivals: homeContent.newArrival.map(transformProduct).filter(Boolean),
      hotItems: homeContent.hotItems.map(transformProduct).filter(Boolean),
      trendingItems: homeContent.trandingItems
        .map(transformProduct)
        .filter(Boolean),
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

//
export const getAllSearchProducts = async (req, res) => {
  try {
    // Check if the user is authenticated
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
        success: false,
      });
    }

    // Extract pagination parameters with defaults
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Accept either 'query' or 'search' parameter for compatibility
    const searchTerm = req.query.query || req.query.search || "";
    let filter = {};

    // If search term is provided, create a search filter for name and product_id only
    if (searchTerm && searchTerm.trim() !== "") {
      const searchRegex = new RegExp(searchTerm, "i");
      filter = {
        $or: [{ name: searchRegex }, { product_id: searchRegex }],
      };
    }

    // Count total results for pagination info
    const totalProducts = await Product.countDocuments(filter);

    
    // Fetch paginated results with only required fields
    const products = await Product.find(filter)
      .select("name product_id images price category discount")
      .skip(skip)
      .limit(limit);

    // Format the response to include only name and first image
    const formattedProducts = products.map((product) => ({
      _id: product._id,
      product_id: product.product_id,
      name: product.name,
      price: product.price,
      category: product.category,
      discount: product.discount,
      image:
        product.images && product.images.length > 0
          ? product.images[0].imageUrl
          : null,
    }));

    // Pagination information
    const totalPages = Math.ceil(totalProducts / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    res.status(200).json({
      success: true,
      count: formattedProducts.length,
      pagination: {
        totalProducts,
        totalPages,
        currentPage: page,
        hasNextPage,
        hasPrevPage,
      },
      products: formattedProducts,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch products",
      error: error.message,
    });
  }
};

//return image and title and input productId of the product
export const getProductsbyMultipleIds = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
        success: false,
      });
    }
    const { productIds } = req.body;

    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide an array of product IDs",
      });
    }

    // Check if ids are valid MongoDB ObjectIDs
    const validMongoIds = productIds.filter((id) =>
      mongoose.Types.ObjectId.isValid(id)
    );

    // Query for both MongoDB _id and product_id
    const products = await Product.find({
      $or: [
        { _id: { $in: validMongoIds } },
        { product_id: { $in: productIds } },
      ],
    }).select("_id product_id name images price discount"); // Added discount field

    if (!products || products.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No products found for the provided IDs",
      });
    }

    const formattedProducts = products.map((product) => ({
      _id: product._id,
      id: product.product_id,
      name: product.name,
      price: product.price,
      discount: product.discount || 0, // Include discount and default to 0
      image:
        product.images && product.images.length > 0
          ? product.images[0].imageUrl
          : null,
    }));

    return res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      products: formattedProducts,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch products",
      error: error.message,
    });
  }
};

export const getAllSearchUsers = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
        success: false,
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const searchTerm =
      req.query.query || req.query.search || req.query.searchTerm || "";
    let filter = {};

    if (searchTerm && searchTerm.trim() !== "") {
      // Split search term into words for better matching
      const searchWords = searchTerm.trim().split(/\s+/);

      // Create regex patterns for each word
      const regexPatterns = searchWords.map((word) => new RegExp(word, "i"));

      // Build a more flexible search filter
      filter = {
        $or: [
          // Match any of the words in fullName
          { fullName: { $in: regexPatterns } },
          // Match any of the words in email
          { email: { $in: regexPatterns } },
          // Match the complete search term in fullName
          { fullName: new RegExp(searchTerm.trim(), "i") },
          // Match the complete search term in email
          { email: new RegExp(searchTerm.trim(), "i") },
        ],
      };

      // console.log("Search term:", searchTerm.trim());
      // console.log("Search filter:", JSON.stringify(filter, null, 2));
    }

    const totalUsers = await User.countDocuments(filter);
    // console.log("Total users found:", totalUsers);

    const users = await User.find(filter)
      .select("fullName email role avatar createdAt")
      .skip(skip)
      .limit(limit);

    const formattedUsers = users.map((user) => ({
      _id: user._id,
      name: user.fullName,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      createdAt: user.createdAt,
    }));

    const totalPages = Math.ceil(totalUsers / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    res.status(200).json({
      message: "Users fetched successfully",
      success: true,
      count: formattedUsers.length,
      pagination: {
        totalUsers,
        totalPages,
        currentPage: page,
        hasNextPage,
        hasPrevPage,
      },
      users: formattedUsers,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch users",
      error: error.message,
    });
  }
};
// delete product by id - comprehensive deletion from all related models
export const deleterProductById = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
        success: false,
      });
    }

    const { id } = req.params;

    // Check if the product exists by both _id and product_id
    let product;
    if (mongoose.Types.ObjectId.isValid(id)) {
      product = await Product.findById(id);
    } else {
      product = await Product.findOne({ product_id: id });
    }

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
        success: false,
      });
    }

    const productObjectId = product._id;
    const productStringId = product.product_id;

    // Keep track of deletion operations
    const deletionResults = {
      product: false,
      inventory: false,
      cartItems: 0,
      orderItems: 0,
      reviews: 0,
      homeContentReferences: 0,
      wishlistReferences: 0,
      cloudinaryImages: 0,
      errors: []
    };

    // 1. Delete product images from Cloudinary
    try {
      if (product.images && product.images.length > 0) {
        for (const image of product.images) {
          if (image.imageId) {
            await deleteFromCloudinary(image.imageId);
            deletionResults.cloudinaryImages++;
          }
        }
      }
    } catch (error) {
      deletionResults.errors.push(`Cloudinary deletion error: ${error.message}`);
    }

    // 2. Remove product from all user carts
    try {
      const cartUpdateResult = await Cart.updateMany(
        { "items.productId": productObjectId },
        { $pull: { items: { productId: productObjectId } } }
      );
      deletionResults.cartItems = cartUpdateResult.modifiedCount;
    } catch (error) {
      deletionResults.errors.push(`Cart update error: ${error.message}`);
    }

    // 3. Remove product from user wishlists
    try {
      const wishlistUpdateResult = await User.updateMany(
        { wishlist: productObjectId },
        { $pull: { wishlist: productObjectId } }
      );
      deletionResults.wishlistReferences = wishlistUpdateResult.modifiedCount;
    } catch (error) {
      deletionResults.errors.push(`Wishlist update error: ${error.message}`);
    }

    // 4. Delete all reviews for this product
    try {
      const reviewDeleteResult = await ProductReview.deleteMany({ productId: productObjectId });
      deletionResults.reviews = reviewDeleteResult.deletedCount;
    } catch (error) {
      deletionResults.errors.push(`Review deletion error: ${error.message}`);
    }

    // 5. Remove product from HomeContent (all sections)
    try {
      const homeContent = await HomeContent.findOne();
      if (homeContent) {
        let updated = false;

        // Remove from newArrival
        const newArrivalBefore = homeContent.newArrival.length;
        homeContent.newArrival = homeContent.newArrival.filter(item => 
          item.productId?.toString() !== productObjectId.toString() && 
          item.product_id !== productStringId
        );
        if (homeContent.newArrival.length < newArrivalBefore) {
          updated = true;
          deletionResults.homeContentReferences++;
        }

        // Remove from hotItems
        const hotItemsBefore = homeContent.hotItems.length;
        homeContent.hotItems = homeContent.hotItems.filter(item => 
          item.productId?.toString() !== productObjectId.toString() && 
          item.product_id !== productStringId
        );
        if (homeContent.hotItems.length < hotItemsBefore) {
          updated = true;
          deletionResults.homeContentReferences++;
        }

        // Remove from trandingItems (note: keeping original typo as per schema)
        const trandingItemsBefore = homeContent.trandingItems.length;
        homeContent.trandingItems = homeContent.trandingItems.filter(item => 
          item.productId?.toString() !== productObjectId.toString() && 
          item.product_id !== productStringId
        );
        if (homeContent.trandingItems.length < trandingItemsBefore) {
          updated = true;
          deletionResults.homeContentReferences++;
        }

        if (updated) {
          await homeContent.save();
        }
      }
    } catch (error) {
      deletionResults.errors.push(`HomeContent update error: ${error.message}`);
    }

    // 6. Delete inventory records
    try {
      const inventoryDeleteResult = await Inventory.deleteMany({ productId: productObjectId });
      deletionResults.inventory = inventoryDeleteResult.deletedCount > 0;
    } catch (error) {
      deletionResults.errors.push(`Inventory deletion error: ${error.message}`);
    }

    // 7. Handle orders - don't delete orders but mark product as deleted/unavailable
    try {
      const orderUpdateResult = await Order.updateMany(
        { "products.productId": productObjectId },
        { 
          $set: { 
            "products.$.productDeleted": true,
            "products.$.deletedAt": new Date()
          }
        }
      );
      deletionResults.orderItems = orderUpdateResult.modifiedCount;
    } catch (error) {
      deletionResults.errors.push(`Order update error: ${error.message}`);
    }

    // 8. Finally, delete the product itself
    try {
      if (mongoose.Types.ObjectId.isValid(id)) {
        await Product.findByIdAndDelete(id);
      } else {
        await Product.deleteOne({ product_id: id });
      }
      deletionResults.product = true;
    } catch (error) {
      deletionResults.errors.push(`Product deletion error: ${error.message}`);
      throw error; // This is critical, so throw if it fails
    }

    return res.status(200).json({
      message: "Product deleted successfully from all systems",
      success: true,
      deletionResults,
      productInfo: {
        id: productStringId,
        name: product.name,
        objectId: productObjectId.toString()
      }
    });

  } catch (error) {
    console.error("Error deleting product:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete product completely",
      error: error.message,
    });
  }
};

// update product by id
export const updateProductById = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
        success: false,
      });
    }

    const { id } = req.params;

    // Check if the product exists
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        message: "Product not found",
        success: false,
      });
    }

    const {
      name,
      description,
      price,
      category,
      collections,
      discount,
      size,
      offerStatus,
      removedImageIds, // Changed from removedImages to removedImageIds
    } = req.body;

    // Start with existing images
    let finalImages = [...(product.images || [])];
    let deletedImagesCount = 0;
    let uploadedImagesCount = 0;

    // Step 1: Handle removed images
    if (removedImageIds) { // Changed from removedImages to removedImageIds
      // Parse removedImageIds if it's a string (from form data)
      let imagesToRemove;
      if (typeof removedImageIds === 'string') {
        try {
          imagesToRemove = JSON.parse(removedImageIds);
        } catch (e) {
          imagesToRemove = [removedImageIds];
        }
      } else {
        imagesToRemove = Array.isArray(removedImageIds) ? removedImageIds : [removedImageIds];
      }
      
      console.log("Images to remove:", imagesToRemove);

      // Delete specified images from Cloudinary and remove from array
      for (const imageIdToRemove of imagesToRemove) {
        const imageIndex = finalImages.findIndex(img => img.imageId === imageIdToRemove);
        
        if (imageIndex !== -1) {
          const imageToDelete = finalImages[imageIndex];
          
          try {
            // Delete from Cloudinary using the imageId (which is the public_id)
            await deleteFromCloudinary(imageToDelete.imageId);
            // Remove from array
            finalImages.splice(imageIndex, 1);
            deletedImagesCount++;
            console.log(`Successfully deleted image: ${imageIdToRemove}`);
          } catch (error) {
            console.error(`Failed to delete image ${imageIdToRemove}:`, error);
            // Continue with other operations even if one deletion fails
          }
        } else {
          console.log(`Image ${imageIdToRemove} not found in product images`);
        }
      }
    }

    // Step 2: Handle new image uploads
    if (req.files && req.files.length > 0) {
      console.log("Uploading new images...");
      const cloudinaryFolder = "products";

      const uploadPromises = req.files.map((file) =>
        uploadOnCloudinary(file.path, cloudinaryFolder)
      );

      try {
        const uploadResults = await Promise.all(uploadPromises);
        
        // Process successful uploads
        const newImages = uploadResults
          .filter(result => result) // Filter out null results
          .map(result => ({
            imageUrl: result.secure_url,
            imageId: result.public_id,
          }));

        uploadedImagesCount = newImages.length;
        finalImages = [...finalImages, ...newImages];
        console.log(`Successfully uploaded ${uploadedImagesCount} new images`);
      } catch (error) {
        console.error("Error uploading images:", error);
        return res.status(500).json({
          success: false,
          message: "Failed to upload new images",
          error: error.message,
        });
      }
    }

    // Step 3: Update the product with new data
    const updateData = {};
    
    // Only update fields that are provided
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = price;
    if (category !== undefined) updateData.category = category;
    if (collections !== undefined) updateData.collections = collections;
    if (discount !== undefined) updateData.discount = discount;
    if (size !== undefined) updateData.size = size;
    if (offerStatus !== undefined) updateData.offerStatus = offerStatus;
    
    // Always update images array
    updateData.images = finalImages;

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct,
      updateStats: {
        imagesRemoved: deletedImagesCount,
        imagesAdded: uploadedImagesCount,
        totalImages: finalImages.length,
      },
    });
  } catch (error) {
    console.error("Error updating product:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update product",
      error: error.message,
    });
  }
};

// get product by id for admin
export const getProductByIdForAdmin = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
        success: false,
      });
    }

    const { id } = req.params;

    // Check if the product exists
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        message: "Product not found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Product fetched successfully",
      success: true,
      product,
    });
  } catch (error) {
    console.error("Error fetching product:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch product",
      error: error.message,
    });
  }
};

// get all orders for admin with search and pagination
export const getAllOrders = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
        success: false,
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const searchTerm = req.query.search || req.query.query || "";
    const statusFilter = req.query.status || "";
    
    let filter = {};

    // Add status filter if provided
    if (statusFilter && statusFilter.trim() !== "") {
      filter.Orderstatus = statusFilter.toLowerCase();
    }

    // If search term is provided, search only in trackingId
    if (searchTerm && searchTerm.trim() !== "") {
      const searchRegex = new RegExp(searchTerm, "i");
      
      filter = {
        ...filter,
        trackingId: searchRegex
      };
    }

    // Count total results for pagination info
    const totalOrders = await Order.countDocuments(filter);

    // Fetch paginated results with populated fields
    const orders = await Order.find(filter)
      .populate({
        path: 'owner',
        select: 'fullName email'
      })
      .populate('paymentDetails')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Format the response
    const formattedOrders = orders.map((order) => ({
      _id: order._id,
      trackingId: order.trackingId,
      owner: {
        _id: order.owner.trackingId,
        name: order.owner.fullName,
        email: order.owner.email
      },
      products: order.products,
      totalAmount: order.totalAmount,
      status: order.Orderstatus,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt
    }));

    // Pagination information
    const totalPages = Math.ceil(totalOrders / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    res.status(200).json({
      success: true,
      message: "Orders fetched successfully",
      count: formattedOrders.length,
      pagination: {
        totalOrders,
        totalPages,
        currentPage: page,
        hasNextPage,
        hasPrevPage,
      },
      orders: formattedOrders,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
      error: error.message,
    });
  }
};

// update order status
export const updateOrderStatus = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
        success: false,
      });
    }

    const { orderId } = req.params;
    const { status } = req.body;

    // Validate status
    const validStatuses = ["pending", "processing", "shipped", "delivered", "cancelled", "return"];
    if (!validStatuses.includes(status.toLowerCase())) {
      return res.status(400).json({
        message: "Invalid order status",
        success: false,
      });
    }

    // Check if order exists
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        message: "Order not found",
        success: false,
      });
    }

    // Check if we need to restore stock (when changing to cancelled or return status)
    const previousStatus = order.Orderstatus;
    const shouldRestoreStock = (status.toLowerCase() === 'cancelled' || status.toLowerCase() === 'return') 
                               && (previousStatus !== 'cancelled' && previousStatus !== 'return');

    // If restoring stock, use the utility function from order controller
    if (shouldRestoreStock) {
      // Import the stock restoration utility function
      await restoreStockForOrder(order.products);
    }

    // Update order status
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { Orderstatus: status.toLowerCase() },
      { new: true }
    ).populate({
      path: 'owner',
      select: 'fullName email'
    }).populate('paymentDetails');

    return res.status(200).json({
      message: "Order status updated successfully",
      success: true,
      order: {
        _id: updatedOrder._id,
        trackingId: updatedOrder.trackingId,
        owner: {
          _id: updatedOrder.owner._id,
          name: updatedOrder.owner.fullName,
          email: updatedOrder.owner.email
        },
        products: updatedOrder.products,
        totalAmount: updatedOrder.totalAmount,
        status: updatedOrder.Orderstatus,
        paymentMethod: updatedOrder.paymentMethod,
        paymentStatus: updatedOrder.paymentStatus,
        createdAt: updatedOrder.createdAt,
        updatedAt: updatedOrder.updatedAt
      }
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update order status",
      error: error.message,
    });
  }
};

// Dashboard Stats
export const getDashboardStats = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
        success: false,
      });
    }

    // Get current date and calculate date ranges
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    // Get total counts
    const [totalOrders, totalUsers, totalProducts] = await Promise.all([
      Order.countDocuments(),
      User.countDocuments(),
      Product.countDocuments()
    ]);

    // Get current month orders
    const currentMonthOrders = await Order.countDocuments({
      createdAt: { $gte: startOfMonth }
    });

    // Get last month orders
    const lastMonthOrders = await Order.countDocuments({
      createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth }
    });

    // Calculate order growth percentage
    const orderGrowth = lastMonthOrders > 0 
      ? ((currentMonthOrders - lastMonthOrders) / lastMonthOrders) * 100 
      : currentMonthOrders > 0 ? 100 : 0;

    // Get total revenue
    const revenueResult = await Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

    // Get current month revenue
    const currentMonthRevenueResult = await Order.aggregate([
      { 
        $match: { 
          paymentStatus: 'paid',
          createdAt: { $gte: startOfMonth }
        }
      },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    const currentMonthRevenue = currentMonthRevenueResult.length > 0 ? currentMonthRevenueResult[0].total : 0;

    // Get last month revenue
    const lastMonthRevenueResult = await Order.aggregate([
      { 
        $match: { 
          paymentStatus: 'paid',
          createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth }
        }
      },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    const lastMonthRevenue = lastMonthRevenueResult.length > 0 ? lastMonthRevenueResult[0].total : 0;

    // Calculate revenue growth percentage
    const revenueGrowth = lastMonthRevenue > 0 
      ? ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 
      : currentMonthRevenue > 0 ? 100 : 0;

    // Get current month users
    const currentMonthUsers = await User.countDocuments({
      createdAt: { $gte: startOfMonth }
    });

    // Get last month users
    const lastMonthUsers = await User.countDocuments({
      createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth }
    });

    // Calculate user growth percentage
    const userGrowth = lastMonthUsers > 0 
      ? ((currentMonthUsers - lastMonthUsers) / lastMonthUsers) * 100 
      : currentMonthUsers > 0 ? 100 : 0;

    const stats = {
      totalOrders,
      totalRevenue: Math.round(totalRevenue),
      totalUsers,
      totalProducts,
      orderGrowth: Math.round(orderGrowth * 100) / 100,
      revenueGrowth: Math.round(revenueGrowth * 100) / 100,
      userGrowth: Math.round(userGrowth * 100) / 100
    };

    return res.status(200).json({
      message: "Dashboard stats fetched successfully",
      success: true,
      stats
    });

  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard stats",
      error: error.message,
    });
  }
};

// Get recent users for dashboard
export const getRecentUsers = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
        success: false,
      });
    }

    const limit = parseInt(req.query.limit) || 10;

    // Fetch recent users sorted by creation date
    const users = await User.find()
      .select("fullName email role avatar createdAt")
      .sort({ createdAt: -1 })
      .limit(limit);

    const formattedUsers = users.map((user) => ({
      _id: user._id,
      name: user.fullName,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      createdAt: user.createdAt,
    }));

    return res.status(200).json({
      message: "Recent users fetched successfully",
      success: true,
      users: formattedUsers,
    });
  } catch (error) {
    console.error("Error fetching recent users:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch recent users",
      error: error.message,
    });
  }
};

// Get recent orders for dashboard
export const getRecentOrders = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
        success: false,
      });
    }

    const limit = parseInt(req.query.limit) || 10;

    // Fetch recent orders sorted by creation date
    const orders = await Order.find()
      .populate({
        path: 'owner',
        select: 'fullName email'
      })
      .populate('paymentDetails')
      .sort({ createdAt: -1 })
      .limit(limit);

    // Format the response
    const formattedOrders = orders.map((order) => ({
      _id: order._id,
      trackingId: order.trackingId,
      owner: {
        _id: order.owner._id,
        name: order.owner.fullName,
        email: order.owner.email
      },
      products: order.products,
      totalAmount: order.totalAmount,
      status: order.Orderstatus,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt
    }));

    return res.status(200).json({
      message: "Recent orders fetched successfully",
      success: true,
      orders: formattedOrders,
    });
  } catch (error) {
    console.error("Error fetching recent orders:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch recent orders",
      error: error.message,
    });
  }
};

// Delete user and all associated data
export const deleteUser = async (req, res) => {
  try {
    const adminUserId = req.userId;
    const { userId } = req.params;

    if (!adminUserId) {
      return res.status(401).json({
        message: "Unauthorized",
        success: false,
      });
    }

    if (!userId) {
      return res.status(400).json({
        message: "User ID is required",
        success: false,
      });
    }

    // Find the user in our database
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    // Start a database transaction for data consistency
    const session = await mongoose.startSession();
    
    try {
      await session.withTransaction(async () => {
        // Delete user from Clerk first
        if (user.clerkId) {
          try {
            await clerkClient.users.deleteUser(user.clerkId);
            console.log(`Successfully deleted user from Clerk: ${user.clerkId}`);
          } catch (clerkError) {
            console.error("Error deleting user from Clerk:", clerkError);
            // Continue with database cleanup even if Clerk deletion fails
            // This prevents orphaned data in our database
          }
        }

        // Delete associated cart data
        if (user.cart) {
          await Cart.findByIdAndDelete(user.cart).session(session);
          console.log(`Deleted cart for user: ${userId}`);
        }

        // Delete associated address data
        if (user.address) {
          await Address.findByIdAndDelete(user.address).session(session);
          console.log(`Deleted address for user: ${userId}`);
        }

        // Delete all orders associated with the user
        const deletedOrders = await Order.deleteMany({ owner: userId }).session(session);
        console.log(`Deleted ${deletedOrders.deletedCount} orders for user: ${userId}`);

        // Remove user from any wishlists or other references
        // This handles the wishlist array in the user model
        await User.updateMany(
          { wishlist: { $in: [userId] } },
          { $pull: { wishlist: userId } }
        ).session(session);

        // Finally, delete the user from our database
        await User.findByIdAndDelete(userId).session(session);
        console.log(`Successfully deleted user from database: ${userId}`);
      });

      return res.status(200).json({
        message: "User and all associated data deleted successfully",
        success: true,
      });

    } catch (transactionError) {
      console.error("Transaction error during user deletion:", transactionError);
      return res.status(500).json({
        message: "Failed to delete user data completely",
        success: false,
        error: transactionError.message,
      });
    } finally {
      await session.endSession();
    }

  } catch (error) {
    console.error("Error in deleteUser controller:", error);
    return res.status(500).json({
      message: "Internal server error during user deletion",
      success: false,
      error: error.message,
    });
  }
};

// Delete user by ID
export const deleteUserById = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
        success: false,
      });
    }

    const { id } = req.params;

    // Check if the user exists
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    // Delete user from MongoDB
    await User.deleteOne({ _id: id });

    // If the user has a Clerk ID, also delete from Clerk
    if (user.clerkId) {
      try {
        await clerkClient.users.deleteUser(user.clerkId);
        console.log(`Successfully deleted user ${user.clerkId} from Clerk`);
      } catch (error) {
        console.error(`Failed to delete user ${user.clerkId} from Clerk:`, error);
        // Continue with the response even if Clerk deletion fails
      }
    }

    return res.status(200).json({
      message: "User deleted successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete user",
      error: error.message,
    });
  }
};

// Get all inventory data
export const getAllInventory = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
        success: false,
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const searchTerm = req.query.search || "";
    let filter = {};

    // Build the aggregation pipeline
    const pipeline = [
      {
        $lookup: {
          from: "products",
          localField: "productId",
          foreignField: "_id",
          as: "product",
        },
      },
      {
        $unwind: "$product",
      },
    ];

    // Add search filter if provided
    if (searchTerm && searchTerm.trim() !== "") {
      const searchRegex = new RegExp(searchTerm, "i");
      pipeline.push({
        $match: {
          $or: [
            { "product.name": searchRegex },
            { "product.product_id": searchRegex },
          ],
        },
      });
    }

    // Add pagination
    pipeline.push(
      { $skip: skip },
      { $limit: limit },
      {
        $project: {
          _id: 1,
          productId: 1,
          stocks: 1,
          totalQuantity: 1,
          createdAt: 1,
          updatedAt: 1,
          "product._id": 1,
          "product.product_id": 1,
          "product.name": 1,
          "product.price": 1,
          "product.category": 1,
          "product.images": 1,
        },
      }
    );

    const inventoryData = await Inventory.aggregate(pipeline);

    // Get total count for pagination
    let totalCount;
    if (searchTerm && searchTerm.trim() !== "") {
      const countPipeline = [
        {
          $lookup: {
            from: "products",
            localField: "productId",
            foreignField: "_id",
            as: "product",
          },
        },
        {
          $unwind: "$product",
        },
        {
          $match: {
            $or: [
              { "product.name": new RegExp(searchTerm, "i") },
              { "product.product_id": new RegExp(searchTerm, "i") },
            ],
          },
        },
        {
          $count: "total",
        },
      ];
      const countResult = await Inventory.aggregate(countPipeline);
      totalCount = countResult.length > 0 ? countResult[0].total : 0;
    } else {
      totalCount = await Inventory.countDocuments();
    }

    // Format the response
    const formattedInventory = inventoryData.map((item) => ({
      _id: item._id,
      productId: item.productId,
      product: {
        _id: item.product._id,
        product_id: item.product.product_id,
        name: item.product.name,
        price: item.product.price,
        category: item.product.category,
        image:
          item.product.images && item.product.images.length > 0
            ? item.product.images[0].imageUrl
            : null,
      },
      stocks: item.stocks,
      totalQuantity: item.totalQuantity,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    }));

    // Pagination information
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return res.status(200).json({
      success: true,
      message: "Inventory fetched successfully",
      count: formattedInventory.length,
      pagination: {
        totalInventory: totalCount,
        totalPages,
        currentPage: page,
        hasNextPage,
        hasPrevPage,
      },
      inventory: formattedInventory,
    });
  } catch (error) {
    console.error("Error fetching inventory:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch inventory",
      error: error.message,
    });
  }
};

// Update inventory for a specific product
export const updateInventory = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
        success: false,
      });
    }

    const { productId } = req.params;
    const { stocks } = req.body;

    if (!stocks || !Array.isArray(stocks)) {
      return res.status(400).json({
        success: false,
        message: "Please provide valid stocks array",
      });
    }

    // Validate each stock entry
    for (const stock of stocks) {
      if (!stock.size || typeof stock.quantity !== "number" || stock.quantity < 0) {
        return res.status(400).json({
          success: false,
          message: "Each stock entry must have a valid size and non-negative quantity",
        });
      }
    }

    // Find the inventory by productId
    const inventory = await Inventory.findOne({ productId });
    if (!inventory) {
      return res.status(404).json({
        success: false,
        message: "Inventory not found for this product",
      });
    }

    // Update stocks
    inventory.stocks = stocks;
    inventory.totalQuantity = stocks.reduce((total, stock) => total + stock.quantity, 0);

    await inventory.save();

    // Populate product details for response
    const updatedInventory = await Inventory.findById(inventory._id).populate({
      path: "productId",
      select: "_id product_id name price category images",
    });

    return res.status(200).json({
      success: true,
      message: "Inventory updated successfully",
      inventory: {
        _id: updatedInventory._id,
        productId: updatedInventory.productId._id,
        product: {
          _id: updatedInventory.productId._id,
          product_id: updatedInventory.productId.product_id,
          name: updatedInventory.productId.name,
          price: updatedInventory.productId.price,
          category: updatedInventory.productId.category,
          image:
            updatedInventory.productId.images && updatedInventory.productId.images.length > 0
              ? updatedInventory.productId.images[0].imageUrl
              : null,
        },
        stocks: updatedInventory.stocks,
        totalQuantity: updatedInventory.totalQuantity,
        updatedAt: updatedInventory.updatedAt,
      },
    });
  } catch (error) {
    console.error("Error updating inventory:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update inventory",
      error: error.message,
    });
  }
};

// Get inventory for a specific product
export const getInventoryByProductId = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
        success: false,
      });
    }

    const { productId } = req.params;

    const inventory = await Inventory.findOne({ productId }).populate({
      path: "productId",
      select: "_id product_id name price category images size",
    });

    if (!inventory) {
      return res.status(404).json({
        success: false,
        message: "Inventory not found for this product",
      });
    }

    const formattedInventory = {
      _id: inventory._id,
      productId: inventory.productId._id,
      product: {
        _id: inventory.productId._id,
        product_id: inventory.productId.product_id,
        name: inventory.productId.name,
        price: inventory.productId.price,
        category: inventory.productId.category,
        sizes: inventory.productId.size,
        image:
          inventory.productId.images && inventory.productId.images.length > 0
            ? inventory.productId.images[0].imageUrl
            : null,
      },
      stocks: inventory.stocks,
      totalQuantity: inventory.totalQuantity,
      createdAt: inventory.createdAt,
      updatedAt: inventory.updatedAt,
    };

    return res.status(200).json({
      success: true,
      message: "Inventory fetched successfully",
      inventory: formattedInventory,
    });
  } catch (error) {
    console.error("Error fetching inventory:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch inventory",
      error: error.message,
    });
  }
};

