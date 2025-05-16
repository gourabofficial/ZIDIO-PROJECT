import axiosInstance from "./config";

// update account (avatar)
export const updateAccount = async (formData) => {
  try {
    // Log what we're sending to help debug
    console.log(
      "Sending profile update data:",
      formData instanceof FormData ? "FormData object" : formData
    );

    // For FormData, don't set content-type header (browser will set it with boundary)
    // Use the same approach that worked for updateUserDetails
    const res = await axiosInstance.patch("/user/update-profile", formData);
    return res.data;
  } catch (error) {
    console.error("Error updating account:", error);

    // Add more detailed error logging
    if (error.response) {
      console.error("Server response for account update:", {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers,
      });
    } else if (error.request) {
      console.error("No response received for account update:", error.request);
    }

    return {
      message: error.response?.data?.message || "Failed to update account",
      success: false,
    };
  }
};

// update userDetails
export const updateUserDetails = async (userData) => {
  try {
    // Log the data being sent to help with debugging
    console.log("Sending user update data:", userData);

    const res = await axiosInstance.patch("/user/update-user", userData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res.data;
  } catch (error) {
    console.error("Error updating user details:", error);

    // Log more detailed error information
    if (error.response) {
      console.error("Server response:", {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers,
      });
    } else if (error.request) {
      console.error("No response received:", error.request);
    }

    return {
      message: error.response?.data?.message || "Failed to update user details",
      success: false,
    };
  }
};

// update address
export const updateAddress = async (addressData) => {
  try {
    const res = await axiosInstance.patch("/user/update-address", addressData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res.data;
  } catch (error) {
    console.error("Error updating address:", error);

    // Log more detailed error information
    if (error.response) {
      console.error("Server response:", {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers,
      });
    }

    return {
      message: error.response?.data?.message || "Failed to update address",
      success: false,
    };
  }
};

// add address
export const addAddress = async (addressData) => {
  try {
    const res = await axiosInstance.post("/user/add-address", addressData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res.data;
  } catch (error) {
    console.error("Error adding address:", error);

    // Log more detailed error information
    if (error.response) {
      console.error("Server response:", {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers,
      });
    }

    return {
      message: error.response?.data?.message || "Failed to add address",
      success: false,
    };
  }
};

// is login
export const isLogin = async () => {
  try {
    const res = await axiosInstance.post("/user/is-login");
    return res.data;
  } catch (error) {
    console.error("Error checking login status:", error);
    return {
      message: "Failed to check login status",
      success: false,
    };
  }
};

// update avatar
export const updateAvatar = async (avatarData) => {
  try {
    let data;

    if (avatarData instanceof FormData) {
      data = avatarData;
      // Log form data entries to verify content
      console.log("Form data entries:", Array.from(data.entries()));
    } else if (avatarData.file) {
      // Create new FormData if not already FormData
      data = new FormData();
      data.append("file", avatarData.file);
      console.log("Created new FormData with file");
    } else {
      throw new Error("Invalid avatar data format");
    }

    // Don't manually set Content-Type for FormData
    const res = await axiosInstance.patch("/user/update-avatar", data);
    return res.data;
  } catch (error) {
    console.error("Error updating avatar:", error);

    if (error.response) {
      console.error("Server response details:", {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers,
      });
    }

    return {
      message: error.response?.data?.message || "Failed to update avatar",
      success: false,
    };
  }
};

// Update avatar URL (use this when you have a URL, not a file)
export const updateAvatarUrl = async (avatarUrl) => {
  try {
    const res = await axiosInstance.patch(
      "/user/update-avatar",
      { avatarUrl },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return res.data;
  } catch (error) {
    console.error("Error updating avatar URL:", error);

    if (error.response) {
      console.error("Server response for avatar update:", {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers,
      });
    }

    return {
      message: error.response?.data?.message || "Failed to update avatar",
      success: false,
    };
  }
};

// Add this new function to fetch address by ID
export const getAddressById = async (addressId) => {
  try {
    const res = await axiosInstance.get(`/user/address/${addressId}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching address:", error);
    return {
      message: "Failed to fetch address",
      success: false,
    };
  }
};

export const addToCart = async (cartToBeSubmitted) => {
  try {
    const res = await axiosInstance.post(
      "/cart/add-to-cart",
      cartToBeSubmitted,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return res.data;
  } catch (error) {
    console.error("Error adding to cart:", error);
    return {
      message: "Failed to add to cart",
      success: false,
    };
  }
};

export const removeFromCart = async (productId, quantity) => {
  try {
    const res = await axiosInstance.post(
      "/cart/remove-to-cart",
      {
        productId,
        quantity,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return res.data;
  } catch (error) {
    console.error("Error removing from cart:", error);
    return {
      message: "Failed to remove from cart",
      success: false,
    };
  }
};

// clear cart
export const clearCart = async () => {
  try {
    const res = await axiosInstance.post("/cart/clear-cart", {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res.data;
  } catch (error) {
    console.error("Error clearing cart:", error);
    return {
      message: "Failed to clear cart",
      success: false,
    };
  }
};

// update quantity
export const updateQuantity = async (productId, quantity, action) => {
  try {
    const res = await axiosInstance.put(
      "/cart/update-quantity",
      {
        productId,
        quantity,
        action,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return res.data;
  } catch (error) {
    console.error("Error updating quantity:", error);
    return {
      message: "Failed to update quantity",
      success: false,
    };
  }
};
