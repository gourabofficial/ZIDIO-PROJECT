import { Product } from "../model/product.model.js";

// get all products
export const getAllProducts = async (req, res) => {
  try {
    // Extract pagination parameters from query
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Query the database with pagination
    const products = await Product.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    // Get total count for pagination metadata
    const totalProducts = await Product.countDocuments();

    res.status(200).json({
      success: true,
      count: products.length,
      total: totalProducts,
      totalPages: Math.ceil(totalProducts / limit),
      currentPage: page,
      products,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
      error: error.message,
    });
  }
};

// get product by id - updated to use product_id
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findOne({ product_id: id });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch product",
      error: error.message,
    });
  }
};

// search product
export const searchProduct = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
    }

    // Create a search pattern
    const searchRegex = new RegExp(query, "i");

    // Search in name, description, and category
    const products = await Product.find({
      $or: [
        { name: searchRegex },
        { description: searchRegex },
        { category: searchRegex },
      ],
    });

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error("Error searching products:", error);
    res.status(500).json({
      success: false,
      message: "Failed to search products",
      error: error.message,
    });
  }
};

// filter product
export const filterProduct = async (req, res) => {
  try {
    let {
      minPrice,
      maxPrice,
      category,
      size,
      offerStatus,
      page,
      limit
    } = req.query;

    // Parse pagination parameters
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 5;

    if (page < 1 || limit < 1) {
      return res.status(400).json({
        success: false,
        message: "Invalid pagination parameters.",
      });
    }

    const skip = (page - 1) * limit;

    // Build filter object
    const filter = {};

    // Apply price filter
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) {
        filter.price.$gte = parseFloat(minPrice);
      }
      if (maxPrice) {
        filter.price.$lte = parseFloat(maxPrice);
      }
    }

    // Apply category filter
    if (category) {
      filter.category = category;
    }

    // Apply size filter
    if (size) {
      filter.size = { $in: Array.isArray(size) ? size : [size] };
    }

    // Apply offer status filter
    if (offerStatus !== undefined) {
      filter.offerStatus = offerStatus === 'true';
    }

    // Execute the query with filters and pagination
    const products = await Product.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    // Get total count for pagination metadata
    const totalFilteredProducts = await Product.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: products.length,
      total: totalFilteredProducts,
      totalPages: Math.ceil(totalFilteredProducts / limit),
      currentPage: page,
      products,
    });
  } catch (error) {
    console.error("Error filtering products:", error);
    res.status(500).json({
      success: false,
      message: "Failed to filter products",
      error: error.message,
    });
  }
};
