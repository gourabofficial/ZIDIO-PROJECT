import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiX,
  FiShoppingCart,
  FiArrowLeft,
  FiRefreshCw,
  FiAlertTriangle,
} from "react-icons/fi";
import axiosInstance from "../../Api/config";

const PaymentCancel = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);

  const orderId = searchParams.get("order_id");

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/user/orders/${orderId}`);
      
      if (response.data.success) {
        setOrderDetails(response.data.order);
      }
    } catch (error) {
      console.error("Error fetching order details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRetryPayment = () => {
    // Navigate back to checkout or orders page to retry payment
    if (orderDetails) {
      navigate("/orders");
    } else {
      navigate("/cart");
    }
  };

  const handleContinueShopping = () => {
    navigate("/");
  };

  const handleViewCart = () => {
    navigate("/cart");
  };

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
          className="w-24 h-24 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <FiX className="w-12 h-12 text-white" />
        </motion.div>
        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-3xl font-bold text-white mb-4">
            Payment Cancelled
          </h2>
          
          <p className="text-gray-300 mb-6">
            Your payment was cancelled. Don't worry, no charges were made to your account.
          </p>

          {loading && (
            <div className="flex items-center justify-center space-x-2 mb-6">
              <FiRefreshCw className="w-4 h-4 text-purple-400 animate-spin" />
              <span className="text-gray-300 text-sm">Loading order details...</span>
            </div>
          )}
          
          {orderDetails && (
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 mb-6 border border-orange-500/20">
              <div className="flex items-center space-x-2 mb-3">
                <FiAlertTriangle className="w-5 h-5 text-orange-400" />
                <h3 className="text-white font-semibold">Order on Hold</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Order ID:</span>
                  <span className="text-white font-mono">#{orderDetails.trackingId}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Amount:</span>
                  <span className="text-orange-400 font-semibold">₹{orderDetails.totalAmount?.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Status:</span>
                  <span className="text-orange-400 capitalize">{orderDetails.Orderstatus}</span>
                </div>
              </div>
              <div className="mt-4 p-3 bg-orange-900/20 border border-orange-500/30 rounded-lg">
                <p className="text-orange-300 text-xs">
                  Your order has been created but payment is pending. You can complete the payment later from your orders page.
                </p>
              </div>
            </div>
          )}
          
          <div className="space-y-3">
            {orderDetails && (
              <button
                onClick={handleRetryPayment}
                className="w-full py-3 px-6 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 flex items-center justify-center"
              >
                <FiRefreshCw className="mr-2" />
                Complete Payment
              </button>
            )}
            
            <button
              onClick={handleViewCart}
              className="w-full py-3 px-6 border border-purple-500 text-purple-400 rounded-lg hover:bg-purple-500/10 transition-all duration-300 flex items-center justify-center"
            >
              <FiShoppingCart className="mr-2" />
              View Cart
            </button>
            
            <button
              onClick={handleContinueShopping}
              className="w-full py-3 px-6 border border-gray-500 text-gray-400 rounded-lg hover:bg-gray-500/10 transition-all duration-300 flex items-center justify-center"
            >
              <FiArrowLeft className="mr-2" />
              Continue Shopping
            </button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};


export default PaymentCancel;
