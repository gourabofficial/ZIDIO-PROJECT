import axiosInstance from "./config";

export const AdminAddProduct = async (productData, token = null) => {
  console.log("productData in admin.js", productData);
  try {


    const formData = new FormData();

    Object.keys(productData).forEach((key) => {
      if (key !== "images") {
        if (Array.isArray(productData[key])) {
          productData[key].forEach((item) => {
            formData.append(key, item);
          });
        } else {
          formData.append(key, productData[key]);
        }
      }
    });

    if (productData.images && Array.isArray(productData.images)) {
      productData.images.forEach((image, index) => {
        if (image instanceof File) {
          formData.append("images", image);
        } else if (image && image.name) {
          formData.append("images", image);
        }
      });
    }

    for (let pair of formData.entries()) {
      console.log(
        pair[0] + ": " + (pair[1] instanceof File ? pair[1].name : pair[1])
      );
    }
    const headers = {
      'Content-Type': 'multipart/form-data',
    }
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await axiosInstance.post(
      "/admin/add-product",
      {}, {
      headers,
    },
      formData,

    );

    if (!response.success) {
      return {
        message: response.data,
        success: false,
      };
    }

    return {
      message: response.data.message,
      success: true,
    };
  } catch (error) {
    console.error("Error adding product:", error);
    console.error("Error details:", error.response?.data);
    return {
      message: error.response?.data?.message || "Failed to add product",
      success: false,
    };
  }
};

export const updateHomeContent = async (data) => {
  console.log("updateHomeContentData in admin.js", data);
  try {
    const response = await axiosInstance.patch(
      "/admin/update-homecontent",
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.data.success) {
      return {
        message: response.data.message,
        success: false,
      };
    }
    return {
      message: response.data.message,
      success: true,
    };
  } catch (error) {
    return {
      message: error.message,
      success: false,
    };
  }
};

export const getAllSearchProducts = async (
  query = "",
  page = 1,
  limit = 10
) => {
  try {
    // Properly encode the query parameter
    const encodedQuery = encodeURIComponent(query);

    const response = await axiosInstance.get(
      `/admin/get-search-all-products?query=${encodedQuery}&page=${page}&limit=${limit}`
    );

    if (!response.data.success) {
      return {
        message: response.data.message,
        success: false,
      };
    }

    return {
      message: "Search successful",
      success: true,
      data: response.data.products,
      pagination: response.data.pagination,
    };
  } catch (error) {
    console.error("Search error:", error);
    return {
      message: error.message,
      success: false,
    };
  }
};

export const getProductsbyMultipleIds = async (ids) => {
  // console.log("ids in getProductsbyMultipleIds", ids);

  try {
    const response = await axiosInstance.post(
      "/admin/get-products-by-multiple-ids",
      { productIds: ids },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.data.success) {
      return {
        message: response.data.message,
        success: false,
      };
    }

    return {
      message: response.data.message,
      success: true,
      data: response.data.products,
    };
  } catch (error) {
    return {
      message: error.message,
      success: false,
    };
  }
};

export const getAllSearchUsers = async (
  page = 1,
  searchTerm = "",
  limit = 10
) => {
  try {
    // Properly encode the search parameter
    const encodedSearchTerm = encodeURIComponent(searchTerm);

    const response = await axiosInstance.get(
      `/admin/get-search-all-users?page=${page}&searchTerm=${encodedSearchTerm}&limit=${limit}`
    );
    console.log("response in getAllSearchUsers", response);
    if (!response.data.success) {
      return {
        message: response.data.message,
        success: false,
      };
    }

    return response.data;
  } catch (error) {
    return {
      message: error.message,
      success: false,
    };
  }
};

export const deleterProductById = async (id) => {
  try {
    const response = await axiosInstance.delete(`/admin/delete-product/${id}`);

    if (!response.data.success) {
      return {
        message: response.data.message,
        success: false,
      };
    }

    return {
      message: response.data.message,
      success: true,
    };
  } catch (error) {
    return {
      message: error.message,
      success: false,
    };
  }
};

// get product by id for admin
export const getProductByIdForAdmin = async (id) => {
  try {
    const response = await axiosInstance.get(
      `/admin/get-product-for-admin/${id}`
    );

    if (!response.data.success) {
      return {
        message: response.data.message,
        success: false,
      };
    }

    return response.data;
  } catch (error) {
    return {
      message: error.message,
      success: false,
    };
  }
};

// update product by id for admin
export const updateProductByIdForAdmin = async (id, productData) => {
  try {
    const formData = new FormData();

    Object.keys(productData).forEach((key) => {
      if (key !== "newImages") {
        if (Array.isArray(productData[key])) {
          productData[key].forEach((item) => {
            formData.append(key, item);
          });
        } else {
          // Add this else clause to handle non-array fields (strings, numbers, booleans)
          formData.append(key, productData[key]);
        }
      }
    });

    // Handle newImages array
    if (productData.newImages && Array.isArray(productData.newImages)) {
      productData.newImages.forEach((image) => {
        if (image instanceof File) {
          formData.append("images", image);
        }
      });
    }

    const response = await axiosInstance.patch(
      `/admin/update-product/${id}`,
      formData,
      {
        headers: {
          "Content-Type": undefined, // Remove default json header, let browser set multipart boundary
        },
      }
    );

    if (!response.data.success) {
      return {
        message: response.data.message,
        success: false,
      };
    }

    return {
      ...response.data,
      success: true,
    };
  } catch (error) {
    console.error("Error updating product:", error);
    return {
      message: error.response?.data?.message || error.message,
      success: false,
    };
  }
};

