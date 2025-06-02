import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiCheck,
  FiPackage,
  FiArrowRight,
  FiRefreshCw,
  FiAlertCircle,
} from "react-icons/fi";
import { verifyPayment as verifyPaymentAPI } from "../../Api/user";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [paymentStatus, setPaymentStatus] = useState("loading");
  const [orderDetails, setOrderDetails] = useState(null);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(null);
  const [countdownInterval, setCountdownInterval] = useState(null);

  const sessionId = searchParams.get("session_id");
  const orderId = searchParams.get("order_id");

  useEffect(() => {
    if (sessionId) {
      verifyPayment();
    } else {
      setError("Invalid payment session");
      setPaymentStatus("error");
    }
  }, [sessionId]);

  // Cleanup countdown interval on component unmount
  useEffect(() => {
    return () => {
      if (countdownInterval) {
        clearInterval(countdownInterval);
      }
    };
  }, [countdownInterval]);

  const verifyPayment = async () => {
    try {
      const response = await verifyPaymentAPI(sessionId);
      
      if (response.success) {
        setOrderDetails(response.payment);
        setPaymentStatus("success");
        
        // Show appropriate message for already verified payments
        if (response.payment.isAlreadyVerified) {
          console.log("Payment was already verified");
        }

        // Start countdown and auto-redirect to orders page after 5 seconds
        setCountdown(5);
        const interval = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(interval);
              navigate("/orders");
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
        
        setCountdownInterval(interval);
        
      } else {
        throw new Error(response.message || "Payment verification failed");
      }
    } catch (error) {
      console.error("Error verifying payment:", error);
      setError(error.response?.data?.message || error.message || "Failed to verify payment");
      setPaymentStatus("error");
    }
  };

  const handleViewOrders = () => {
    // Clear countdown if active
    if (countdownInterval) {
      clearInterval(countdownInterval);
      setCountdownInterval(null);
    }
    setCountdown(null);
    navigate("/orders");
  };

  const handleContinueShopping = () => {
    navigate("/");
  };

  if (paymentStatus === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0c0e16] to-[#161927] pt-24 flex items-center justify-center">
        <div className="text-center">
          <FiRefreshCw className="w-16 h-16 text-purple-400 animate-spin mx-auto mb-6" />
          <h2 className="text-2xl font-semibold text-white mb-4">
            Verifying Payment...
          </h2>
          <p className="text-gray-300">
            Please wait while we confirm your payment
          </p>
        </div>
      </div>
    );
  }

  if (paymentStatus === "error") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0c0e16] to-[#161927] pt-24 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-24 h-24 bg-gradient-to-r from-red-400 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <FiAlertCircle className="w-12 h-12 text-white" />
          </motion.div>
          
          <h2 className="text-3xl font-bold text-white mb-4">
            Payment Verification Failed
          </h2>
          
          <p className="text-gray-300 mb-6">
            {error || "We couldn't verify your payment. Please contact support if you believe this is an error."}
          </p>
          
          <div className="space-y-3">
            <button
              onClick={handleViewOrders}
              className="w-full py-3 px-6 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-indigo-600 hover:to-purple-600 transition-all duration-300"
            >
              View Orders
            </button>
            <button
              onClick={handleContinueShopping}
              className="w-full py-3 px-6 border border-purple-500 text-purple-400 rounded-lg hover:bg-purple-500/10 transition-all duration-300"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

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
            Payment Successful!
          </h2>
          
          {orderDetails && (
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 mb-6 border border-purple-500/20">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Order ID:</span>
                  <span className="text-white font-mono">#{orderDetails.trackingId}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Amount Paid:</span>
                  <span className="text-green-400 font-semibold">₹{orderDetails.amount?.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Payment Status:</span>
                  <span className="text-green-400 capitalize">{orderDetails.paymentStatus}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Order Status:</span>
                  <span className="text-purple-400 capitalize">{orderDetails.orderStatus}</span>
                </div>
              </div>
            </div>
          )}
          
          <p className="text-gray-300 mb-6">
            Thank you for your purchase! Your order has been confirmed and will be processed shortly.
          </p>
          
          {countdown !== null && (
            <div className="mb-6 p-4 bg-green-900/20 border border-green-500/30 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-300 text-sm font-medium">
                    Redirecting to your orders in {countdown} second{countdown !== 1 ? 's' : ''}...
                  </p>
                  <p className="text-green-400/70 text-xs mt-1">
                    You'll be taken to track your order automatically
                  </p>
                </div>
                <button
                  onClick={handleViewOrders}
                  className="text-green-400 hover:text-green-300 text-sm font-medium border border-green-500/50 px-3 py-1 rounded-lg hover:bg-green-500/10 transition-all duration-200"
                >
                  Go Now
                </button>
              </div>
            </div>
          )}
          
          <div className="space-y-3">
            <button
              onClick={handleViewOrders}
              className="w-full py-3 px-6 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 flex items-center justify-center"
            >
              <FiPackage className="mr-2" />
              View My Orders
              <FiArrowRight className="ml-2" />
            </button>
            <button
              onClick={handleContinueShopping}
              className="w-full py-3 px-6 border border-purple-500 text-purple-400 rounded-lg hover:bg-purple-500/10 transition-all duration-300"
            >
              Continue Shopping
            </button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default PaymentSuccess;
