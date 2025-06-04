import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../config/cloudinary.js";
import { Product } from "../model/product.model.js";
import { HomeContent } from "../model/homeContent.model.js";
import { v4 as uuidv4 } from "uuid";
import mongoose from "mongoose";
import { User } from "../model/user.model.js";
import { Order } from "../model/order.model.js";

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

    console.log("New product created:", newProduct);

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
// delete product by id
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

    // Check if the product exists
    const product = await Product.findOne({ product_id: id });
    if (!product) {
      return res.status(404).json({
        message: "Product not found",
        success: false,
      });
    }

    // Delete the product
    await Product.deleteOne({ product_id: id });

    return res.status(200).json({
      message: "Product deleted successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete product",
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
