import axiosInstance from "./config";

export const getAllProducts = async (params = {}) => {
  try {
    const res = await axiosInstance.get("/product", { params });
    return res.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Failed to fetch products",
    };
  }
};

export const getProductById = async (id) => {
  try {
    const res = await axiosInstance.get(`/product/get-product/${id}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return res.data;

  } catch (error) {
    console.error("Error fetching product details:", error);
    return {
      success: false,
      message:
        error.response?.data?.message || "Failed to fetch product details",
    };
  }
};

export const searchProducts = async (query) => {
  try {
    const res = await axiosInstance.get("/product/search", {
      params: { query },
    });
    return res.data;
  } catch (error) {
    console.error("Error searching products:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Failed to search products",
    };
  }
};

export const getHotItems = async (additionalParams = {}) => {
  try {
    const res = await axiosInstance.get("/product/filter", {
      params: {
        isHotItem: true,
        ...additionalParams,
      },
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
      message: error.response?.data?.message || "Failed to fetch hot items",
    };
  }
};

export const getTrendingProducts = async (additionalParams = {}) => {
  try {
    const res = await axiosInstance.get("/product/filter", {
      params: {
        isTranding: true,
        ...additionalParams,
      },
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
      message:
        error.response?.data?.message || "Failed to fetch trending products",
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
    const res = await axiosInstance.get("/product/filter", {
      params: {
        isNewArrival: true,
        ...additionalParams,
      },
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
      message: error.response?.data?.message || "Failed to fetch new arrivals",
    };
  }
};

export const getProductsByCategory = async (
  category,
  additionalParams = {}
) => {
  try {
    if (category === "all") {
      return getAllProducts(additionalParams);
    }

    const res = await axiosInstance.get("/product/filter", {
      params: {
        category,
        ...additionalParams,
      },
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
      message: error.response?.data?.message || "Failed to fetch products",
    };
  }
};

export const getFilteredProducts = async (filters = {}) => {
  try {
    const res = await axiosInstance.get("/product/filter", {
      params: filters,
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
      message: error.response?.data?.message || "Failed to filter products",
    };
  }
};

const transformProductForFrontend = (product) => {
  return {
    id: product._id || product.id,
    title: product.name,
    price: product.price,
    compareAtPrice: product.discount ? product.price + product.discount : null,
    image:
      product.images && product.images.length > 0
        ? product.images[0].imageUrl
        : "https://via.placeholder.com/300",
    category: product.category,
    // Additional transformations as needed
    inStock: true, // You might want to add a stock field to your model
    rating: 4.5, // You might want to add a ratings system
  };
};
