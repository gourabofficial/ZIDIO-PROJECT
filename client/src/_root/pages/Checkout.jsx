import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthdata } from "../../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiUser,
  FiMapPin,
  FiPhone,
  FiCreditCard,
  FiTruck,
  FiShoppingBag,
  FiArrowLeft,
  FiEdit3,
  FiPackage,
  FiLock,
  FiCheck,
  FiMinus,
  FiPlus,
  FiChevronDown,
  FiChevronUp,
  FiSettings,
  FiAlertCircle,
} from "react-icons/fi";
import { placeOrder } from "../../Api/user";
import toast from "react-hot-toast";


const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Handle both cart checkout and buy now
  const cartItems = location.state?.cartItems || [];
  const orderSummary = location.state?.orderSummary || {};
  const isBuyNow = location.state?.type === 'buyNow';
  const buyNowProduct = location.state?.product;
  
  const { currentUser, isAuth, isLoaded } = useAuthdata();

  // State for payment method and processing
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [error, setError] = useState("");
  const [orderData, setOrderData] = useState(null);
  
  // State for Buy Now selections
  const [buyNowQuantity, setBuyNowQuantity] = useState(1);
  const [buyNowSelectedSize, setBuyNowSelectedSize] = useState("");
  const [isSizeDropdownOpen, setIsSizeDropdownOpen] = useState(false);
  
  // State for cart item size and quantity selections
  const [cartItemSelections, setCartItemSelections] = useState({});
  
  // Refs for scroll handling
  const scrollContainerRef = useRef(null);
  
  // Ref for dropdown click outside handling
  const sizeDropdownRef = useRef(null);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sizeDropdownRef.current && !sizeDropdownRef.current.contains(event.target)) {
        setIsSizeDropdownOpen(false);
      }
    };
    
    if (isSizeDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSizeDropdownOpen]);

  // Initialize cart item selections when cartItems load
  useEffect(() => {
    if (!isBuyNow && cartItems.length > 0) {
      const initialSelections = {};
      cartItems.forEach(item => {
        if (!cartItemSelections[item.productId]) {
          initialSelections[item.productId] = {
            selectedSize: '', // User must select size
            quantity: item.quantity || 1
          };
        }
      });
      if (Object.keys(initialSelections).length > 0) {
        setCartItemSelections(prev => ({ ...prev, ...initialSelections }));
      }
    }
  }, [cartItems, isBuyNow]);
  
  // Handle mouse wheel scrolling for checkout container
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleWheel = (e) => {
      // Prevent default smooth scroll behavior
      e.preventDefault();
      e.stopPropagation();
      
      // Apply direct scroll
      const delta = e.deltaY;
      container.scrollTop += delta;
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    
    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, []);
  
  // Calculate order summary for Buy Now
  const calculateBuyNowSummary = () => {
    if (!buyNowProduct) return {};
    
    const originalPrice = buyNowProduct.price;
    const discount = buyNowProduct.discount || 0;
    const discountedPrice = originalPrice - (originalPrice * discount / 100);
    const subtotal = discountedPrice * buyNowQuantity;
    const shipping = subtotal >= 2000 ? 0 : 49;
    const total = subtotal + shipping;
    
    return {
      subtotal,
      shipping,
      total
    };
  };

  // Calculate updated order summary for cart items
  const calculateUpdatedCartSummary = () => {
    if (isBuyNow || cartItems.length === 0) return orderSummary;
    
    let updatedSubtotal = 0;
    cartItems.forEach(item => {
      const selections = cartItemSelections[item.productId];
      const quantity = selections?.quantity || item.quantity;
      const originalPrice = item.price;
      const discount = item.discount || 0;
      const discountedPrice = originalPrice - (originalPrice * discount / 100);
      updatedSubtotal += discountedPrice * quantity;
    });
    
    const shipping = updatedSubtotal >= 2000 ? 0 : 49;
    const total = updatedSubtotal + shipping;
    
    return {
      subtotal: updatedSubtotal,
      shipping: shipping,
      total: total,
      itemsCount: Object.values(cartItemSelections).reduce((acc, sel) => acc + (sel?.quantity || 1), 0)
    };
  };

  // Use appropriate items and summary based on flow type
  const currentItems = isBuyNow ? [{
    id: buyNowProduct?._id,
    productId: buyNowProduct?._id,
    title: buyNowProduct?.name,
    price: buyNowProduct?.price,
    discount: buyNowProduct?.discount || 0,
    quantity: buyNowQuantity,
    selectedSize: buyNowSelectedSize,
    image: buyNowProduct?.images?.[0]?.imageUrl || "https://ext.same-assets.com/1329671863/375037467.gif"
  }] : cartItems.map(item => ({
    ...item,
    quantity: cartItemSelections[item.productId]?.quantity || item.quantity,
    selectedSize: cartItemSelections[item.productId]?.selectedSize || ''
  }));

  const currentOrderSummary = isBuyNow ? calculateBuyNowSummary() : calculateUpdatedCartSummary();

  // Helper functions for cart item selections
  const updateCartItemSize = (productId, size) => {
    setCartItemSelections(prev => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        selectedSize: size
      }
    }));
  };
  
  const updateCartItemQuantity = (productId, quantity) => {
    setCartItemSelections(prev => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        quantity: Math.max(1, quantity)
      }
    }));
  };

  // Early returns for invalid states
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0c0e16] to-[#161927] pt-24 flex items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-purple-200 border-opacity-20 rounded-full"></div>
          <div className="w-16 h-16 border-4 border-r-indigo-500 border-t-purple-500 rounded-full animate-spin absolute top-0 left-0"></div>
        </div>
      </div>
    );
  }

  if (!isAuth || !currentUser) {
    navigate("/login", { state: { from: "/checkout" } });
    return null;
  }

  if (currentItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0c0e16] to-[#161927] pt-24 px-4 md:px-8">
        <div className="max-w-2xl mx-auto text-center py-20">
          <FiShoppingBag className="w-24 h-24 text-purple-400 mx-auto mb-6" />
          <h2 className="text-2xl font-semibold text-white mb-4">
            No items to checkout
          </h2>
          <p className="text-gray-300 mb-6">
            {isBuyNow ? "Product information is missing." : "Your cart is empty. Add some items before proceeding to checkout."}
          </p>
          <button
            onClick={() => navigate(isBuyNow ? -1 : "/")}
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-indigo-600 transition-all duration-300"
          >
            {isBuyNow ? "Go Back" : "Continue Shopping"}
          </button>
        </div>
      </div>
    );
  }

  //add address function
  const addAddress = () => {
    navigate("/account-settings", { state: { from: "/checkout" } });
  }

  // edit address function
  const editAddress = () => {
    navigate("/account-settings", { state: { from: "/checkout" } });
  }

  // Handler function for placing order
  const handlePlaceOrder = async () => {
    // Check if user has an address before placing order
    if (!currentUser.address) {
      toast.error("Please add your address first");
      return;
    }

    try {
      setIsProcessing(true);
      setError("");
      
      // Debug: Log the current size selection
      if (isBuyNow) {
        console.log("Buy Now Selected Size:", buyNowSelectedSize);
        console.log("Buy Now Quantity:", buyNowQuantity);
        console.log("Buy Now Product Sizes:", buyNowProduct.size);
      }
      
      // Validation for Buy Now flow
      if (isBuyNow) {
        // Check if product has sizes and if size selection is required
        if (buyNowProduct.size && buyNowProduct.size.length > 0) {
          if (!buyNowSelectedSize || buyNowSelectedSize.trim() === "") {
            setError("Please select a size before placing the order.");
            setIsProcessing(false);
            return;
          }
        }
        if (buyNowQuantity < 1) {
          setError("Please select a valid quantity.");
          setIsProcessing(false);
          return;
        }
      } else {
        // Validation for cart checkout flow
        // Check if all cart items have size selections
        const missingSelections = cartItems.filter(item => {
          const selections = cartItemSelections[item.productId];
          // Get product info to check if it has size options
          const productHasSizes = true; // Assuming all products need size selection as per requirements
          return productHasSizes && (!selections?.selectedSize || selections.selectedSize.trim() === "");
        });
        
        if (missingSelections.length > 0) {
          setError("Please select a size for all items before placing the order.");
          setIsProcessing(false);
          return;
        }
      }
      
      // Create order items with proper size validation
      const orderItems = currentItems.map((item) => {
        let selectedSize;
        if (isBuyNow) {
          if (buyNowProduct.size && buyNowProduct.size.length > 0) {
            selectedSize = buyNowSelectedSize;
          } else {
            selectedSize = "M"; // fallback
          }
        } else {
          // Use cart item selections
          const selections = cartItemSelections[item.productId];
          selectedSize = selections?.selectedSize || "M"; // fallback to M if no selection
        }
        return {
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
          discount: item.discount,
          selectedSize: selectedSize,
        };
      });
      
      // Additional validation to ensure all items have required size
      const invalidItems = orderItems.filter(item => !item.selectedSize || item.selectedSize.trim() === "");
      console.log("Order Items before validation:", orderItems);
      console.log("Invalid items:", invalidItems);
      if (invalidItems.length > 0) {
        setError("Please select a size for all items before placing the order.");
        setIsProcessing(false);
        return;
      }
      
      const orderDataToSubmit = {
        userId: currentUser._id,
        items: orderItems,
        shippingAddress: currentUser.address,
        paymentMethod: paymentMethod,
        orderSummary: currentOrderSummary,
        orderDate: new Date().toISOString(),
        orderType: isBuyNow ? 'buyNow' : 'cart', // Add order type for tracking
      };
      
      // Debug: Log order data before submission
      console.log("Order Data to Submit:", JSON.stringify(orderDataToSubmit, null, 2));
      
      const response = await placeOrder(orderDataToSubmit);
      
      if (response.success) {
        // Handle different payment methods
        if (paymentMethod === "ONLINE" && response.order.paymentUrl) {
          // For online payments, redirect to Stripe checkout
          window.location.href = response.order.paymentUrl;
        } else {
          // For COD, show success message and redirect to orders
          setOrderData(response.order);
          setOrderPlaced(true);
          
          // Redirect to orders page after 3 seconds
          setTimeout(() => {
            navigate("/orders", { 
              state: { 
                newOrder: response.order,
                showSuccess: true 
              } 
            });
          }, 3000);
        }
      } else {
        throw new Error(response.message || "Failed to place order");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      setError(error.message || "Failed to place order. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Order Success Animation
  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0c0e16] to-[#161927] pt-24 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center max-w-md mx-auto px-6"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-24 h-24 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <FiCheck className="w-12 h-12 text-white" />
          </motion.div>
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Order Placed Successfully!
            </h2>
            
            {orderData && (
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 mb-6 border border-purple-500/20">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Order ID:</span>
                    <span className="text-white font-mono">#{orderData.trackingId}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Total Amount:</span>
                    <span className="text-green-400 font-semibold">₹{orderData.totalAmount?.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Payment Method:</span>
                    <span className="text-purple-400">
                      {orderData.paymentMethod === "online" ? "Online Payment" : "Cash on Delivery"}
                    </span>
                  </div>
                </div>
              </div>
            )}
            
            <p className="text-gray-300 mb-4">
              Thank you for your order! You will be redirected to your orders page.
            </p>
            
            <div className="flex items-center justify-center space-x-2 text-purple-400">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0c0e16] to-[#161927] pt-24 pb-16 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate(isBuyNow ? -1 : "/cart")}
            className="mr-4 p-2 text-gray-400 hover:text-white hover:bg-indigo-600/20 rounded-lg transition-all duration-200"
          >
            <FiArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
              {isBuyNow ? "Buy Now" : "Checkout"}
            </h1>
            <p className="text-gray-300 text-sm mt-1">
              {isBuyNow ? "Complete your purchase for this item" : "Review your order and complete your purchase"}
            </p>
          </div>
        </div>

        {/* Progress Steps - Updated for Buy Now */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4 mb-6">
            {!isBuyNow && (
              <>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                    <FiCheck className="w-4 h-4 text-white" />
                  </div>
                  <span className="ml-2 text-white text-sm">Cart</span>
                </div>
                <div className="w-16 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
              </>
            )}
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">{isBuyNow ? "1" : "2"}</span>
              </div>
              <span className="ml-2 text-white text-sm font-medium">
                {isBuyNow ? "Product" : "Checkout"}
              </span>
            </div>
            <div className="w-16 h-0.5 bg-gray-600"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                <span className="text-gray-400 text-sm">{isBuyNow ? "2" : "3"}</span>
              </div>
              <span className="ml-2 text-gray-400 text-sm">Payment</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          <div className="space-y-6">
            {/* Shipping Address */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-[#13141f]/70 backdrop-blur-sm rounded-xl border border-purple-900/30 shadow-lg"
            >
              <div className="border-b border-purple-900/30 px-6 py-4 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-white flex items-center">
                  <FiMapPin className="mr-2 text-purple-400" />
                  Delivery Address
                </h3>
                <button onClick={editAddress} className="text-purple-400 hover:text-purple-300 text-sm flex items-center">
                  <FiEdit3 className="mr-1 w-4 h-4" />
                  Change
                </button>
              </div>

              <div className="px-6 py-4">
                {currentUser.address ? (
                  <div className="space-y-2">
                    <p className="text-white font-medium">
                      {currentUser.firstName} {currentUser.lastName}
                    </p>
                    <p className="text-gray-300 text-sm">
                      {currentUser.address.addressInfo}
                    </p>
                    <p className="text-gray-300 text-sm">
                      {currentUser.address.city}, {currentUser.address.state}{" "}
                      {currentUser.address.pinCode}
                    </p>
                    <p className="text-gray-300 text-sm">
                      Phone: {currentUser.address.phoneNumber}
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-gray-400 mb-3">
                      No delivery address found
                    </p>
                    <button 
                      onClick={addAddress}
                      className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg text-sm"
                    >
                      Add Address
                    </button>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Payment Method */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="bg-[#13141f]/70 backdrop-blur-sm rounded-xl border border-purple-900/30 shadow-lg"
            >
              <div className="border-b border-purple-900/30 px-6 py-4">
                <h3 className="text-lg font-semibold text-white flex items-center">
                  <FiCreditCard className="mr-2 text-purple-400" />
                  Payment Method
                </h3>
              </div>

              <div className="px-6 py-4 space-y-3">
                {/* Cash on Delivery */}
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className={`p-4 rounded-lg border cursor-pointer transition-all duration-300 ${
                    paymentMethod === "COD"
                      ? "border-purple-500 bg-purple-500/10"
                      : "border-gray-700 hover:border-purple-700/50"
                  }`}
                  onClick={() => setPaymentMethod("COD")}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <FiTruck className="w-5 h-5 text-purple-400" />
                      <div>
                        <h4 className="text-white font-medium">
                          Cash on Delivery
                        </h4>
                        <p className="text-gray-400 text-sm">
                          Pay when order arrives
                        </p>
                      </div>
                    </div>
                    <div
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        paymentMethod === "COD"
                          ? "border-purple-500 bg-purple-500"
                          : "border-gray-400"
                      }`}
                    >
                      {paymentMethod === "COD" && (
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </div>
                  </div>
                </motion.div>

                {/* Online Payment */}
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className={`p-4 rounded-lg border cursor-pointer transition-all duration-300 ${
                    paymentMethod === "ONLINE"
                      ? "border-purple-500 bg-purple-500/10"
                      : "border-gray-700 hover:border-purple-700/50"
                  }`}
                  onClick={() => setPaymentMethod("ONLINE")}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <FiCreditCard className="w-5 h-5 text-purple-400" />
                      <div>
                        <h4 className="text-white font-medium">
                          Online Payment
                        </h4>
                        <p className="text-gray-400 text-sm">
                          Credit/Debit Card, UPI, Net Banking
                        </p>
                      </div>
                    </div>
                    <div
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        paymentMethod === "ONLINE"
                          ? "border-purple-500 bg-purple-500"
                          : "border-gray-400"
                      }`}
                    >
                      {paymentMethod === "ONLINE" && (
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Product Configuration - Professional Redesign */}
            {isBuyNow && buyNowProduct && (
              <div className="bg-white/5 backdrop-blur-sm rounded-lg border border-gray-600/30 shadow-sm">
                

                
              </div>
            )}
          </div>

          
          {/* Right Column - Order Summary */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="bg-[#13141f]/70 backdrop-blur-sm rounded-xl border border-purple-900/30 shadow-lg sticky top-24"
            >
              <div className="border-b border-purple-900/30 px-6 py-4">
                <h3 className="text-lg font-semibold text-white flex items-center">
                  <FiPackage className="mr-2 text-purple-400" />
                  Order Summary
                </h3>
              </div>

              <div className="px-6 py-4">
                {/* Order Items - Enhanced for Buy Now */}
                <div className="space-y-3 mb-6">
                  <h4 className="text-white font-medium text-sm">
                    {isBuyNow ? "Item (1)" : `Items (${currentItems.length})`}
                  </h4>
                  <div 
                    ref={scrollContainerRef}
                    className="checkout-scroll-container scrollbar-thin space-y-3 pr-2"
                    onWheel={(e) => {
                      // Prevent event bubbling to parent elements that might have smooth scroll
                      e.stopPropagation();
                    }}
                  >
                    {currentItems.map((item, index) => {
                      const selections = isBuyNow ? null : cartItemSelections[item.productId] || {};
                      const currentSize = isBuyNow ? buyNowSelectedSize : selections.selectedSize;
                      const currentQuantity = isBuyNow ? buyNowQuantity : selections.quantity || item.quantity;
                      
                      return (
                        <div
                          key={item.id}
                          className="p-4 rounded-lg bg-indigo-900/10 border border-indigo-500/20 space-y-3"
                        >
                          {/* Product Info */}
                          <div className="flex items-center space-x-3">
                            <img
                              src={item.image}
                              alt={item.title}
                              className="w-12 h-12 object-cover rounded border border-gray-600/30"
                              onError={(e) => {
                                e.target.src =
                                  "https://ext.same-assets.com/1329671863/375037467.gif";
                              }}
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-white text-sm font-medium truncate">
                                {item.title}
                              </p>
                              <div className="flex items-center space-x-2 mt-1">
                                <span className="text-gray-400 text-xs">
                                  ₹{(item.discount 
                                    ? item.price - (item.price * item.discount / 100) 
                                    : item.price
                                  ).toLocaleString('en-IN')} each
                                </span>
                                {item.discount > 0 && (
                                  <span className="text-green-400 text-xs">
                                    {item.discount}% OFF
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Size Selection for Cart Items */}
                          {!isBuyNow && (
                            <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="text-gray-300 text-xs font-medium">Size:</span>
                                {currentSize && (
                                  <span className="text-green-400 text-xs flex items-center">
                                    <FiCheck className="w-3 h-3 mr-1" />
                                    {currentSize}
                                  </span>
                                )}
                              </div>
                              <div className="grid grid-cols-5 gap-1">
                                {['S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                                  <button
                                    key={size}
                                    onClick={() => updateCartItemSize(item.productId, size)}
                                    className={`
                                      h-7 rounded text-xs font-medium transition-colors border
                                      ${currentSize === size
                                        ? 'bg-purple-600 border-purple-500 text-white'
                                        : 'bg-gray-700/50 border-gray-600 text-gray-300 hover:bg-gray-600/50 hover:border-purple-500/50'
                                      }
                                    `}
                                  >
                                    {size}
                                  </button>
                                ))}
                              </div>
                              {!currentSize && (
                                <p className="text-red-400 text-xs flex items-center">
                                  <FiAlertCircle className="w-3 h-3 mr-1" />
                                  Please select a size
                                </p>
                              )}
                            </div>
                          )}

                          {/* Quantity Selection for Cart Items */}
                          {!isBuyNow && (
                            <div className="space-y-2">
                              <span className="text-gray-300 text-xs font-medium">Quantity:</span>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center border border-gray-600 rounded">
                                  <button
                                    onClick={() => updateCartItemQuantity(item.productId, currentQuantity - 1)}
                                    disabled={currentQuantity <= 1}
                                    className="p-1.5 text-gray-300 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    <FiMinus className="w-3 h-3" />
                                  </button>
                                  <span className="px-3 py-1.5 text-white text-xs min-w-[40px] text-center">
                                    {currentQuantity}
                                  </span>
                                  <button
                                    onClick={() => updateCartItemQuantity(item.productId, currentQuantity + 1)}
                                    className="p-1.5 text-gray-300 hover:bg-gray-700"
                                  >
                                    <FiPlus className="w-3 h-3" />
                                  </button>
                                </div>
                                <div className="flex space-x-1">
                                  {[1, 2, 3, 5].map((qty) => (
                                    <button
                                      key={qty}
                                      onClick={() => updateCartItemQuantity(item.productId, qty)}
                                      className={`
                                        px-2 py-1 text-xs rounded border transition-colors
                                        ${currentQuantity === qty
                                          ? 'bg-purple-600 border-purple-500 text-white'
                                          : 'bg-gray-700/50 border-gray-600 text-gray-300 hover:bg-gray-600/50'
                                        }
                                      `}
                                    >
                                      {qty}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Buy Now Size Display */}
                          {isBuyNow && buyNowSelectedSize && (
                            <div className="flex items-center space-x-2">
                              <span className="text-gray-400 text-xs">Qty: {buyNowQuantity}</span>
                              <span className="text-gray-500">•</span>
                              <span className="text-purple-400 text-xs">Size: {buyNowSelectedSize}</span>
                            </div>
                          )}

                          {/* Total Price */}
                          <div className="flex justify-between items-center pt-2 border-t border-gray-600/30">
                            <span className="text-gray-300 text-xs">Total:</span>
                            <span className="text-white text-sm font-medium">
                              ₹{(
                                (item.discount
                                  ? item.price - (item.price * item.discount) / 100
                                  : item.price) * currentQuantity
                              ).toLocaleString('en-IN')}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Product Configuration Controls for Buy Now */}
                {isBuyNow && buyNowProduct && (
                  <div className="border-t border-purple-900/30 pt-4 mb-4">
                    <h4 className="text-white font-medium text-sm mb-3 flex items-center">
                      <FiSettings className="mr-2 text-purple-400 w-4 h-4" />
                      Product Configuration
                    </h4>
                    <div className="bg-indigo-900/20 rounded-lg p-4 space-y-4 border border-indigo-500/20">
                      
                      {/* Size Selection */}
                      {buyNowProduct.size && buyNowProduct.size.length > 0 && (
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-300 text-sm font-medium">Size:</span>
                            {buyNowSelectedSize && (
                              <span className="text-green-400 text-xs flex items-center">
                                <FiCheck className="w-3 h-3 mr-1" />
                                {buyNowSelectedSize} selected
                              </span>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-4 gap-2">
                            {buyNowProduct.size.map((size) => (
                              <button
                                key={size}
                                onClick={() => setBuyNowSelectedSize(size)}
                                className={`
                                  h-8 rounded text-xs font-medium transition-colors border
                                  ${buyNowSelectedSize === size
                                    ? 'bg-purple-600 border-purple-500 text-white'
                                    : 'bg-gray-700/50 border-gray-600 text-gray-300 hover:bg-gray-600/50 hover:border-purple-500/50'
                                  }
                                `}
                              >
                                {size}
                              </button>
                            ))}
                          </div>
                          
                          {!buyNowSelectedSize && (
                            <p className="text-red-400 text-xs flex items-center">
                              <FiAlertCircle className="w-3 h-3 mr-1" />
                              Please select a size
                            </p>
                          )}
                        </div>
                      )}

                      {/* Quantity Selection */}
                      <div className="space-y-2">
                        <span className="text-gray-300 text-sm font-medium">Quantity:</span>
                        
                        <div className="flex items-center justify-between">
                          {/* Quantity Controls */}
                          <div className="flex items-center border border-gray-600 rounded">
                            <button
                              onClick={() => setBuyNowQuantity(Math.max(1, buyNowQuantity - 1))}
                              disabled={buyNowQuantity <= 1}
                              className="p-1.5 text-gray-300 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <FiMinus size={14} />
                            </button>
                            
                            <span className="px-3 py-1.5 bg-gray-800/50 text-white font-medium text-sm min-w-[50px] text-center">
                              {buyNowQuantity}
                            </span>
                            
                            <button
                              onClick={() => setBuyNowQuantity(buyNowQuantity + 1)}
                              className="p-1.5 text-gray-300 hover:bg-gray-700"
                            >
                              <FiPlus size={14} />
                            </button>
                          </div>
                          
                          {/* Quick Select */}
                          <div className="flex space-x-1">
                            {[1, 2, 3, 5].map((qty) => (
                              <button
                                key={qty}
                                onClick={() => setBuyNowQuantity(qty)}
                                className={`
                                  px-2 py-1 text-xs rounded border transition-colors
                                  ${buyNowQuantity === qty
                                    ? 'bg-purple-600 border-purple-500 text-white'
                                    : 'bg-gray-700/50 border-gray-600 text-gray-300 hover:bg-gray-600/50'
                                  }
                                `}
                              >
                                {qty}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Price Summary */}
                      <div className="pt-3 border-t border-purple-900/30">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-300 text-sm">Unit Price:</span>
                          <div className="text-right">
                            <span className="text-white text-sm font-medium">
                              ₹{(buyNowProduct.discount 
                                ? buyNowProduct.price - (buyNowProduct.price * buyNowProduct.discount / 100) 
                                : buyNowProduct.price
                              ).toLocaleString('en-IN')}
                            </span>
                            {buyNowProduct.discount > 0 && (
                              <div className="flex items-center justify-end space-x-1 mt-1">
                                <span className="text-xs line-through text-gray-500">
                                  ₹{buyNowProduct.price.toLocaleString('en-IN')}
                                </span>
                                <span className="px-1 py-0.5 bg-green-600/20 text-green-400 text-xs rounded">
                                  {buyNowProduct.discount}% OFF
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-white text-sm font-medium">Total:</span>
                          <span className="text-purple-400 text-sm font-semibold">
                            ₹{((buyNowProduct.discount 
                              ? buyNowProduct.price - (buyNowProduct.price * buyNowProduct.discount / 100) 
                              : buyNowProduct.price) * buyNowQuantity).toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Price Breakdown - Updated for Buy Now */}
                <div className="space-y-3 border-t border-purple-900/30 pt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">Subtotal</span>
                    <span className="text-white">
                      ₹{currentOrderSummary.subtotal?.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">Delivery</span>
                    <span className="text-white">
                      {currentOrderSummary.shipping === 0 ? (
                        <span className="text-green-400">Free</span>
                      ) : (
                        `₹${currentOrderSummary.shipping?.toLocaleString('en-IN')}`
                      )}
                    </span>
                  </div>
                  {currentOrderSummary.subtotal >= 2000 && (
                    <div className="text-xs text-green-400 text-center">
                      🎉 Free delivery on orders ≥ ₹2,000
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-bold border-t border-purple-900/30 pt-3">
                    <span className="text-white">Total</span>
                    <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
                      ₹{currentOrderSummary.total?.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Error Display */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-4 bg-red-900/30 border border-red-500/50 rounded-lg"
                  >
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">!</span>
                      </div>
                      <p className="text-red-300 text-sm">{error}</p>
                    </div>
                  </motion.div>
                )}

                {/* Place Order Button */}
                <button
                  onClick={handlePlaceOrder}
                  disabled={
                    isProcessing ||
                    !currentUser.address ||
                    (isBuyNow && buyNowProduct.size && buyNowProduct.size.length > 0 && !buyNowSelectedSize)
                  }
                  className="w-full mt-6 py-4 px-4 rounded-lg overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed relative group"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 group-hover:from-pink-600 group-hover:via-purple-600 group-hover:to-indigo-600 transition-all duration-300"></span>
                  <span className="relative flex items-center justify-center text-white font-semibold">
                    {isProcessing ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      <>
                        <FiLock className="mr-2" />
                        {paymentMethod === "COD"
                          ? "Place Order"
                          : "Proceed to Payment"}
                      </>
                    )}
                  </span>
                </button>

                {/* Security Badge */}
                <div className="mt-4 text-center">
                  <div className="flex items-center justify-center space-x-2 text-green-400 text-xs">
                    <FiLock className="w-3 h-3" />
                    <span>Secure checkout with 256-bit SSL encryption</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>  
    </div>
  );
};

export default Checkout;
