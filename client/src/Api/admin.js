import axiosInstance from "./config";

export const addProduct = async (formData) => {
  try {
    const res = await axiosInstance.post('/admin/add-product', formData);
    return res.data;
  } catch (error) {
    console.error("Error adding product:", error);
    console.error("Error details:", error.response?.data);
    return {
      message: error.response?.data?.message || "Failed to add product",
      success: false
    };
  }
}

export const updateProduct = async (id, formData) => {
  try {
    const res = await axiosInstance.put(`/admin/update-product/${id}`, formData);
    return res.data;
  } catch (error) {
    console.error("Error updating product:", error);
    return {
      message: error.response?.data?.message || "Failed to update product",
      success: false
    };
  }
}

export const deleteProduct = async (id) => {
  try {
    const res = await axiosInstance.delete(`/admin/delete-product/${id}`);
    return res.data;
  } catch (error) {
    console.error("Error deleting product:", error);
    return {
      message: error.response?.data?.message || "Failed to delete product",
      success: false
    };
  }
}

export const getAllProducts = async () => {
  try {
    const res = await axiosInstance.get('/products');
    return res.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    return {
      message: error.response?.data?.message || "Failed to fetch products",
      success: false
    };
  }
}

export const getProduct = async (id) => {
  try {
    const res = await axiosInstance.get(`/products/${id}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching product:", error);
    return {
      message: error.response?.data?.message || "Failed to fetch product",
      success: false
    };
  }
}