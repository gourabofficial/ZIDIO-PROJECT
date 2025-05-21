import React, { useState, useEffect } from "react";
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
  FiShoppingBag,
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
          className={`fixed top-24 right-4 z-50 px-6 py-4 rounded-lg shadow-lg flex items-center backdrop-blur-md ${
            type === "success"
              ? "bg-purple-900/80 text-purple-200 border border-purple-600/50"
              : "bg-red-900/80 text-red-200 border border-red-600/50"
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

          <motion.div
            initial={{ width: "100%" }}
            animate={{ width: "0%" }}
            transition={{ duration: 3, ease: "linear" }}
            className={`absolute bottom-0 left-0 h-1 ${
              type === "success" 
                ? "bg-gradient-to-r from-indigo-500 to-purple-500" 
                : "bg-gradient-to-r from-red-500 to-pink-500"
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
    currentUser?.cartData?.items
      // Filter out items with null productId before mapping
      .filter(item => item && item.productId)
      .map((item) => ({
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
    <div className="min-h-screen bg-gradient-to-b from-[#0c0e16] to-[#161927] pt-24 pb-16 px-4 md:px-8">
      {/* Toast Notification */}
      <Toast notification={notification} onClose={clearNotification} />

      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 animate-fadeIn opacity-0" style={{ animationDelay: "0.1s", animationFillMode: "forwards" }}>
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 text-transparent bg-clip-text mb-4 md:mb-0">
            Your Cosmic Cart
          </h1>

          <div className="flex items-center py-1.5 px-4 rounded-full bg-indigo-900/30 border border-indigo-500/30">
            <FiShoppingCart className="mr-2 text-purple-400" />
            <span className="text-white font-medium">
              {itemsCount} {itemsCount === 1 ? "Item" : "Items"}
            </span>
          </div>
        </div>

        {error && (
          <div className="mb-6 backdrop-blur-md bg-red-900/20 border border-red-500/30 text-red-400 p-4 rounded-lg text-center animate-fadeIn">
            {error}
          </div>
        )}

        {isLoading && cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 animate-fadeIn">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-purple-200 border-opacity-20 rounded-full"></div>
              <div className="w-16 h-16 border-4 border-r-indigo-500 border-t-purple-500 rounded-full animate-spin absolute top-0 left-0"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-4 h-4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
              </div>
            </div>
            <p className="mt-4 text-gray-300 text-lg font-medium">
              Loading your cart...
            </p>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="backdrop-blur-md bg-black/30 border border-purple-900/30 rounded-xl p-10 max-w-2xl mx-auto text-center animate-fadeIn opacity-0" style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}>
            <div className="relative w-24 h-24 mx-auto mb-6">
              <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 blur-md"></div>
              <div className="relative w-full h-full">
                <FiShoppingCart className="w-full h-full text-purple-400" />
              </div>
            </div>
            <h3 className="text-xl md:text-2xl font-semibold bg-gradient-to-r from-indigo-400 to-purple-400 text-transparent bg-clip-text mb-3">
              Your Cosmic Cart is Empty
            </h3>
            <p className="text-gray-300 mb-6">
              Your journey through the cosmos awaits. Start by adding cosmic heroes to your cart.
            </p>
            <Link
              to="/"
              className="relative group overflow-hidden px-8 py-3 rounded-lg inline-block"
            >
              <span className="absolute inset-0 w-full h-full transition-all duration-300 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 group-hover:from-pink-600 group-hover:via-purple-600 group-hover:to-indigo-600"></span>
              <span className="relative flex items-center justify-center text-white font-medium">
                <FiShoppingBag className="mr-2" />
                Explore Heroes
              </span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fadeIn opacity-0" style={{ animationDelay: "0.3s", animationFillMode: "forwards" }}>
            {/* Cart items */}
            <div className="lg:col-span-2">
              <div className="bg-[#13141f]/70 backdrop-blur-sm rounded-xl overflow-hidden border border-purple-900/30 shadow-lg shadow-purple-900/5">
                <div className="border-b border-purple-900/30 px-6 py-4 flex justify-between items-center">
                  <h2 className="text-xl font-semibold bg-gradient-to-r from-indigo-400 to-purple-400 text-transparent bg-clip-text">
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

                <ul className="divide-y divide-purple-900/10">
                  {cartItems.map((item, index) => (
                    <motion.li
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className={`px-6 py-6 flex flex-col sm:flex-row group hover:bg-indigo-500/5 transition-colors duration-300 ${
                        loadingStates.removeItem && item.id === item.id
                          ? "opacity-50"
                          : ""
                      }`}
                    >
                      {/* Product image */}
                      <div className="sm:flex-shrink-0 mb-4 sm:mb-0 relative">
                        <div className="relative overflow-hidden rounded-lg bg-indigo-900/20 p-1 border border-purple-500/20 shadow-sm shadow-purple-500/10">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full sm:w-28 h-28 object-contain rounded transition-transform duration-700 group-hover:scale-110"
                            onError={(e) => {
                              e.target.src = "https://ext.same-assets.com/1329671863/375037467.gif";
                            }}
                          />
                        </div>
                        <div className="absolute -inset-0.5 rounded-lg bg-gradient-to-r from-indigo-500/0 to-purple-500/0 group-hover:from-indigo-500/20 group-hover:to-purple-500/20 opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-500"></div>
                      </div>

                      {/* Product details */}
                      <div className="sm:ml-6 flex-1">
                        <div className="flex justify-between">
                          <Link to={`/product/${item.handle}`}>
                            <h3 className="text-lg font-medium text-white hover:text-purple-300 transition-colors duration-200">
                              {item.title}
                            </h3>
                          </Link>
                          <button
                            onClick={() => handleRemoveItem(item.productId)}
                            disabled={loadingStates.removeItem}
                            className={`text-gray-400 hover:text-red-400 hover:scale-110 transition-all duration-200 ${
                              loadingStates.removeItem
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }`}
                          >
                            <FiX />
                          </button>
                        </div>
                        <p className="mt-1 text-sm text-indigo-300/60">
                          Item #{item.productId.substring(0, 8)}
                        </p>

                        <div className="mt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                          {/* Quantity selector */}
                          <div className="flex items-center border border-indigo-500/30 rounded-full bg-indigo-900/30 backdrop-blur-sm shadow-sm shadow-indigo-500/10 overflow-hidden">
                            <button
                              onClick={() =>
                                handleQuantityChange(
                                  item.productId,
                                  Math.max(1, item.quantity - 1)
                                )
                              }
                              className={`px-3 py-1.5 text-gray-400 hover:text-white hover:bg-indigo-600/20 transition-all ${
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
                            <span className="px-3 py-1.5 text-white font-medium min-w-[30px] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                handleQuantityChange(
                                  item.productId,
                                  item.quantity + 1
                                )
                              }
                              className={`px-3 py-1.5 text-gray-400 hover:text-white hover:bg-indigo-600/20 transition-all ${
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
                            <span className="text-lg font-semibold bg-gradient-to-r from-indigo-400 to-purple-400 text-transparent bg-clip-text">
                              ₹
                              {(
                                calculateItemPrice(item.price, item.discount) *
                                item.quantity
                              ).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Order summary */}
            <div className="lg:col-span-1">
              <div className="bg-[#13141f]/70 backdrop-blur-sm rounded-xl overflow-hidden border border-purple-900/30 shadow-lg shadow-purple-900/5 sticky top-24">
                <div className="px-6 py-4 border-b border-purple-900/30">
                  <h2 className="text-xl font-semibold bg-gradient-to-r from-indigo-400 to-purple-400 text-transparent bg-clip-text">
                    Order Summary
                  </h2>
                </div>

                <div className="px-6 py-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Subtotal</span>
                    <span className="text-white font-medium">
                      ₹{subtotal.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Shipping</span>
                    <span className="text-white">
                      {shipping === 0 ? (
                        <span className="bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text font-medium">Free</span>
                      ) : (
                        `₹${shipping.toLocaleString()}`
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-purple-900/30">
                    <span className="text-white font-bold">Total</span>
                    <span className="text-xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
                      ₹{total.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="px-6 py-6 bg-indigo-900/20 border-t border-purple-900/30">
                  <button
                    onClick={handleContinueToCheckout}
                    disabled={isLoading || cartItems.length === 0}
                    className="relative group w-full py-3.5 px-4 rounded-lg overflow-hidden"
                  >
                    <span className="absolute inset-0 w-full h-full transition-all duration-300 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 group-hover:from-pink-600 group-hover:via-purple-600 group-hover:to-indigo-600"></span>
                    <span className="relative flex items-center justify-center text-white font-medium">
                      {isLoading ? (
                        <span className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </span>
                      ) : currentUser ? (
                        "Continue to Checkout"
                      ) : (
                        "Sign in to Checkout"
                      )}
                    </span>
                  </button>

                  <div className="mt-5 text-center">
                    {shipping === 0 ? (
                      <div className="flex items-center justify-center space-x-2 text-green-400 text-sm">
                        <FiCheckCircle />
                        <span>Free cosmic shipping applied</span>
                      </div>
                    ) : (
                      <div className="text-indigo-300/70 text-sm">
                        Free cosmic shipping on orders over ₹2,000
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {cartItems.length > 0 && (
          <div className="mt-12 text-center animate-fadeIn opacity-0" style={{ animationDelay: "0.6s", animationFillMode: "forwards" }}>
            <Link 
              to="/" 
              className="relative inline-flex items-center overflow-hidden px-6 py-2.5 rounded-full group"
            >
              <span className="absolute inset-0 w-full h-full transition-all duration-300 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 group-hover:from-indigo-600/30 group-hover:to-purple-600/30"></span>
              <span className="relative flex items-center justify-center text-indigo-400 group-hover:text-indigo-300 font-medium transition-colors duration-200">
                <FiShoppingBag className="mr-2" />
                Continue Shopping
              </span>
            </Link>
          </div>
        )}
      </div>
      
      {/* Animation styles */}
      <style jsx="true">{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Cart;