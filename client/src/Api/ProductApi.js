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

export const searchProducts = async (queryParams) => {
  try {
    const res = await axiosInstance.get("/product/search", {
      params: queryParams, // Pass parameters directly without nesting them
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

export const getProductsByCollection = async (
  collection,
  additionalParams = {}
) => {
  try {
    if (!collection) {
      return getAllProducts(additionalParams);
    }

    const res = await axiosInstance.get("/product/filter", {
      params: {
        collection, // This is the key parameter
        ...additionalParams,
      },
    });

    // Transform the data to match frontend component expectations
    if (res.data.success) {
      res.data.products = res.data.products.map(transformProductForFrontend);
    }

    return res.data;
  } catch (error) {
    console.error("Error fetching products by collection:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Failed to fetch collection products",
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

// Updated to handle the new product_id field
const transformProductForFrontend = (product) => {
  return {
    id: product._id,
    title: product.name,
    price: product.price,
    compareAtPrice: product.discount ? product.price + product.discount : null,
    image:
      product.images && product.images.length > 0
        ? product.images[0].imageUrl
        : "https://via.placeholder.com/300",
    category: product.category,
    inStock: true,
    rating: 4.5,
    handle: product.product_id,
  };
};
