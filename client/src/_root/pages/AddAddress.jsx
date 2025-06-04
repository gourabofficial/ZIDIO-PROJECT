import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthdata } from "../../context/AuthContext";
import { FiMapPin, FiArrowLeft, FiCheck, FiHome, FiGlobe, FiFlag, FiNavigation, FiMail, FiPhone } from "react-icons/fi";
import { updateAddress, addAddress } from "../../Api/user";
import MiniLoader from "../../components/Loader/MiniLoader";
import toast, { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from "framer-motion";

const AddAddress = () => {
  const { currentUser, isAuth, isLoaded, refetchUserData } = useAuthdata();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [addressForm, setAddressForm] = useState({
    addressInfo: "",
    city: "",
    state: "",
    pinCode: "",
    country: "",
    phoneNumber: "", // Added phone number field
  });

  // Initialize form with existing address data if it exists
  useEffect(() => {
    if (currentUser?.address && typeof currentUser.address === 'object') {
      setAddressForm({
        addressInfo: currentUser.address.addressInfo || "",
        city: currentUser.address.city || "",
        state: currentUser.address.state || "",
        pinCode: currentUser.address.pinCode || "",
        country: currentUser.address.country || "",
        phoneNumber: currentUser.address.phoneNumber || "", // Added phone number
      });
    }
  }, [currentUser]);

  // Handle loading state
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0c0e16] to-[#161927] flex items-center justify-center">
        <MiniLoader />
      </div>
    );
  }

  // Redirect if not authenticated
  if (!isAuth) {
    navigate("/sign-in");
    return null;
  }

  const handleAddressInputChange = (e) => {
    const { name, value } = e.target;
    setAddressForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitAddress = async () => {
    // Form validation
    if (!addressForm.addressInfo || !addressForm.city || !addressForm.state || 
        !addressForm.pinCode || !addressForm.country || !addressForm.phoneNumber) {
      toast.error("Please fill in all address fields");
      return;
    }
    
    setIsSubmitting(true);
    const hasExistingAddress = !!currentUser.address;
    const loadingToast = toast.loading(hasExistingAddress ? 'Updating address...' : 'Adding address...', {
      style: {
        background: 'rgba(19, 20, 31, 0.9)',
        backdropFilter: 'blur(10px)',
        color: '#fff',
        border: '1px solid rgba(124, 58, 237, 0.3)',
      },
      iconTheme: {
        primary: '#8b5cf6',
        secondary: '#ffffff',
      },
    });
    
    try {
      const response = hasExistingAddress
        ? await updateAddress({
            ...addressForm,
            addressId: typeof currentUser.address === 'object' 
              ? currentUser.address._id 
              : currentUser.address
          })
        : await addAddress(addressForm);
      
      if (response.success) {
        await refetchUserData();
        toast.success(hasExistingAddress ? 'Address updated successfully!' : 'Address added successfully!', {
          id: loadingToast,
          style: {
            background: 'rgba(19, 20, 31, 0.9)',
            backdropFilter: 'blur(10px)',
            color: '#fff',
            border: '1px solid rgba(124, 58, 237, 0.3)',
          },
          iconTheme: {
            primary: '#10b981',
            secondary: '#ffffff',
          },
        });
        
        // Small delay before navigation for toast to be visible
        setTimeout(() => navigate("/account-settings"), 800);
      } else {
        toast.error(response.message || 'Failed to save address', {
          id: loadingToast,
          style: {
            background: 'rgba(19, 20, 31, 0.9)',
            backdropFilter: 'blur(10px)',
            color: '#fff',
            border: '1px solid rgba(220, 38, 38, 0.3)',
          },
        });
      }
    } catch (error) {
      console.error("Error saving address:", error);
      toast.error('An error occurred while saving address', {
        id: loadingToast,
        style: {
          background: 'rgba(19, 20, 31, 0.9)',
          backdropFilter: 'blur(10px)',
          color: '#fff',
          border: '1px solid rgba(220, 38, 38, 0.3)',
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Input field component for consistent styling
  const InputField = ({ label, name, value, onChange, icon: Icon, placeholder }) => (
    <div>
      <label htmlFor={name} className=" text-indigo-300 text-sm mb-1.5 flex items-center gap-2">
        <Icon size={14} className="text-indigo-400" /> {label}
      </label>
      <input
        type="text"
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-[#0c0e16] text-white border border-indigo-500/30 focus:border-indigo-500/60 rounded-md p-2.5 transition-colors outline-none hover:border-indigo-500/50"
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0c0e16] to-[#161927] pt-24 pb-16 px-4 md:px-8">
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          success: {
            icon: '🚀',
            style: {
              background: 'rgba(19, 20, 31, 0.9)',
              backdropFilter: 'blur(10px)',
              color: '#fff',
              border: '1px solid rgba(124, 58, 237, 0.3)',
            },
          },
          error: {
            icon: '❌',
            style: {
              background: 'rgba(19, 20, 31, 0.9)',
              backdropFilter: 'blur(10px)',
              color: '#fff',
              border: '1px solid rgba(220, 38, 38, 0.3)',
            },
          },
        }}
      />
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto"
      >
        <div className="flex items-center gap-3 mb-8">
          <Link 
            to="/account-settings" 
            className="flex items-center justify-center w-10 h-10 rounded-full bg-[#13141f]/60 backdrop-blur-sm border border-indigo-500/20 text-white hover:bg-indigo-700/20 transition-all hover:border-indigo-500/40"
          >
            <FiArrowLeft size={20} />
          </Link>
          
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
            {currentUser.address ? 'Update Address' : 'Add New Address'}
          </h1>
        </div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="bg-[#13141f]/70 backdrop-blur-sm rounded-xl p-6 md:p-8 shadow-lg border border-indigo-500/20"
        >
          <h2 className="text-xl font-semibold bg-gradient-to-r from-indigo-400 to-purple-400 text-transparent bg-clip-text flex items-center gap-2 mb-6">
            <FiMapPin className="text-indigo-400" />
            <span>Shipping Details</span>
          </h2>

          <div className="space-y-6">
            {/* Street Address */}
            <InputField 
              label="Street Address"
              name="addressInfo"
              value={addressForm.addressInfo}
              onChange={handleAddressInputChange}
              icon={FiHome}
              placeholder="Enter your street address, apartment, etc."
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* City */}
              <InputField 
                label="City"
                name="city"
                value={addressForm.city}
                onChange={handleAddressInputChange}
                icon={FiNavigation}
                placeholder="City"
              />
              
              {/* State/Province */}
              <InputField 
                label="State/Province"
                name="state"
                value={addressForm.state}
                onChange={handleAddressInputChange}
                icon={FiFlag}
                placeholder="State or province"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Postal/ZIP Code */}
              <InputField 
                label="Postal/ZIP Code"
                name="pinCode"
                value={addressForm.pinCode}
                onChange={handleAddressInputChange}
                icon={FiMail}
                placeholder="Postal or ZIP code"
              />
              
              {/* Country */}
              <InputField 
                label="Country"
                name="country"
                value={addressForm.country}
                onChange={handleAddressInputChange}
                icon={FiGlobe}
                placeholder="Country"
              />
            </div>

            {/* Phone Number */}
            <InputField 
              label="Phone Number"
              name="phoneNumber"
              value={addressForm.phoneNumber}
              onChange={handleAddressInputChange}
              icon={FiPhone}
              placeholder="Contact phone number"
            />

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mt-8 pt-4 border-t border-indigo-500/10">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmitAddress}
                disabled={isSubmitting}
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-md text-sm font-medium transition-all shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/30 flex items-center justify-center"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <FiCheck size={16} /> 
                    {currentUser.address ? "Update Address" : "Save Address"}
                  </span>
                )}
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/account-settings")}
                disabled={isSubmitting}
                className="px-6 py-3 bg-[#0c0e16] text-gray-300 border border-gray-700 hover:border-gray-600 hover:text-white rounded-md text-sm font-medium transition-all flex items-center justify-center"
              >
                Cancel
              </motion.button>
            </div>
          </div>
        </motion.div>
        
        {/* Additional Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mt-6 bg-indigo-900/20 backdrop-blur-sm rounded-lg p-4 border border-indigo-500/20"
        >
          <p className="text-indigo-300 text-sm flex items-start">
            <svg className="flex-shrink-0 h-5 w-5 text-indigo-400 mt-0.5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
            </svg>
            Your shipping address is used for delivery of physical products and to calculate applicable taxes.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AddAddress;