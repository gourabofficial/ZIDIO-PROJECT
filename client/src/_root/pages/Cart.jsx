import React, { useState } from "react";
import { useAuthdata } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";  
import {
  FiShoppingCart,
  FiTrash2,
  FiMinus,
  FiPlus,
  FiArrowLeft,
  FiX,
  FiCheckCircle, 
  FiAlertCircle, 
} from "react-icons/fi";

import { removeFromCart, clearCart, updateQuantity } from "../../Api/user.js";

// Toast component with Framer Motion
const Toast = ({ notification, onClose }) => {
  if (!notification) return null;

  const { message, type } = notification;

  return (
    <AnimatePresence>
      {notification && (
        <motion.div
          initial={{ opacity: 0, y: -20, x: 20 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, y: -20, x: 20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className={`fixed top-24 right-4 z-50 px-6 py-4 rounded-lg shadow-lg flex items-center ${
            type === "success"
              ? "bg-purple-900/90 text-purple-200 border border-purple-700"
              : "bg-red-900/90 text-red-200 border border-red-700"
          }`}
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2, delay: 0.1 }}
            className="mr-3"
          >
            {type === "success" ? (
              <FiCheckCircle className="text-green-400 text-xl" />
            ) : (
              <FiAlertCircle className="text-red-400 text-xl" />
            )}
          </motion.div>
          <p>{message}</p>
          <button
            onClick={onClose}
            className="ml-3 text-gray-400 hover:text-white transition-colors"
          >
            <FiX />
          </button>

          {/* Progress bar to show time remaining */}
          <motion.div
            initial={{ width: "100%" }}
            animate={{ width: "0%" }}
            transition={{ duration: 3, ease: "linear" }}
            className={`absolute bottom-0 left-0 h-1 ${
              type === "success" ? "bg-purple-500" : "bg-red-500"
            }`}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const Cart = () => {
  // More granular loading states for different operations
  const [loadingStates, setLoadingStates] = useState({
    removeItem: false,
    clearCart: false,
    updateQuantity: false,
  });
  const [error, setError] = useState("");
  const [notification, setNotification] = useState(null);
  const navigate = useNavigate();

  const { currentUser, refetchUserData } = useAuthdata();

  // Show notification function with improved handling
  const showNotification = (message, type = "success") => {
    // Close any existing notification first
    setNotification(null);

    // Small delay to ensure animation works correctly if notifications are shown in quick succession
    setTimeout(() => {
      setNotification({ message, type });
    }, 100);

    // Auto dismiss after 3 seconds
    setTimeout(() => setNotification(null), 3000);
  };

  // Clear notification function
  const clearNotification = () => setNotification(null);

  // Extract cart data
  const cartItems =
    currentUser?.cartData?.items.map((item) => ({
      id: item._id,
      productId: item.productId._id,
      title: item.productId.name,
      price: item.productId.price,
      image: item.productId.images[0]?.imageUrl,
      quantity: item.quantity,
      discount: item.productId.discount,
      handle: item.productId.product_id,
    })) || [];

  // Calculate cart metrics
  const itemsCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const calculateItemPrice = (price, discount) => {
    return discount ? price - (price * discount) / 100 : price;
  };

  const subtotal = cartItems.reduce(
    (total, item) =>
      total + calculateItemPrice(item.price, item.discount) * item.quantity,
    0
  );

  // Shipping is free over 2000
  const shipping = subtotal > 2000 ? 0 : 499;

  // Calculate total
  const total = subtotal + shipping;

  const handleQuantityChange = async (productId, newQuantity) => {
    try {
      setLoadingStates((prev) => ({ ...prev, updateQuantity: true }));
      setError("");

      // If new quantity is 0, remove item completely
      if (newQuantity === 0) {
        return handleRemoveItem(productId);
      }

      // Determine action based on whether we're increasing or decreasing
      const currentItem = cartItems.find(
        (item) => item.productId === productId
      );
      const action =
        newQuantity > currentItem.quantity ? "increase" : "decrease";

      // Call the API with productId, the new quantity, and action
      const response = await updateQuantity(
        productId,
        Math.abs(newQuantity - currentItem.quantity),
        action
      );

      if (response.success) {
        await refetchUserData(); // Refresh cart data
        // Improved toast messages based on the action
        showNotification(
          action === "increase"
            ? "Item quantity increased"
            : "Item quantity decreased",
          "success"
        );
      } else {
        setError(response.message || "Failed to update quantity");
        showNotification(
          response.message || "Failed to update quantity",
          "error"
        );
      }
    } catch (err) {
      console.error("Error updating quantity:", err);
      setError("Something went wrong. Please try again.");
      showNotification("Something went wrong. Please try again.", "error");
    } finally {
      setLoadingStates((prev) => ({ ...prev, updateQuantity: false }));
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      setLoadingStates((prev) => ({ ...prev, removeItem: true }));
      setError("");

      const response = await removeFromCart(productId, 0); // Pass 0 quantity to remove item completely

      if (response.success) {
        await refetchUserData(); // Refresh cart data
        showNotification("Item removed from cart successfully", "success");
      } else {
        setError(response.message || "Failed to remove item");
        showNotification(response.message || "Failed to remove item", "error");
      }
    } catch (err) {
      console.error("Error removing item:", err);
      setError("Something went wrong. Please try again.");
      showNotification("Something went wrong. Please try again.", "error");
    } finally {
      setLoadingStates((prev) => ({ ...prev, removeItem: false }));
    }
  };

  const handleClearCart = async () => {
    try {
      setLoadingStates((prev) => ({ ...prev, clearCart: true }));
      setError("");

      // Fix the API call to not include headers in the wrong position
      const response = await clearCart();

      if (response.success) {
        await refetchUserData(); // Refresh cart data
        showNotification("Your cart has been cleared", "success");
      } else {
        setError(response.message || "Failed to clear cart");
        showNotification(response.message || "Failed to clear cart", "error");
      }
    } catch (err) {
      console.error("Error clearing cart:", err);
      setError("Something went wrong. Please try again.");
      showNotification("Something went wrong. Please try again.", "error");
    } finally {
      setLoadingStates((prev) => ({ ...prev, clearCart: false }));
    }
  };

  const handleContinueToCheckout = () => {
    if (!currentUser) {
      navigate("/login", { state: { from: "/cart" } });
    } else {
      navigate("/checkout");
    }
  };

  // Check if any operation is in progress
  const isLoading = Object.values(loadingStates).some((state) => state);

  return (
    <div className="min-h-screen bg-[#0c0e16] pt-20">
      {/* Replace the current notification display with our new Toast component */}
      <Toast notification={notification} onClose={clearNotification} />

      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col mb-6">
          <h1 className="text-3xl font-bold text-white mb-4">Your Cart</h1>

          <div className="flex justify-between items-center">
            <Link
              to="/"
              className="flex items-center text-purple-400 hover:text-purple-300 transition-colors"
            >
              <FiArrowLeft className="mr-2" />
              <span>Continue Shopping</span>
            </Link>

            <div className="flex items-center">
              <FiShoppingCart className="text-purple-400 mr-2" />
              <span className="text-white font-semibold">
                {itemsCount} {itemsCount === 1 ? "Item" : "Items"}
              </span>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-900/20 text-red-400 p-4 rounded-lg text-center">
            {error}
          </div>
        )}

        {isLoading && cartItems.length === 0 ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 rounded-full bg-[#1e293b] flex items-center justify-center mx-auto mb-6">
              <FiShoppingCart className="text-4xl text-purple-400" />
            </div>
            <h2 className="text-2xl font-semibold text-white mb-2">
              Your cart is empty
            </h2>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              Start adding items to your cart to begin shopping.
            </p>
            <Link
              to="/"
              className="inline-flex items-center px-8 py-4 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium hover:from-indigo-600 hover:to-purple-700 transition-all"
            >
              Explore Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart items */}
            <div className="lg:col-span-2">
              <div className="bg-[#151828] rounded-lg shadow-lg overflow-hidden">
                <div className="border-b border-gray-800 px-6 py-4 flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-white">
                    Cart Items
                  </h2>
                  <button
                    onClick={handleClearCart}
                    disabled={loadingStates.clearCart}
                    className={`text-gray-400 hover:text-red-400 flex items-center text-sm transition-colors ${
                      loadingStates.clearCart
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    {loadingStates.clearCart ? (
                      <span className="animate-pulse">Clearing...</span>
                    ) : (
                      <>
                        <FiTrash2 className="mr-1" />
                        Clear Cart
                      </>
                    )}
                  </button>
                </div>

                <ul className="divide-y divide-gray-800">
                  {cartItems.map((item) => (
                    <li
                      key={item.id}
                      className={`px-6 py-6 flex flex-col sm:flex-row ${
                        loadingStates.removeItem && item.id === item.id
                          ? "opacity-50"
                          : ""
                      }`}
                    >
                      {/* Product image */}
                      <div className="sm:flex-shrink-0 mb-4 sm:mb-0">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full sm:w-28 h-28 object-cover rounded-lg"
                        />
                      </div>

                      {/* Product details */}
                      <div className="sm:ml-6 flex-1">
                        <div className="flex justify-between">
                          <Link to={`/product/${item.handle}`}>
                            <h3 className="text-lg font-medium text-white hover:text-purple-400">
                              {item.title}
                            </h3>
                          </Link>
                          <button
                            onClick={() => handleRemoveItem(item.productId)}
                            disabled={loadingStates.removeItem}
                            className={`text-gray-400 hover:text-red-400 ${
                              loadingStates.removeItem
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }`}
                          >
                            <FiX />
                          </button>
                        </div>
                        <p className="mt-1 text-sm text-gray-500">
                          Item #{item.productId.substring(0, 8)}
                        </p>

                        <div className="mt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                          {/* Quantity selector */}
                          <div className="flex items-center border border-gray-700 rounded-md bg-gray-800/50">
                            <button
                              onClick={() =>
                                handleQuantityChange(
                                  item.productId,
                                  Math.max(1, item.quantity - 1)
                                )
                              }
                              className={`px-3 py-1.5 text-gray-400 hover:text-white transition-colors ${
                                loadingStates.updateQuantity ||
                                item.quantity <= 1
                                  ? "opacity-50 cursor-not-allowed"
                                  : ""
                              }`}
                              disabled={
                                loadingStates.updateQuantity ||
                                item.quantity <= 1
                              }
                            >
                              <FiMinus size={14} />
                            </button>
                            <span className="px-3 py-1.5 text-white font-medium">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                handleQuantityChange(
                                  item.productId,
                                  item.quantity + 1
                                )
                              }
                              className={`px-3 py-1.5 text-gray-400 hover:text-white transition-colors ${
                                loadingStates.updateQuantity
                                  ? "opacity-50 cursor-not-allowed"
                                  : ""
                              }`}
                              disabled={loadingStates.updateQuantity}
                            >
                              <FiPlus size={14} />
                            </button>
                          </div>

                          {/* Price */}
                          <div className="mt-4 sm:mt-0">
                            {item.discount > 0 && (
                              <span className="text-sm text-gray-400 line-through mr-2">
                                ₹{item.price.toLocaleString()}
                              </span>
                            )}
                            <span className="text-lg font-semibold text-purple-400">
                              ₹
                              {(
                                calculateItemPrice(item.price, item.discount) *
                                item.quantity
                              ).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Order summary */}
            <div className="lg:col-span-1">
              <div className="bg-[#151828] rounded-lg shadow-lg sticky top-24">
                <div className="px-6 py-4 border-b border-gray-800">
                  <h2 className="text-xl font-semibold text-white">
                    Order Summary
                  </h2>
                </div>

                <div className="px-6 py-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Subtotal</span>
                    <span className="text-white">
                      ₹{subtotal.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Shipping</span>
                    <span className="text-white">
                      {shipping === 0 ? (
                        <span className="text-green-400">Free</span>
                      ) : (
                        `₹${shipping.toLocaleString()}`
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between pt-4 border-t border-gray-800">
                    <span className="text-white font-bold">Total</span>
                    <span className="text-xl font-bold text-purple-400">
                      ₹{total.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="px-6 py-4">
                  <button
                    onClick={handleContinueToCheckout}
                    disabled={isLoading || cartItems.length === 0}
                    className={`w-full py-3 px-4 flex items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium rounded-md transition-all ${
                      isLoading || cartItems.length === 0
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    {currentUser
                      ? "Continue to Checkout"
                      : "Sign in to Checkout"}
                  </button>

                  <p className="text-center text-sm text-gray-500 mt-4">
                    {shipping === 0 ? (
                      <span className="text-green-400">
                        ✓ Free shipping applied
                      </span>
                    ) : (
                      <span>Free shipping on orders over ₹2,000</span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
