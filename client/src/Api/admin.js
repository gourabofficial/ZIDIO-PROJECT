import axiosInstance from "./config";

export const AdminAddProduct = async (productData) => {
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
    const response = await axiosInstance.get(
      `/admin/get-search-all-products?query=${query}&page=${page}&limit=${limit}`
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
