import axiosInstance from "./config";

export const AdminAddProduct = async (productData) => {
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

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };

    const response = await axiosInstance.post(
      "/admin/add-product",
      formData,
      config
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
      message: response.data.message,
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
          "Content-Type": "multipart/form-data",
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


