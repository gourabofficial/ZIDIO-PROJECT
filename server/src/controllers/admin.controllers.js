import { uploadOnCloudinary } from "../config/cloudinary.js";
import { Product } from "../model/product.model.js";
import { HomeContent } from "../model/homeContent.model.js";
import { v4 as uuidv4 } from "uuid";
import mongoose from "mongoose";
import { User } from "../model/user.model.js";

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

    // console.log("Total products found:", totalProducts);

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
    }).select("_id product_id name images");

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

    const searchTerm = req.query.query || req.query.search || "";
    let filter = {};

    if (searchTerm && searchTerm.trim() !== "") {
      const searchRegex = new RegExp(searchTerm, "i");
      filter = {
        $or: [{ name: searchRegex }, { email: searchRegex }],
      };
    }

    const totalUsers = await User.countDocuments(filter);

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
}