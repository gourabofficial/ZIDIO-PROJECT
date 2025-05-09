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
