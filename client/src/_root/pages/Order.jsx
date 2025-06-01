import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiPackage,
  FiTruck,
  FiCheck,
  FiClock,
  FiMapPin,
  FiPhone,
  FiMail,
  FiCalendar,
  FiCreditCard,
  FiEye,
  FiArrowLeft,
  FiRefreshCw,
  FiAlertCircle,
} from "react-icons/fi";
import { getUserOrders, getOrderById } from "../../Api/user";
import { useAuthdata } from "../../context/AuthContext";

const Order = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, isAuth, isLoaded } = useAuthdata();

  // State
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Check for success state from checkout
  useEffect(() => {
    if (location.state?.showSuccess && location.state?.newOrder) {
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 5000);
    }
  }, [location.state]);

  // Fetch orders
  const fetchOrders = async (page = 1) => {
    try {
      setLoading(true);
      setError("");
      const response = await getUserOrders(page, 10);
      
      if (response.success) {
        setOrders(response.orders || []);
        setCurrentPage(response.pagination?.currentPage || 1);
        setTotalPages(response.pagination?.totalPages || 1);
      } else {
        throw new Error(response.message || "Failed to fetch orders");
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError(err.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  // Fetch order details
  const fetchOrderDetails = async (orderId) => {
    try {
      const response = await getOrderById(orderId);
      if (response.success) {
        setSelectedOrder(response.order);
        setShowOrderDetails(true);
      } else {
        throw new Error(response.message || "Failed to fetch order details");
      }
    } catch (err) {
      console.error("Error fetching order details:", err);
      setError(err.message || "Failed to load order details");
    }
  };

  useEffect(() => {
    if (isLoaded && isAuth) {
      fetchOrders();
    }
  }, [isLoaded, isAuth]);

  // Get status color and icon
  const getStatusConfig = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return {
          color: "text-yellow-400",
          bg: "bg-yellow-900/30",
          border: "border-yellow-500/50",
          icon: FiClock,
        };
      case "processing":
        return {
          color: "text-blue-400",
          bg: "bg-blue-900/30",
          border: "border-blue-500/50",
          icon: FiPackage,
        };
      case "shipped":
        return {
          color: "text-purple-400",
          bg: "bg-purple-900/30",
          border: "border-purple-500/50",
          icon: FiTruck,
        };
      case "delivered":
        return {
          color: "text-green-400",
          bg: "bg-green-900/30",
          border: "border-green-500/50",
          icon: FiCheck,
        };
      default:
        return {
          color: "text-gray-400",
          bg: "bg-gray-900/30",
          border: "border-gray-500/50",
          icon: FiClock,
        };
    }
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Loading state
  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-[#0c0e16] pt-24 flex items-center justify-center">
        <div className="text-center">
          <FiRefreshCw className="w-12 h-12 text-purple-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-300">Loading your orders...</p>
        </div>
      </div>
    );
  }

  // Auth check
  if (!isAuth) {
    return (
      <div className="min-h-screen bg-[#0c0e16] pt-24 flex items-center justify-center">
        <div className="text-center">
          <FiAlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">Authentication Required</h2>
          <p className="text-gray-300 mb-6">Please log in to view your orders.</p>
          <button
            onClick={() => navigate("/sign-in")}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0c0e16] pt-24 pb-16 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <button
              onClick={() => navigate(-1)}
              className="mr-4 p-2 text-gray-400 hover:text-white hover:bg-purple-600/20 rounded-lg transition-all duration-200"
            >
              <FiArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
                My Orders
              </h1>
              <p className="text-gray-300 text-sm mt-1">
                Track and manage your orders
              </p>
            </div>
          </div>
          <button
            onClick={() => fetchOrders(currentPage)}
            className="p-3 bg-purple-600/20 hover:bg-purple-600/30 rounded-lg border border-purple-500/50 transition-all duration-200"
          >
            <FiRefreshCw className="w-5 h-5 text-purple-400" />
          </button>
        </div>

        {/* Success Message */}
        <AnimatePresence>
          {showSuccessMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6 p-4 bg-green-900/30 border border-green-500/50 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <FiCheck className="w-5 h-5 text-green-400" />
                <div>
                  <h3 className="text-green-400 font-semibold">Order Placed Successfully!</h3>
                  <p className="text-green-300 text-sm">
                    Your order has been received and is being processed.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-900/30 border border-red-500/50 rounded-lg"
          >
            <div className="flex items-center space-x-2">
              <FiAlertCircle className="w-5 h-5 text-red-400" />
              <p className="text-red-300">{error}</p>
            </div>
          </motion.div>
        )}

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="text-center py-16">
            <FiPackage className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Orders Found</h3>
            <p className="text-gray-400 mb-6">You haven't placed any orders yet.</p>
            <button
              onClick={() => navigate("/")}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const statusConfig = getStatusConfig(order.Orderstatus);
              const StatusIcon = statusConfig.icon;

              return (
                <motion.div
                  key={order._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-purple-900/30 p-6 hover:border-purple-500/50 transition-all duration-200"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                    {/* Order Info */}
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <h3 className="text-lg font-semibold text-white">
                          Order #{order.trackingId}
                        </h3>
                        <div
                          className={`flex items-center space-x-2 px-3 py-1 rounded-full border ${statusConfig.bg} ${statusConfig.border}`}
                        >
                          <StatusIcon className={`w-4 h-4 ${statusConfig.color}`} />
                          <span className={`text-sm font-medium ${statusConfig.color}`}>
                            {order.Orderstatus?.charAt(0).toUpperCase() + order.Orderstatus?.slice(1)}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center space-x-2 text-gray-300">
                          <FiCalendar className="w-4 h-4" />
                          <span>{formatDate(order.createdAt)}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-300">
                          <FiCreditCard className="w-4 h-4" />
                          <span>₹{order.totalAmount?.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-300">
                          <FiPackage className="w-4 h-4" />
                          <span>{order.products?.length || 0} items</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-3">
                      <button
                        onClick={() => fetchOrderDetails(order._id)}
                        className="flex items-center space-x-2 px-4 py-2 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/50 rounded-lg transition-all duration-200"
                      >
                        <FiEye className="w-4 h-4 text-purple-400" />
                        <span className="text-purple-400 text-sm font-medium">View Details</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-4 mt-8">
            <button
              onClick={() => fetchOrders(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
            >
              Previous
            </button>
            <span className="text-gray-300">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => fetchOrders(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      <AnimatePresence>
        {showOrderDetails && selectedOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowOrderDetails(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-800 rounded-xl border border-purple-500/50 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">Order Details</h2>
                  <button
                    onClick={() => setShowOrderDetails(false)}
                    className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <span className="text-gray-400 text-xl">×</span>
                  </button>
                </div>

                {/* Order Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Order Information</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Order ID:</span>
                        <span className="text-white font-mono">#{selectedOrder.trackingId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Date:</span>
                        <span className="text-white">{formatDate(selectedOrder.createdAt)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Status:</span>
                        <span className={getStatusConfig(selectedOrder.Orderstatus).color}>
                          {selectedOrder.Orderstatus?.charAt(0).toUpperCase() + selectedOrder.Orderstatus?.slice(1)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Payment:</span>
                        <span className="text-white">{selectedOrder.paymentMethod}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Payment Details</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Total Amount:</span>
                        <span className="text-green-400 font-semibold">₹{selectedOrder.totalAmount?.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Payment Status:</span>
                        <span className={selectedOrder.paymentStatus === 'paid' ? 'text-green-400' : 'text-yellow-400'}>
                          {selectedOrder.paymentStatus?.charAt(0).toUpperCase() + selectedOrder.paymentStatus?.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Products */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-3">Order Items</h3>
                  <div className="space-y-3">
                    {selectedOrder.products?.map((product, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-gray-700/50 rounded-lg">
                        <div>
                          <h4 className="text-white font-medium">{product.title}</h4>
                          <p className="text-gray-400 text-sm">Quantity: {product.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-white font-semibold">₹{product.payable_price?.toLocaleString('en-IN')}</p>
                          {product.offer > 0 && (
                            <p className="text-gray-400 text-sm line-through">₹{product.original_price?.toLocaleString('en-IN')}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Order;
