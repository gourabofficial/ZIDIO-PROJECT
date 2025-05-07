import axiosInstance from "./config";

/**
 * Get all products with pagination
 * @param {Object} params - Query parameters
 * @param {number} params.page - Page number
 * @param {number} params.limit - Number of items per page
 * @returns {Promise<Object>} Response object with products array and pagination metadata
 */
export const getAllProducts = async (params = {}) => {
  try {
    const res = await axiosInstance.get('/product', { params });
    return res.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Failed to fetch products"
    };
  }
};

/**
 * Get product by ID
 * @param {string} id - Product ID
 * @returns {Promise<Object>} Response with product object
 */
export const getProductById = async (id) => {
  try {
    const res = await axiosInstance.get(`/product/${id}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching product details:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Failed to fetch product details"
    };
  }
};

/**
 * Search products by query
 * @param {string} query - Search query
 * @returns {Promise<Object>} Response with matching products
 */
export const searchProducts = async (query) => {
  try {
    const res = await axiosInstance.get('/product/search', { 
      params: { query }
    });
    return res.data;
  } catch (error) {
    console.error("Error searching products:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Failed to search products"
    };
  }
};

/**
 * Get hot items (products marked as hot)
 * @param {Object} additionalParams - Additional query parameters
 * @returns {Promise<Object>} Response with hot products
 */
export const getHotItems = async (additionalParams = {}) => {
  try {
    const res = await axiosInstance.get('/product/filter', { 
      params: { 
        isHotItem: true,
        ...additionalParams
      }
    });
    
    // Transform the data to match frontend component expectations
    if (res.data.success) {
      res.data.products = res.data.products.map(transformProductForFrontend);
    }
    
    return res.data;
  } catch (error) {
    console.error("Error fetching hot items:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Failed to fetch hot items"
    };
  }
};

/**
 * Get trending products
 * @param {Object} additionalParams - Additional query parameters
 * @returns {Promise<Object>} Response with trending products
 */
export const getTrendingProducts = async (additionalParams = {}) => {
  try {
    const res = await axiosInstance.get('/product/filter', { 
      params: { 
        isTranding: true,
        ...additionalParams
      }
    });
    
    // Transform the data to match frontend component expectations
    if (res.data.success) {
      res.data.products = res.data.products.map(transformProductForFrontend);
    }
    
    return res.data;
  } catch (error) {
    console.error("Error fetching trending products:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Failed to fetch trending products"
    };
  }
};

/**
 * Get new arrivals
 * @param {Object} additionalParams - Additional query parameters
 * @returns {Promise<Object>} Response with new arrival products
 */
export const getNewArrivals = async (additionalParams = {}) => {
  try {
    const res = await axiosInstance.get('/product/filter', { 
      params: {
        isNewArrival: true,
        ...additionalParams
      }
    });
    
    // Transform the data to match frontend component expectations
    if (res.data.success) {
      res.data.products = res.data.products.map(transformProductForFrontend);
    }
    
    return res.data;
  } catch (error) {
    console.error("Error fetching new arrivals:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Failed to fetch new arrivals"
    };
  }
};

/**
 * Get products by category
 * @param {string} category - Category name
 * @param {Object} additionalParams - Additional query parameters
 * @returns {Promise<Object>} Response with category-filtered products
 */
export const getProductsByCategory = async (category, additionalParams = {}) => {
  try {
    if (category === 'all') {
      return getAllProducts(additionalParams);
    }
    
    const res = await axiosInstance.get('/product/filter', { 
      params: {
        category,
        ...additionalParams
      }
    });
    
    // Transform the data to match frontend component expectations
    if (res.data.success) {
      res.data.products = res.data.products.map(transformProductForFrontend);
    }
    
    return res.data;
  } catch (error) {
    console.error("Error fetching products by category:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Failed to fetch products"
    };
  }
};

/**
 * Get products with custom filters
 * @param {Object} filters - Filter criteria
 * @returns {Promise<Object>} Response with filtered products
 */
export const getFilteredProducts = async (filters = {}) => {
  try {
    const res = await axiosInstance.get('/product/filter', { 
      params: filters
    });
    
    // Transform the data to match frontend component expectations
    if (res.data.success) {
      res.data.products = res.data.products.map(transformProductForFrontend);
    }
    
    return res.data;
  } catch (error) {
    console.error("Error fetching filtered products:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Failed to filter products"
    };
  }
};

/**
 * Helper function to transform backend product format to frontend format
 * @param {Object} product - Backend product object
 * @returns {Object} Frontend formatted product
 */
const transformProductForFrontend = (product) => {
  return {
    id: product._id || product.id,
    title: product.name,
    price: product.price,
    compareAtPrice: product.discount ? product.price + product.discount : null,
    image: product.images && product.images.length > 0 
      ? product.images[0].imageUrl 
      : 'https://via.placeholder.com/300',
    category: product.category,
    // Additional transformations as needed
    inStock: true, // You might want to add a stock field to your model
    rating: 4.5, // You might want to add a ratings system
  };
};