// get all orders for admin with pagination and search
export const getAllOrders = async (page = 1, searchTerm = "", status = "", limit = 10) => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    });

    if (searchTerm && searchTerm.trim()) {
      params.append('search', searchTerm.trim());
    }

    if (status && status.trim()) {
      params.append('status', status.trim());
    }

    const response = await axiosInstance.get(`/admin/get-all-orders?${params.toString()}`);

    if (!response.data.success) {
      return {
        message: response.data.message,
        success: false,
      };
    }

    return {
      message: response.data.message,
      success: true,
      orders: response.data.orders,
      pagination: response.data.pagination,
    };
  } catch (error) {
    console.error("Error fetching orders:", error);
    return {
      message: error.response?.data?.message || error.message,
      success: false,
    };
  }
};

// update order status
export const updateOrderStatus = async (orderId, status) => {
  try {
    const response = await axiosInstance.patch(`/admin/orders/${orderId}/status`, {
      status: status
    }, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.data.success) {
      return {
        message: response.data.message,
        success: false,
      };
    }

    return {
      message: response.data.message,
      success: true,
      order: response.data.order,
    };
  } catch (error) {
    console.error("Error updating order status:", error);
    return {
      message: error.response?.data?.message || error.message,
      success: false,
    };
  }
};

// get dashboard stats
export const getDashboardStats = async () => {
  try {
    const response = await axiosInstance.get('/admin/dashboard/stats');

    if (!response.data.success) {
      return {
        message: response.data.message,
        success: false,
      };
    }

    return {
      message: response.data.message,
      success: true,
      stats: response.data.stats,
    };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return {
      message: error.response?.data?.message || error.message,
      success: false,
    };
  }
};

// get recent users (limit 10 for dashboard)
export const getRecentUsers = async () => {
  try {
    const response = await axiosInstance.get('/admin/recent-users?limit=10');

    if (!response.data.success) {
      return {
        message: response.data.message,
        success: false,
        users: []
      };
    }

    return {
      message: response.data.message,
      success: true,
      users: response.data.users || []
    };
  } catch (error) {
    console.error("Error fetching recent users:", error);
    return {
      message: error.response?.data?.message || error.message,
      success: false,
      users: []
    };
  }
};

// get recent orders (limit 10 for dashboard)
export const getRecentOrders = async () => {
  try {
    const response = await axiosInstance.get('/admin/recent-orders?limit=10');

    if (!response.data.success) {
      return {
        message: response.data.message,
        success: false,
        orders: []
      };
    }

    return {
      message: response.data.message,
      success: true,
      orders: response.data.orders || []
    };
  } catch (error) {
    console.error("Error fetching recent orders:", error);
    return {
      message: error.response?.data?.message || error.message,
      success: false,
      orders: []
    };
  }
};

// delete user and all associated data
export const deleteUser = async (userId) => {
  try {
    if (!userId) {
      return {
        message: "User ID is required",
        success: false
      };
    }

    const response = await axiosInstance.delete(`/admin/delete-user/${userId}`);

    if (!response.data.success) {
      return {
        message: response.data.message || "Failed to delete user",
        success: false
      };
    }

    return {
      message: response.data.message || "User deleted successfully",
      success: true
    };
  } catch (error) {
    console.error("Error deleting user:", error);
    return {
      message: error.response?.data?.message || error.message || "Failed to delete user",
      success: false
    };
  }
};

// get all inventory
export const getAllInventory = async (page = 1, searchTerm = "", limit = 10) => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    });

    if (searchTerm && searchTerm.trim()) {
      params.append('search', searchTerm.trim());
    }

    const response = await axiosInstance.get(`/admin/inventory?${params.toString()}`);

    if (!response.data.success) {
      return {
        message: response.data.message,
        success: false,
      };
    }

    return {
      message: response.data.message,
      success: true,
      inventory: response.data.inventory,
      pagination: response.data.pagination,
    };
  } catch (error) {
    console.error("Error fetching inventory:", error);
    return {
      message: error.response?.data?.message || error.message,
      success: false,
    };
  }
};

// get inventory by product id
export const getInventoryByProductId = async (productId) => {
  try {
    const response = await axiosInstance.get(`/admin/inventory/product/${productId}`);

    if (!response.data.success) {
      return {
        message: response.data.message,
        success: false,
      };
    }

    return {
      message: response.data.message,
      success: true,
      inventory: response.data.inventory,
    };
  } catch (error) {
    console.error("Error fetching inventory:", error);
    return {
      message: error.response?.data?.message || error.message,
      success: false,
    };
  }
};

// update inventory
export const updateInventory = async (productId, stocks) => {
  try {
    const response = await axiosInstance.patch(`/admin/inventory/${productId}`, {
      stocks: stocks
    }, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.data.success) {
      return {
        message: response.data.message,
        success: false,
      };
    }

    return {
      message: response.data.message,
      success: true,
      inventory: response.data.inventory,
    };
  } catch (error) {
    console.error("Error updating inventory:", error);
    return {
      message: error.response?.data?.message || error.message,
      success: false,
    };
  }
};


