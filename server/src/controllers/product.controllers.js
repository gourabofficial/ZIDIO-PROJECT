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
      products
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch products", 
      error: error.message 
    });
  }
}

// get product by id
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const product = await Product.findById(id).populate('collections');
    
    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: "Product not found" 
      });
    }
    
    res.status(200).json({
      success: true,
      product
    });
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch product", 
      error: error.message 
    });
  }
}

// search product
export const searchProduct = async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({ 
        success: false, 
        message: "Search query is required" 
      });
    }
    
    // Create a search pattern
    const searchRegex = new RegExp(query, 'i');
    
    // Search in name, description, and category
    const products = await Product.find({
      $or: [
        { name: searchRegex },
        { description: searchRegex },
        { category: searchRegex }
      ]
    });
    
    res.status(200).json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    console.error("Error searching products:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to search products", 
      error: error.message 
    });
  }
}

// filter product
export const filterProduct = async (req, res) => {
  try {
    const { 
      minPrice, 
      maxPrice, 
      category, 
      size, 
      isNewArrival, 
      isTranding, 
      isHotItem, 
      offerStatus 
    } = req.query;
    
    // Build filter object
    const filter = {};
    
    // Add price range filter if provided
    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {};
      if (minPrice !== undefined) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice !== undefined) filter.price.$lte = parseFloat(maxPrice);
    }
    
    // Add category filter if provided
    if (category) {
      filter.category = category;
    }
    
    // Add size filter if provided
    if (size) {
      filter.size = { $in: Array.isArray(size) ? size : [size] };
    }
    
    // Add boolean filters if provided
    if (isNewArrival !== undefined) {
      filter.isNewArrival = isNewArrival === 'true';
    }
    
    if (isTranding !== undefined) {
      filter.isTranding = isTranding === 'true';
    }
    
    if (isHotItem !== undefined) {
      filter.isHotItem = isHotItem === 'true';
    }
    
    if (offerStatus !== undefined) {
      filter.offerStatus = offerStatus === 'true';
    }
    
    // Query the database with filters
    const products = await Product.find(filter);
    
    res.status(200).json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    console.error("Error filtering products:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to filter products", 
      error: error.message 
    });
  }
}