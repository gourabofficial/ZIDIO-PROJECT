import axiosInstance from "./config";

// update account (avatar)
export const updateAccount = async (formData) => {
  try {
    
    // Log what we're sending to help debug
    console.log(
      "Sending profile update data:",
      formData instanceof FormData ? "FormData object" : formData
    );

    // For FormData, remove the default content-type header (browser will set it with boundary)
    const res = await axiosInstance.patch("/user/update-profile", formData, {
      headers: {
        "Content-Type": undefined, // This removes the default application/json header
      },
    });
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
export const isLogin = async (token = null) => {
  
  try {
    const headers = {
         'Content-Type': 'application/json',
      };

      // If token is provided, add it to headers
      if (token) {
         headers.Authorization =`Bearer ${token}`;
      }
    const res = await axiosInstance.post("/user/is-login", {}, {
      headers,

    });
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

    // Remove the default content-type header for FormData
    const res = await axiosInstance.patch("/user/update-avatar", data, {
      headers: {
        "Content-Type": undefined, // This removes the default application/json header
      },
    });
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


// add wishlist 
export const addToWishlist = async (productId) => {
  try {
    const res = await axiosInstance.post(
      "/wishlist/add-to-wishlist",
      { productId },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return res.data;
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    return {
      message: "Failed to add to wishlist",
      success: false,
    };
  }
}

// remove from wishlist
export const removeFromWishlist = async (productId) => {
  try {
    const res = await axiosInstance.delete(`/wishlist/remove-from-wishlist/${productId}`);
    return res.data;
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    return {
      message: error.response?.data?.message || "Failed to remove from wishlist",
      success: false,
    };
  }
}

//place order 
export const placeOrder = async(orderData) => {
  try {
    const res = await axiosInstance.post("/user/place-order", orderData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res.data;
  } catch (error) {
    console.error("Error placing order:", error);
    return {
      message: error.response?.data?.message || "Failed to place order",
      success: false,
    };
  }
}

// get all orders for user
export const getUserOrders = async (page = 1, limit = 10) => {
  try {
    const res = await axiosInstance.get(`/user/orders?page=${page}&limit=${limit}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching orders:", error);
    return {
      message: error.response?.data?.message || "Failed to fetch orders",
      success: false,
    };
  }
}

// get order by id
export const getOrderById = async (orderId) => {
  try {
    const res = await axiosInstance.get(`/user/orders/${orderId}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching order:", error);
    return {
      message: error.response?.data?.message || "Failed to fetch order",
      success: false,
    };
  }
}

// Payment verification API
export const verifyPayment = async (sessionId) => {
  try {
    const res = await axiosInstance.post("/user/verify-payment", { sessionId }, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res.data;
  } catch (error) {
    console.error("Error verifying payment:", error);
    return {
      message: error.response?.data?.message || "Failed to verify payment",
      success: false,
    };
  }
}

// Get payment status (existing function - kept for backward compatibility)
export const getPaymentStatus = async (sessionId) => {
  try {
    const res = await axiosInstance.get(`/user/payment-status/${sessionId}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching payment status:", error);
    return {
      message: error.response?.data?.message || "Failed to fetch payment status",
      success: false,
    };
  }
}

// ==================== REVIEW API FUNCTIONS ====================

// Add a new product review
export const addProductReview = async (reviewData) => {
  try {
    const res = await axiosInstance.post("/review/add", reviewData);
    return res.data;
  } catch (error) {
    console.error("Error adding product review:", error);
    return {
      message: error.response?.data?.message || "Failed to add review",
      success: false,
    };
  }
};

// Get reviews for a specific product
export const getProductReviews = async (productId, page = 1, limit = 10) => {
  try {
    const res = await axiosInstance.get(`/review/product/${productId}?page=${page}&limit=${limit}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching product reviews:", error);
    return {
      message: error.response?.data?.message || "Failed to fetch reviews",
      success: false,
    };
  }
};

// Get user's reviews
export const getUserReviews = async (page = 1, limit = 10) => {
  try {
    const res = await axiosInstance.get(`/review/user?page=${page}&limit=${limit}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching user reviews:", error);
    return {
      message: error.response?.data?.message || "Failed to fetch user reviews",
      success: false,
    };
  }
};

// Update a review
export const updateProductReview = async (reviewId, reviewData) => {
  try {
    const res = await axiosInstance.put(`/review/${reviewId}`, reviewData);
    return res.data;
  } catch (error) {
    console.error("Error updating review:", error);
    return {
      message: error.response?.data?.message || "Failed to update review",
      success: false,
    };
  }
};

// Delete a review
export const deleteProductReview = async (reviewId) => {
  try {
    const res = await axiosInstance.delete(`/review/${reviewId}`);
    return res.data;
  } catch (error) {
    console.error("Error deleting review:", error);
    return {
      message: error.response?.data?.message || "Failed to delete review",
      success: false,
    };
  }
};

// Check if user can review a product
export const canUserReviewProduct = async (productId, orderId) => {
  try {
    const res = await axiosInstance.get(`/review/can-review/${productId}/${orderId}`);
    return res.data;
  } catch (error) {
    console.error("Error checking review eligibility:", error);
    return {
      message: error.response?.data?.message || "Failed to check review eligibility",
      success: false,
      canReview: false,
    };
  }
};

// Check if user has reviewed a product (regardless of order)
export const getUserProductReview = async (productId) => {
  try {
    const res = await axiosInstance.get(`/review/user-product-review/${productId}`);
    return res.data;
  } catch (error) {
    console.error("Error checking user product review:", error);
    return {
      message: error.response?.data?.message || "Failed to check user product review",
      success: false,
      hasReviewed: false,
      canReview: true,
    };
  }
};